import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Bus from "../models/Bus.js"

/* =========================================================
   GENERATE BOOKING ID
========================================================= */

const generateBookingId = () => {
    const randomNumber = Math.floor(
        100000 + Math.random() * 900000
    )

    return `SOLAN${randomNumber}`
}

/* =========================================================
   CREATE BOOKING
========================================================= */

export const createBooking = async (req, res) => {
    try {
        console.log("========================================")
        console.log("CREATE BOOKING REQUEST")
        console.log("========================================")
        console.log("Request body:", req.body)

        const {
            busId,
            busName,
            operator,
            from,
            to,
            travelDate,
            departureTime,

            /* IMPORTANT:
               These names match Booking.js
               and Payment.jsx
            */
            passengerName,
            passengerAge,
            passengerGender,
            passengerPhone,
            passengerEmail,

            selectedSeats,
            totalAmount,

            paymentMethod,
            paymentStatus,
            bookingStatus,
        } = req.body

        /* =====================================================
           VALIDATE REQUIRED FIELDS
        ===================================================== */

        const missingFields = []

        if (!busId) {
            missingFields.push("busId")
        }

        if (!busName) {
            missingFields.push("busName")
        }

        if (!operator) {
            missingFields.push("operator")
        }

        if (!from) {
            missingFields.push("from")
        }

        if (!to) {
            missingFields.push("to")
        }

        if (!travelDate) {
            missingFields.push("travelDate")
        }

        if (!departureTime) {
            missingFields.push("departureTime")
        }

        if (!passengerName) {
            missingFields.push("passengerName")
        }

        if (
            passengerAge === undefined ||
            passengerAge === null ||
            Number(passengerAge) <= 0
        ) {
            missingFields.push("passengerAge")
        }

        if (!passengerGender) {
            missingFields.push("passengerGender")
        }

        if (!passengerPhone) {
            missingFields.push("passengerPhone")
        }

        if (
            !Array.isArray(selectedSeats) ||
            selectedSeats.length === 0
        ) {
            missingFields.push("selectedSeats")
        }

        if (
            totalAmount === undefined ||
            totalAmount === null ||
            Number(totalAmount) <= 0
        ) {
            missingFields.push("totalAmount")
        }

        if (!paymentMethod) {
            missingFields.push("paymentMethod")
        }

        if (missingFields.length > 0) {
            console.log(
                "Missing fields:",
                missingFields
            )

            return res.status(400).json({
                success: false,
                message:
                    "Please provide all required booking details",
                missingFields,
            })
        }

        /* =====================================================
           VALIDATE MONGODB BUS ID
        ===================================================== */

        if (!mongoose.isValidObjectId(busId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid MongoDB bus ID",
            })
        }

        /* =====================================================
           FIND BUS
        ===================================================== */

        const bus =
            await Bus.findById(busId)

        if (!bus) {
            return res.status(404).json({
                success: false,
                message:
                    "Bus not found in MongoDB",
            })
        }

        console.log(
            "Bus found:",
            bus.busName,
            bus._id.toString()
        )

        /* =====================================================
           NORMALIZE SEATS
        ===================================================== */

        const seats = [
            ...new Set(
                selectedSeats.map(
                    (seat) =>
                        String(seat)
                            .trim()
                            .toUpperCase()
                )
            ),
        ]

        /* =====================================================
           VALIDATE SELECTED SEATS
        ===================================================== */

        const invalidSeats = []

        const alreadyBookedSeats = []

        seats.forEach(
            (selectedSeat) => {
                const busSeat =
                    bus.seats.find(
                        (seat) =>
                            String(
                                seat.seatNumber
                            )
                                .trim()
                                .toUpperCase() ===
                            selectedSeat
                    )

                if (!busSeat) {
                    invalidSeats.push(
                        selectedSeat
                    )

                    return
                }

                if (busSeat.isBooked) {
                    alreadyBookedSeats.push(
                        selectedSeat
                    )
                }
            }
        )

        if (
            invalidSeats.length > 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid seat(s): ${invalidSeats.join(", ")}`,
            })
        }

        if (
            alreadyBookedSeats.length > 0
        ) {
            return res.status(409).json({
                success: false,
                message:
                    `Seat(s) ${alreadyBookedSeats.join(
                        ", "
                    )} are already booked. Please select different seats.`,
            })
        }

        /* =====================================================
           CHECK AVAILABLE SEATS
        ===================================================== */

        if (
            seats.length >
            bus.availableSeats
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Only ${bus.availableSeats} seats are available.`,
            })
        }

        /* =====================================================
           CALCULATE TOTAL
        ===================================================== */

        const calculatedAmount =
            seats.length *
            Number(bus.price)

        const frontendAmount =
            Number(totalAmount)

        /*
          MongoDB bus price is the
          source of truth.
        */

        const finalAmount =
            calculatedAmount

        console.log(
            "Seat count:",
            seats.length
        )

        console.log(
            "Bus price:",
            bus.price
        )

        console.log(
            "Frontend amount:",
            frontendAmount
        )

        console.log(
            "Final amount:",
            finalAmount
        )

        /* =====================================================
           MARK SEATS AS BOOKED
        ===================================================== */

        bus.seats =
            bus.seats.map(
                (seat) => {
                    const seatNumber =
                        String(
                            seat.seatNumber
                        )
                            .trim()
                            .toUpperCase()

                    if (
                        seats.includes(
                            seatNumber
                        )
                    ) {
                        seat.isBooked =
                            true
                    }

                    return seat
                }
            )

        bus.availableSeats =
            bus.availableSeats -
            seats.length

        /* =====================================================
           SAVE BUS
        ===================================================== */

        await bus.save()

        console.log(
            "Bus seats updated successfully"
        )

        /* =====================================================
           PAYMENT STATUS
        ===================================================== */

        const finalPaymentStatus =
            paymentMethod === "Cash" ||
                paymentMethod ===
                "Pay at Counter"
                ? "Pending"
                : "Paid"

        /* =====================================================
           BOOKING STATUS
        ===================================================== */

        const finalBookingStatus =
            bookingStatus ||
            "Confirmed"

        /* =====================================================
           GENERATE UNIQUE BOOKING ID
        ===================================================== */

        let bookingId

        let bookingExists = true

        while (bookingExists) {
            bookingId =
                generateBookingId()

            bookingExists =
                await Booking.exists({
                    bookingId,
                })
        }

        /* =====================================================
           CREATE BOOKING
        ===================================================== */

        const booking =
            await Booking.create({

                bookingId,

                busId:
                    bus._id,

                busName:
                    busName ||
                    bus.busName ||
                    `${bus.operator} Bus`,

                operator:
                    operator ||
                    bus.operator,

                from:
                    from ||
                    bus.from,

                to:
                    to ||
                    bus.to,

                travelDate,

                departureTime:
                    departureTime ||
                    bus.departureTime,

                /* =========================================
                   PASSENGER DETAILS

                   IMPORTANT:
                   These names MUST match Booking.js
                ========================================= */

                passengerName:
                    String(
                        passengerName
                    ).trim(),

                passengerAge:
                    Number(
                        passengerAge
                    ),

                passengerGender:
                    String(
                        passengerGender
                    ).trim(),

                passengerPhone:
                    String(
                        passengerPhone
                    ).trim(),

                passengerEmail:
                    passengerEmail
                        ? String(
                            passengerEmail
                        ).trim()
                        : "",

                /* =========================================
                   SEATS
                ========================================= */

                selectedSeats:
                    seats,

                /* =========================================
                   PAYMENT
                ========================================= */

                totalAmount:
                    finalAmount,

                paymentMethod,

                paymentStatus:
                    finalPaymentStatus,

                bookingStatus:
                    finalBookingStatus,
            })

        console.log(
            "BOOKING CREATED:",
            booking.bookingId
        )

        /* =====================================================
           SUCCESS RESPONSE
        ===================================================== */

        return res.status(201).json({
            success: true,

            message:
                "Booking confirmed successfully",

            data: booking,
        })

    } catch (error) {

        console.error(
            "CREATE BOOKING ERROR:",
            error
        )

        /* =====================================================
           MONGOOSE VALIDATION ERROR
        ===================================================== */

        if (
            error.name ===
            "ValidationError"
        ) {

            const validationErrors =
                Object.values(
                    error.errors
                ).map(
                    (item) =>
                        item.message
                )

            return res.status(400).json({

                success: false,

                message:
                    "Booking validation failed",

                errors:
                    validationErrors,
            })
        }

        /* =====================================================
           DUPLICATE BOOKING ID
        ===================================================== */

        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Booking ID already exists. Please try again.",
            })
        }

        /* =====================================================
           GENERAL ERROR
        ===================================================== */

        return res.status(500).json({

            success: false,

            message:
                "Unable to create booking",

            error:
                error.message,
        })
    }
}

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

export const getBookings = async (
    req,
    res
) => {

    try {

        const bookings =
            await Booking.find()
                .sort({
                    createdAt: -1,
                })

        return res.json({

            success: true,

            count:
                bookings.length,

            data:
                bookings,
        })

    } catch (error) {

        console.error(
            "Get bookings error:",
            error
        )

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch bookings",

            error:
                error.message,
        })
    }
}

/* =========================================================
   GET BOOKING BY ID
========================================================= */

export const getBookingById = async (
    req,
    res
) => {

    try {

        const {
            bookingId,
        } = req.params

        const booking =
            await Booking.findOne({
                bookingId,
            })

        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found",
            })
        }

        return res.json({

            success: true,

            data:
                booking,
        })

    } catch (error) {

        console.error(
            "Get booking error:",
            error
        )

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch booking",

            error:
                error.message,
        })
    }
}

/* =========================================================
   GET BOOKINGS BY PHONE
========================================================= */

export const getBookingsByPhone = async (
    req,
    res
) => {

    try {

        const {
            phone,
        } = req.params

        if (!phone) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number is required",
            })
        }

        /*
          IMPORTANT:
          Booking.js stores passengerPhone,
          not phone.
        */

        const bookings =
            await Booking.find({
                passengerPhone:
                    phone,
            }).sort({
                createdAt: -1,
            })

        return res.json({

            success: true,

            count:
                bookings.length,

            data:
                bookings,
        })

    } catch (error) {

        console.error(
            "Get bookings by phone error:",
            error
        )

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch bookings",

            error:
                error.message,
        })
    }
}
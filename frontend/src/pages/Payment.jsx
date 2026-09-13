import { useState, useMemo } from 'react'
import {
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Smartphone,
  Wallet,
  Banknote,
  Sparkles,
  Building2,
  QrCode,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  busAPI,
  bookingAPI,
} from '../services/api'

import './Payment.css'

/* =========================================================
   DEFAULT BOOKING
========================================================= */

const DEFAULT_BOOKING = {
  bus: {
    id: 'bus-001',
    operator: 'KPN Travels',
    busName: 'KPN Chennai Madurai Express',
    busNumber: 'KPN001',
    from: 'Chennai',
    to: 'Madurai',
    departure: '20:30',
    arrival: '05:30',
    departureTime: '20:30',
    duration: '9h 00m',
    price: 650,
    type: 'AC Sleeper',
    busType: 'AC Sleeper',
    date: '2026-09-13',
  },

  selectedSeats: ['A2'],

  totalPrice: 650,

  journeyDate: '2026-09-13',

  passenger: {
    name: 'Arun',
    age: 28,
    gender: 'Male',
    phone: '9840123456',
    email: 'arun.traveler@example.com',
  },
}

/* =========================================================
   PAYMENT METHODS
========================================================= */

const PAYMENT_METHODS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    tag: 'GPay',
    desc: 'Pay securely using Google Pay UPI',
    badge: 'Popular',
    iconColor: '#2563eb',
    accentColor:
      'rgba(37, 99, 235, 0.08)',
    borderColor: '#2563eb',
    backendValue: 'Google Pay',
  },

  {
    id: 'phonepe',
    name: 'PhonePe',
    tag: 'PhonePe',
    desc: 'Pay instantly via PhonePe UPI ID or QR',
    badge: 'Instant',
    iconColor: '#7c3aed',
    accentColor:
      'rgba(124, 58, 237, 0.08)',
    borderColor: '#7c3aed',
    backendValue: 'PhonePe',
  },

  {
    id: 'paytm',
    name: 'Paytm',
    tag: 'Paytm',
    desc: 'Pay using Paytm Wallet or UPI balance',
    badge: 'Fast',
    iconColor: '#0284c7',
    accentColor:
      'rgba(2, 132, 199, 0.08)',
    borderColor: '#0284c7',
    backendValue: 'Paytm',
  },

  {
    id: 'upi',
    name: 'BHIM / Any UPI',
    tag: 'UPI',
    desc: 'Scan QR or enter UPI VPA',
    badge: 'Zero Fee',
    iconColor: '#059669',
    accentColor:
      'rgba(5, 150, 105, 0.08)',
    borderColor: '#059669',
    backendValue: 'UPI',
  },

  {
    id: 'counter',
    name: 'Cash / Pay at Counter',
    tag: 'Counter',
    desc: 'Reserve online and pay cash at the bus depot',
    badge: 'Pay Later',
    iconColor: '#d97706',
    accentColor:
      'rgba(217, 119, 6, 0.08)',
    borderColor: '#d97706',
    backendValue: 'Cash',
  },
]

/* =========================================================
   DATE HELPER
========================================================= */

function normalizeDate(dateValue) {
  if (!dateValue) {
    return '2026-09-13'
  }

  /*
    Already MongoDB format:
    2026-09-13
  */

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      String(dateValue)
    )
  ) {
    return String(dateValue)
  }

  /*
    Convert JavaScript date
  */

  const parsed = new Date(dateValue)

  if (!Number.isNaN(parsed.getTime())) {
    const year =
      parsed.getFullYear()

    const month = String(
      parsed.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      parsed.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return '2026-09-13'
}

/* =========================================================
   SAFE NUMBER HELPER
========================================================= */

function safeNumber(value, fallback = 0) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : fallback
}

/* =========================================================
   PAYMENT COMPONENT
========================================================= */

function Payment() {
  const navigate = useNavigate()
  const location = useLocation()

  /* =======================================================
     GET BOOKING DATA
  ======================================================= */

  const booking = useMemo(() => {
    /*
      First priority:
      React Router state
    */

    if (location.state?.bus) {
      return location.state
    }

    /*
      Second priority:
      sessionStorage draft
    */

    const saved =
      sessionStorage.getItem(
        'booking_draft'
      )

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error(
          'Invalid booking draft:',
          error
        )
      }
    }

    /*
      Final fallback
    */

    return DEFAULT_BOOKING
  }, [location.state])

  /* =======================================================
     STATE
  ======================================================= */

  const [
    selectedMethod,
    setSelectedMethod,
  ] = useState('gpay')

  const [
    processing,
    setProcessing,
  ] = useState(false)

  /* =======================================================
     BOOKING VALUES
  ======================================================= */

  const bus =
    booking.bus ||
    DEFAULT_BOOKING.bus

  const seats =
    Array.isArray(
      booking.selectedSeats
    ) &&
      booking.selectedSeats.length > 0
      ? booking.selectedSeats
      : DEFAULT_BOOKING.selectedSeats

  const passenger =
    booking.passenger ||
    DEFAULT_BOOKING.passenger

  const passengerName =
    passenger.name ||
    DEFAULT_BOOKING.passenger.name

  const passengerAge =
    safeNumber(
      passenger.age,
      DEFAULT_BOOKING.passenger.age
    )

  const passengerGender =
    passenger.gender ||
    DEFAULT_BOOKING.passenger.gender

  const passengerPhone =
    passenger.phone ||
    DEFAULT_BOOKING.passenger.phone

  const passengerEmail =
    passenger.email ||
    ''

  const journeyDate =
    booking.journeyDate ||
    bus.date ||
    DEFAULT_BOOKING.journeyDate

  const amount =
    safeNumber(
      booking.totalPrice,
      seats.length *
      safeNumber(bus.price, 650)
    )

  /* =======================================================
     FIND REAL MONGODB BUS
  ======================================================= */

  const findMongoBus = async () => {
    /*
      CASE 1:
      Booking already contains MongoDB _id
    */

    if (
      bus._id &&
      typeof bus._id === 'string'
    ) {
      try {
        console.log(
          'Trying MongoDB bus ID:',
          bus._id
        )

        const response =
          await busAPI.getById(
            bus._id
          )

        if (
          response?.success &&
          response?.data
        ) {
          return response.data
        }
      } catch (error) {
        console.log(
          'MongoDB _id lookup failed:',
          error.message
        )
      }
    }

    /*
      CASE 2:
      Frontend has old ID such as bus-001
      Search using route + date.
    */

    const apiDate =
      normalizeDate(journeyDate)

    console.log(
      'Searching MongoDB bus:',
      {
        from: bus.from,
        to: bus.to,
        date: apiDate,
      }
    )

    const response =
      await busAPI.search({
        from: bus.from,
        to: bus.to,
        date: apiDate,
      })

    console.log(
      'MongoDB search response:',
      response
    )

    if (
      !response?.success ||
      !Array.isArray(
        response.data
      ) ||
      response.data.length === 0
    ) {
      throw new Error(
        'Unable to find the selected bus in MongoDB. Please return to bus selection and try again.'
      )
    }

    /*
      Match operator first.
    */

    const matchingOperator =
      response.data.find(
        (mongoBus) =>
          String(
            mongoBus.operator || ''
          ).toLowerCase() ===
          String(
            bus.operator || ''
          ).toLowerCase()
      )

    if (matchingOperator) {
      return matchingOperator
    }

    /*
      Match bus name.
    */

    const matchingName =
      response.data.find(
        (mongoBus) =>
          String(
            mongoBus.busName || ''
          ).toLowerCase() ===
          String(
            bus.busName || ''
          ).toLowerCase()
      )

    if (matchingName) {
      return matchingName
    }

    /*
      Match departure time.
    */

    const frontendDeparture =
      bus.departure ||
      bus.departureTime

    const matchingDeparture =
      response.data.find(
        (mongoBus) =>
          mongoBus.departureTime ===
          frontendDeparture
      )

    if (matchingDeparture) {
      return matchingDeparture
    }

    /*
      Last fallback:
      first route-matching bus.
    */

    return response.data[0]
  }

  /* =======================================================
     HANDLE PAYMENT
  ======================================================= */

  const handlePay = async () => {
    if (processing) {
      return
    }

    /* =====================================================
       BASIC FRONTEND VALIDATION
    ===================================================== */

    if (!passengerName.trim()) {
      toast.error(
        'Please provide passenger name.'
      )
      return
    }

    if (
      !passengerAge ||
      passengerAge < 1
    ) {
      toast.error(
        'Please provide a valid passenger age.'
      )
      return
    }

    if (!passengerGender) {
      toast.error(
        'Please provide passenger gender.'
      )
      return
    }

    if (!passengerPhone.trim()) {
      toast.error(
        'Please provide passenger phone number.'
      )
      return
    }

    if (
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      toast.error(
        'Please select at least one seat.'
      )
      return
    }

    setProcessing(true)

    const selectedOption =
      PAYMENT_METHODS.find(
        (method) =>
          method.id ===
          selectedMethod
      )

    const paymentMethod =
      selectedOption?.backendValue ||
      'Google Pay'

    try {
      /* ==================================================
         STEP 1:
         CONNECTING TO SERVER
      ================================================== */

      toast.loading(
        'Connecting to booking server...',
        {
          id: 'payment-toast',
        }
      )

      /* ==================================================
         STEP 2:
         FIND BUS
      ================================================== */

      const mongoBus =
        await findMongoBus()

      console.log(
        'MongoDB bus found:',
        mongoBus
      )

      if (!mongoBus?._id) {
        throw new Error(
          'MongoDB bus ID is missing.'
        )
      }

      /* ==================================================
         STEP 3:
         CHECK SEAT ARRAY
      ================================================== */

      if (
        !Array.isArray(
          mongoBus.seats
        )
      ) {
        throw new Error(
          'Seat information is missing for this bus. Please reseed the buses.'
        )
      }

      /* ==================================================
         STEP 4:
         CHECK SEAT AVAILABILITY
      ================================================== */

      const unavailableSeats =
        seats.filter(
          (seatNumber) => {
            const seat =
              mongoBus.seats.find(
                (item) =>
                  item.seatNumber ===
                  seatNumber
              )

            return (
              !seat ||
              seat.isBooked === true
            )
          }
        )

      if (
        unavailableSeats.length > 0
      ) {
        throw new Error(
          `Seat(s) ${unavailableSeats.join(
            ', '
          )} are no longer available. Please select different seats.`
        )
      }

      /* ==================================================
         STEP 5:
         SIMULATED PAYMENT
      ================================================== */

      toast.loading(
        'Processing simulated payment...',
        {
          id: 'payment-toast',
        }
      )

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1200
          )
      )

      /* ==================================================
         STEP 6:
         PAYMENT STATUS
      ================================================== */

      const paymentStatus =
        selectedMethod ===
          'counter'
          ? 'Pending'
          : 'Paid'

      /* ==================================================
         STEP 7:
         CREATE FINAL BOOKING PAYLOAD

         IMPORTANT:
         Backend expects:

         passengerName
         passengerAge
         passengerGender
         passengerPhone
         passengerEmail
      ================================================== */

      const bookingPayload = {
        /* -----------------------------------------------
           BUS
        ----------------------------------------------- */

        busId:
          mongoBus._id,

        busName:
          mongoBus.busName ||
          `${mongoBus.operator} Bus`,

        operator:
          mongoBus.operator,

        from:
          mongoBus.from,

        to:
          mongoBus.to,

        travelDate:
          normalizeDate(
            journeyDate
          ),

        departureTime:
          mongoBus.departureTime,

        /* -----------------------------------------------
           PASSENGER

           THESE FIELD NAMES MUST MATCH
           Booking.js
        ----------------------------------------------- */

        passengerName:
          passengerName.trim(),

        passengerAge:
          Number(passengerAge),

        passengerGender:
          passengerGender,

        passengerPhone:
          passengerPhone.trim(),

        passengerEmail:
          passengerEmail.trim(),

        /* -----------------------------------------------
           SEATS
        ----------------------------------------------- */

        selectedSeats:
          seats,

        /* -----------------------------------------------
           PAYMENT
        ----------------------------------------------- */

        totalAmount:
          Number(amount),

        paymentMethod:
          paymentMethod,

        paymentStatus:
          paymentStatus,

        /* -----------------------------------------------
           BOOKING
        ----------------------------------------------- */

        bookingStatus:
          'Confirmed',
      }

      console.log(
        '========================================'
      )

      console.log(
        'FINAL BOOKING PAYLOAD:',
        bookingPayload
      )

      console.log(
        '========================================'
      )

      /* ==================================================
         STEP 8:
         SAVE TO MONGODB
      ================================================== */

      toast.loading(
        'Saving booking to MongoDB...',
        {
          id: 'payment-toast',
        }
      )

      const response =
        await bookingAPI.create(
          bookingPayload
        )

      console.log(
        'Booking API response:',
        response
      )

      /* ==================================================
         STEP 9:
         CHECK RESPONSE
      ================================================== */

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          response?.message ||
          'Booking could not be created.'
        )
      }

      /* ==================================================
         STEP 10:
         SAVED BOOKING
      ================================================== */

      const savedBooking =
        response.data

      console.log(
        'BOOKING SAVED SUCCESSFULLY:',
        savedBooking
      )

      /* ==================================================
         STEP 11:
         SUCCESS TOAST
      ================================================== */

      toast.dismiss(
        'payment-toast'
      )

      toast.success(
        'Booking confirmed and saved to MongoDB!',
        {
          icon: '🎉',
          duration: 3500,
        }
      )

      /* ==================================================
         STEP 12:
         CREATE FRONTEND BOOKING OBJECT
      ================================================== */

      const confirmedBooking = {
        id:
          savedBooking.bookingId,

        bookingId:
          savedBooking.bookingId,

        mongoId:
          savedBooking._id,

        busId:
          savedBooking.busId ||
          mongoBus._id,

        busName:
          savedBooking.busName ||
          mongoBus.busName,

        busNumber:
          mongoBus.busNumber,

        operator:
          savedBooking.operator,

        from:
          savedBooking.from,

        to:
          savedBooking.to,

        route:
          `${savedBooking.from} → ${savedBooking.to}`,

        date:
          savedBooking.travelDate,

        seats:
          savedBooking.selectedSeats,

        seat:
          Array.isArray(
            savedBooking.selectedSeats
          )
            ? savedBooking.selectedSeats.join(
              ', '
            )
            : '',

        passenger:
          savedBooking.passengerName,

        passengerName:
          savedBooking.passengerName,

        age:
          savedBooking.passengerAge,

        gender:
          savedBooking.passengerGender,

        phone:
          savedBooking.passengerPhone,

        email:
          savedBooking.passengerEmail,

        amount:
          savedBooking.totalAmount,

        totalAmount:
          savedBooking.totalAmount,

        paymentMethod:
          savedBooking.paymentMethod,

        paymentStatus:
          savedBooking.paymentStatus,

        status:
          savedBooking.bookingStatus,

        bookingStatus:
          savedBooking.bookingStatus,

        busType:
          mongoBus.busType,

        departure:
          mongoBus.departureTime,

        departureTime:
          mongoBus.departureTime,

        arrival:
          mongoBus.arrivalTime,

        arrivalTime:
          mongoBus.arrivalTime,

        duration:
          mongoBus.duration,

        createdAt:
          savedBooking.createdAt ||
          new Date().toISOString(),
      }

      console.log(
        'CONFIRMED BOOKING:',
        confirmedBooking
      )

      /* ==================================================
         STEP 13:
         SAVE TO LOCAL STORAGE

         Used by My Bookings page.
      ================================================== */

      try {
        const existing =
          JSON.parse(
            localStorage.getItem(
              'solan_bookings'
            ) || '[]'
          )

        /*
          Prevent duplicate local booking
          if the same booking ID already exists.
        */

        const filtered =
          Array.isArray(existing)
            ? existing.filter(
              (item) =>
                item.bookingId !==
                confirmedBooking.bookingId
            )
            : []

        localStorage.setItem(
          'solan_bookings',
          JSON.stringify([
            confirmedBooking,
            ...filtered,
          ])
        )

        /* -----------------------------------------------
           LAST CONFIRMED BOOKING
        ----------------------------------------------- */

        sessionStorage.setItem(
          'last_confirmed_booking',
          JSON.stringify(
            confirmedBooking
          )
        )

        /* -----------------------------------------------
           REMOVE OLD DRAFT
        ----------------------------------------------- */

        sessionStorage.removeItem(
          'booking_draft'
        )
      } catch (storageError) {
        console.error(
          'Local storage error:',
          storageError
        )
      }

      /* ==================================================
         STEP 14:
         GO TO CONFIRMATION PAGE
      ================================================== */

      setProcessing(false)

      navigate(
        '/booking-confirmation',
        {
          state: {
            booking:
              confirmedBooking,
          },
        }
      )
    } catch (error) {
      /* ==================================================
         ERROR HANDLING
      ================================================== */

      console.error(
        'BOOKING ERROR:',
        error
      )

      toast.dismiss(
        'payment-toast'
      )

      toast.error(
        error.message ||
        'Booking failed. Please try again.',
        {
          duration: 5000,
        }
      )

      setProcessing(false)
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="payment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div className="container">

          <div
            className="demo-pill"
            style={{
              marginBottom:
                '0.6rem',

              background:
                'rgba(201,168,76,0.15)',

              borderColor:
                'var(--gold)',

              color:
                'var(--gold-light)',
            }}
          >

            <Sparkles size={13} />

            Final Step • Secure
            Simulated Checkout

          </div>

          <h1>
            Choose Your Payment Method
          </h1>

          <p>
            Complete your reservation
            for South India travel
          </p>

        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="container payment-layout">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="payment-methods-col">

          <button
            type="button"
            className="payment-back-link"
            onClick={() =>
              navigate(
                '/passenger'
              )
            }
          >

            <ArrowLeft size={16} />

            Back to Passenger Details

          </button>

          <div className="payment-methods-card card">

            {/* ===========================================
                CARD HEADER
            =========================================== */}

            <div className="pm-card-header">

              <h2 className="pm-heading">
                Select Payment Option
              </h2>

              <span className="pm-secure-badge">

                <Lock size={13} />

                256-Bit Encrypted

              </span>

            </div>

            <p className="pm-subtext">
              Select your preferred
              payment method below.
            </p>

            {/* ===========================================
                PAYMENT OPTIONS
            =========================================== */}

            <div className="payment-options-list">

              {PAYMENT_METHODS.map(
                (method) => {

                  const isSelected =
                    selectedMethod ===
                    method.id

                  return (

                    <div
                      key={method.id}
                      id={`payment-method-${method.id}`}
                      className={`payment-option-card ${isSelected
                        ? 'payment-option-card--active'
                        : ''
                        }`}
                      onClick={() =>
                        !processing &&
                        setSelectedMethod(
                          method.id
                        )
                      }
                    >

                      <div className="pm-option-left">

                        {/* RADIO */}

                        <div
                          className={`pm-radio ${isSelected
                            ? 'pm-radio--checked'
                            : ''
                            }`}
                        >

                          {isSelected && (
                            <div className="pm-radio-inner" />
                          )}

                        </div>

                        {/* BRAND */}

                        <div
                          className="pm-brand-badge"
                          style={{
                            background:
                              method.accentColor,

                            color:
                              method.iconColor,

                            borderColor:
                              method.borderColor,
                          }}
                        >

                          {method.tag ===
                            'GPay' && (
                              <Smartphone
                                size={16}
                              />
                            )}

                          {method.tag ===
                            'PhonePe' && (
                              <Wallet
                                size={16}
                              />
                            )}

                          {method.tag ===
                            'Paytm' && (
                              <QrCode
                                size={16}
                              />
                            )}

                          {method.tag ===
                            'UPI' && (
                              <Building2
                                size={16}
                              />
                            )}

                          {method.tag ===
                            'Counter' && (
                              <Banknote
                                size={16}
                              />
                            )}

                          <span>
                            {method.tag}
                          </span>

                        </div>

                        {/* DETAILS */}

                        <div className="pm-details">

                          <div className="pm-name-row">

                            <strong className="pm-name">
                              {method.name}
                            </strong>

                            <span className="pm-pill-badge">
                              {method.badge}
                            </span>

                          </div>

                          <span className="pm-desc">
                            {method.desc}
                          </span>

                        </div>

                      </div>

                      {isSelected && (
                        <CheckCircle2
                          size={20}
                          className="pm-check-icon"
                        />
                      )}

                    </div>

                  )
                }
              )}

            </div>

            {/* ===========================================
                NOTICE
            =========================================== */}

            <div className="demo-payment-alert">

              <Sparkles
                size={16}
                className="dpa-icon"
              />

              <div>

                <strong>
                  Simulation Only:
                </strong>

                {' '}

                This is a college
                project payment simulation.
                No real money will be charged.

              </div>

            </div>

            {/* ===========================================
                PAY BUTTON
            =========================================== */}

            <button
              id="pay-now-btn"
              type="button"
              className="btn-primary pay-submit-btn"
              disabled={processing}
              onClick={handlePay}
            >

              {processing ? (

                <span>
                  Processing Booking...
                </span>

              ) : (

                <>

                  <Lock size={18} />

                  <span>
                    PAY ₹{amount}
                  </span>

                </>

              )}

            </button>

            <p className="payment-fineprint">

              By clicking
              "PAY ₹{amount}",
              you confirm your seat reservation
              with Solan Bus Booking.

            </p>

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <aside className="payment-summary-col">

          <div className="booking-summary-card card">

            {/* TOTAL */}

            <div className="summary-total-banner">

              <span className="st-label">
                TOTAL AMOUNT
              </span>

              <span className="st-amount">
                ₹{amount}
              </span>

            </div>

            {/* BODY */}

            <div className="summary-body">

              <h3 className="summary-title">
                Booking Summary
              </h3>

              {/* OPERATOR */}

              <div className="summary-row">

                <span className="sr-label">
                  Bus Operator
                </span>

                <strong className="sr-val">
                  {bus.operator}
                </strong>

              </div>

              {/* ROUTE */}

              <div className="summary-row">

                <span className="sr-label">
                  Route
                </span>

                <strong className="sr-val">
                  {bus.from} → {bus.to}
                </strong>

              </div>

              {/* DATE */}

              <div className="summary-row">

                <span className="sr-label">
                  Journey Date
                </span>

                <strong className="sr-val">
                  {normalizeDate(
                    journeyDate
                  )}
                </strong>

              </div>

              {/* DEPARTURE */}

              <div className="summary-row">

                <span className="sr-label">
                  Departure
                </span>

                <strong className="sr-val">

                  {bus.departure ||
                    bus.departureTime}

                  {' '}

                  ({bus.duration})

                </strong>

              </div>

              {/* BUS TYPE */}

              <div className="summary-row">

                <span className="sr-label">
                  Bus Type
                </span>

                <strong className="sr-val">

                  {bus.type ||
                    bus.busType}

                </strong>

              </div>

              {/* SEATS */}

              <div className="summary-row">

                <span className="sr-label">
                  Seat(s)
                </span>

                <strong className="sr-val highlight-gold">

                  {seats.join(', ')}

                </strong>

              </div>

              {/* PASSENGER */}

              <div className="summary-row">

                <span className="sr-label">
                  Passenger
                </span>

                <strong className="sr-val">
                  {passengerName}
                </strong>

              </div>

              {/* PHONE */}

              <div className="summary-row">

                <span className="sr-label">
                  Phone
                </span>

                <strong className="sr-val">
                  {passengerPhone}
                </strong>

              </div>

              <hr className="summary-divider" />

              {/* GRAND TOTAL */}

              <div className="summary-row summary-row-total">

                <span className="sr-label-total">
                  Grand Total
                </span>

                <span className="sr-val-total">
                  ₹{amount}
                </span>

              </div>

            </div>

            {/* FOOTER */}

            <div className="summary-footer">

              <div className="sf-badge">

                <ShieldCheck size={16} />

                <span>
                  Verified South Indian
                  Bus Operator
                </span>

              </div>

              <p className="sf-text">

                Your booking will be
                permanently stored in
                MongoDB after payment.

              </p>

            </div>

          </div>

        </aside>

      </div>

    </div>
  )
}

export default Payment
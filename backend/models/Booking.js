import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        busId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            required: true
        },

        busName: {
            type: String,
            required: true,
            trim: true
        },

        operator: {
            type: String,
            required: true,
            trim: true
        },

        from: {
            type: String,
            required: true,
            trim: true
        },

        to: {
            type: String,
            required: true,
            trim: true
        },

        travelDate: {
            type: String,
            required: true
        },

        departureTime: {
            type: String,
            required: true
        },

        passengerName: {
            type: String,
            required: true,
            trim: true
        },

        passengerAge: {
            type: Number,
            required: true,
            min: 1,
            max: 120
        },

        passengerGender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },

        passengerPhone: {
            type: String,
            required: true,
            trim: true
        },

        passengerEmail: {
            type: String,
            trim: true,
            default: ""
        },

        selectedSeats: {
            type: [String],
            required: true,
            validate: {
                validator: function (seats) {
                    return Array.isArray(seats) && seats.length > 0;
                },
                message: "At least one seat must be selected"
            }
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: [
                "Google Pay",
                "PhonePe",
                "Paytm",
                "UPI",
                "Cash",
                "Pay at Counter"
            ]
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        bookingStatus: {
            type: String,
            enum: ["Confirmed", "Cancelled", "Pending"],
            default: "Confirmed"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type: String,
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
);

const busSchema = new mongoose.Schema(
    {
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

        busNumber: {
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

        departureTime: {
            type: String,
            required: true
        },

        arrivalTime: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        busType: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        rating: {
            type: Number,
            default: 4.0,
            min: 0,
            max: 5
        },

        totalSeats: {
            type: Number,
            required: true,
            default: 40
        },

        availableSeats: {
            type: Number,
            required: true,
            default: 40
        },

        seats: {
            type: [seatSchema],
            default: []
        },

        amenities: {
            type: [String],
            default: []
        },

        boardingPoint: {
            type: String,
            default: ""
        },

        droppingPoint: {
            type: String,
            default: ""
        },

        date: {
            type: String,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

const Bus = mongoose.model("Bus", busSchema);

export default Bus;
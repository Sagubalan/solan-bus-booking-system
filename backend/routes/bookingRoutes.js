import express from "express";

import {
    createBooking,
    getBookings,
    getBookingById,
    getBookingsByPhone
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/phone/:phone", getBookingsByPhone);

router.get("/", getBookings);

router.get("/:bookingId", getBookingById);

export default router;
import mongoose from "mongoose";
import Bus from "../models/Bus.js";

export const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ isActive: true }).sort({
            departureTime: 1
        });

        res.json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        console.error("Get buses error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch buses",
            error: error.message
        });
    }
};

export const getBusById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid bus ID"
            });
        }

        const bus = await Bus.findOne({
            _id: id,
            isActive: true
        });

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: "Bus not found"
            });
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        console.error("Get bus by ID error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch bus",
            error: error.message
        });
    }
};

export const searchBuses = async (req, res) => {
    try {
        const { from, to, date } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "from and to are required"
            });
        }

        const escapeRegex = (value) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const filter = {
            isActive: true,
            from: {
                $regex: `^${escapeRegex(from.trim())}$`,
                $options: "i"
            },
            to: {
                $regex: `^${escapeRegex(to.trim())}$`,
                $options: "i"
            }
        };

        if (date) {
            filter.date = date;
        }

        const buses = await Bus.find(filter).sort({
            departureTime: 1
        });

        res.json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        console.error("Search buses error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to search buses",
            error: error.message
        });
    }
};

import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// CORS
// --------------------------------------------------
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow Postman and direct requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked for origin: ${origin}`)
            );
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false,
    })
);

app.use(express.json());

// --------------------------------------------------
// Health Check
// --------------------------------------------------
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "SOLAN BUS BOOKING API is running",
    });
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
    });
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    if (err.message?.startsWith("CORS blocked")) {
        return res.status(403).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
    });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("");
            console.log("==============================================");
            console.log("      SOLAN BUS BOOKING BACKEND");
            console.log("==============================================");
            console.log(`Server: http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
            console.log(`Buses:  http://localhost:${PORT}/api/buses`);
            console.log("MongoDB: Connected");
            console.log("CORS:   5173 + 5174 allowed");
            console.log("==============================================");
            console.log("");
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
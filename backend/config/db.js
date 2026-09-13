import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");

        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env file");
        }

        const connection = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
            family: 4,
        });

        console.log(
            `MongoDB connected successfully: ${connection.connection.host}`
        );
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;
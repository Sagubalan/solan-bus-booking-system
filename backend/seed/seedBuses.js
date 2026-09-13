import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Bus from "../models/Bus.js";

/* =========================================================
   SOLAN BUS BOOKING SYSTEM
   BUS SEED DATA
   30 South Indian Buses
   40 Seats / Bus
   38 Available / Bus
   ========================================================= */

/* =========================================================
   CREATE 40 SEATS
   Layout:
   A1 A2 | A3 A4
   B1 B2 | B3 B4
   ...
   J1 J2 | J3 J4

   A1 and A2 are initially booked.
   Therefore:
   Total Seats     = 40
   Available Seats = 38
   ========================================================= */

const createSeats = () => {
    const seats = [];

    const rows = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
    ];

    const initiallyBookedSeats = ["A1", "A2"];

    rows.forEach((row) => {
        for (let number = 1; number <= 4; number++) {
            const seatNumber = `${row}${number}`;

            seats.push({
                seatNumber,
                isBooked: initiallyBookedSeats.includes(seatNumber),
            });
        }
    });

    return seats;
};

/* =========================================================
   30 BUS DATA
   ========================================================= */

const buses = [
    // =======================================================
    // CHENNAI → MADURAI
    // =======================================================

    {
        busName: "KPN Travels AC Sleeper",
        operator: "KPN Travels",
        busNumber: "KPN001",
        from: "Chennai",
        to: "Madurai",
        departureTime: "21:30",
        arrivalTime: "05:45",
        duration: "8h 15m",
        busType: "AC Sleeper",
        price: 750,
        rating: 4.5,
        boardingPoint: "Koyambedu Bus Terminus",
        droppingPoint: "Mattuthavani Bus Stand",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
            "Reading Light",
        ],
    },

    {
        busName: "Parveen Travels AC Seater",
        operator: "Parveen Travels",
        busNumber: "PAR002",
        from: "Chennai",
        to: "Madurai",
        departureTime: "20:45",
        arrivalTime: "05:00",
        duration: "8h 15m",
        busType: "AC Seater",
        price: 680,
        rating: 4.4,
        boardingPoint: "Koyambedu",
        droppingPoint: "Mattuthavani",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    {
        busName: "SRM Madurai Volvo",
        operator: "SRM Transport",
        busNumber: "SRM003",
        from: "Chennai",
        to: "Madurai",
        departureTime: "22:00",
        arrivalTime: "06:15",
        duration: "8h 15m",
        busType: "Volvo Multi Axle",
        price: 820,
        rating: 4.7,
        boardingPoint: "Koyambedu",
        droppingPoint: "Mattuthavani Bus Stand",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
            "Pillow",
        ],
    },

    {
        busName: "SETC Ultra Deluxe",
        operator: "SETC",
        busNumber: "SETC004",
        from: "Chennai",
        to: "Madurai",
        departureTime: "19:30",
        arrivalTime: "04:30",
        duration: "9h 00m",
        busType: "Ultra Deluxe",
        price: 540,
        rating: 4.1,
        boardingPoint: "CMBT Koyambedu",
        droppingPoint: "Mattuthavani",
        amenities: [
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // CHENNAI → COIMBATORE
    // =======================================================

    {
        busName: "National Travels AC Sleeper",
        operator: "National Travels",
        busNumber: "NAT005",
        from: "Chennai",
        to: "Coimbatore",
        departureTime: "21:00",
        arrivalTime: "05:30",
        duration: "8h 30m",
        busType: "AC Sleeper",
        price: 780,
        rating: 4.5,
        boardingPoint: "Koyambedu",
        droppingPoint: "Gandhipuram",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    {
        busName: "Rathimeena AC Sleeper",
        operator: "Rathimeena Travels",
        busNumber: "RAT006",
        from: "Chennai",
        to: "Coimbatore",
        departureTime: "22:15",
        arrivalTime: "06:30",
        duration: "8h 15m",
        busType: "AC Sleeper",
        price: 800,
        rating: 4.6,
        boardingPoint: "Koyambedu",
        droppingPoint: "Gandhipuram Bus Stand",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "TNSTC Express",
        operator: "TNSTC",
        busNumber: "TNS007",
        from: "Chennai",
        to: "Coimbatore",
        departureTime: "18:45",
        arrivalTime: "05:15",
        duration: "10h 30m",
        busType: "Express",
        price: 480,
        rating: 4.0,
        boardingPoint: "CMBT",
        droppingPoint: "Gandhipuram",
        amenities: [
            "Charging Point",
            "Water Bottle",
        ],
    },

    // =======================================================
    // CHENNAI → BANGALORE
    // =======================================================

    {
        busName: "VRL Volvo Multi Axle",
        operator: "VRL Travels",
        busNumber: "VRL008",
        from: "Chennai",
        to: "Bangalore",
        departureTime: "22:30",
        arrivalTime: "05:30",
        duration: "7h 00m",
        busType: "Volvo Multi Axle",
        price: 850,
        rating: 4.7,
        boardingPoint: "Koyambedu",
        droppingPoint: "Majestic",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "Orange Tours AC Sleeper",
        operator: "Orange Tours and Travels",
        busNumber: "ORG009",
        from: "Chennai",
        to: "Bangalore",
        departureTime: "21:45",
        arrivalTime: "05:15",
        duration: "7h 30m",
        busType: "AC Sleeper",
        price: 920,
        rating: 4.6,
        boardingPoint: "Guindy",
        droppingPoint: "Electronic City",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
            "Reading Light",
        ],
    },

    {
        busName: "KSRTC Airavat",
        operator: "KSRTC Karnataka",
        busNumber: "KRS010",
        from: "Chennai",
        to: "Bangalore",
        departureTime: "20:30",
        arrivalTime: "04:45",
        duration: "8h 15m",
        busType: "AC Seater",
        price: 720,
        rating: 4.5,
        boardingPoint: "Koyambedu",
        droppingPoint: "Kempegowda Bus Stand",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // CHENNAI → KOCHI
    // =======================================================

    {
        busName: "Kallada AC Sleeper",
        operator: "Kallada Travels",
        busNumber: "KAL011",
        from: "Chennai",
        to: "Kochi",
        departureTime: "18:30",
        arrivalTime: "07:00",
        duration: "12h 30m",
        busType: "AC Sleeper",
        price: 1150,
        rating: 4.6,
        boardingPoint: "Koyambedu",
        droppingPoint: "Vyttila Mobility Hub",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "A1 Kerala Express",
        operator: "A1 Travels",
        busNumber: "A1T012",
        from: "Chennai",
        to: "Kochi",
        departureTime: "19:15",
        arrivalTime: "07:30",
        duration: "12h 15m",
        busType: "AC Sleeper",
        price: 1080,
        rating: 4.4,
        boardingPoint: "Guindy",
        droppingPoint: "Ernakulam",
        amenities: [
            "AC",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    {
        busName: "KSRTC Kerala Super Deluxe",
        operator: "KSRTC Kerala",
        busNumber: "KER013",
        from: "Chennai",
        to: "Kochi",
        departureTime: "17:45",
        arrivalTime: "06:30",
        duration: "12h 45m",
        busType: "Super Deluxe",
        price: 950,
        rating: 4.2,
        boardingPoint: "Koyambedu",
        droppingPoint: "Ernakulam KSRTC",
        amenities: [
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // CHENNAI → TIRUPATI
    // =======================================================

    {
        busName: "APSRTC Garuda",
        operator: "APSRTC",
        busNumber: "APS014",
        from: "Chennai",
        to: "Tirupati",
        departureTime: "06:30",
        arrivalTime: "10:30",
        duration: "4h 00m",
        busType: "AC Seater",
        price: 520,
        rating: 4.3,
        boardingPoint: "Koyambedu",
        droppingPoint: "Tirupati Central Bus Station",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
        ],
    },

    {
        busName: "YBM Tirupati Express",
        operator: "YBM Travels",
        busNumber: "YBM015",
        from: "Chennai",
        to: "Tirupati",
        departureTime: "07:15",
        arrivalTime: "11:00",
        duration: "3h 45m",
        busType: "AC Seater",
        price: 580,
        rating: 4.5,
        boardingPoint: "Koyambedu",
        droppingPoint: "Tirupati Bus Stand",
        amenities: [
            "WiFi",
            "Charging Point",
            "Water Bottle",
        ],
    },

    // =======================================================
    // BANGALORE → CHENNAI
    // =======================================================

    {
        busName: "SRS Volvo Multi Axle",
        operator: "SRS Travels",
        busNumber: "SRS016",
        from: "Bangalore",
        to: "Chennai",
        departureTime: "22:00",
        arrivalTime: "05:30",
        duration: "7h 30m",
        busType: "Volvo Multi Axle",
        price: 850,
        rating: 4.7,
        boardingPoint: "Majestic",
        droppingPoint: "Koyambedu",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "Sugama Tourist AC Sleeper",
        operator: "Sugama Tourist",
        busNumber: "SUG017",
        from: "Bangalore",
        to: "Chennai",
        departureTime: "21:30",
        arrivalTime: "05:15",
        duration: "7h 45m",
        busType: "AC Sleeper",
        price: 900,
        rating: 4.5,
        boardingPoint: "Shanthinagar",
        droppingPoint: "Koyambedu",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    // =======================================================
    // BANGALORE → KOCHI
    // =======================================================

    {
        busName: "Sea Bird AC Sleeper",
        operator: "Sea Bird Tourist",
        busNumber: "SEA018",
        from: "Bangalore",
        to: "Kochi",
        departureTime: "20:00",
        arrivalTime: "06:30",
        duration: "10h 30m",
        busType: "AC Sleeper",
        price: 1050,
        rating: 4.6,
        boardingPoint: "Majestic",
        droppingPoint: "Vyttila",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "Kerala Lines Express",
        operator: "Kerala Lines",
        busNumber: "KER019",
        from: "Bangalore",
        to: "Kochi",
        departureTime: "21:15",
        arrivalTime: "07:00",
        duration: "9h 45m",
        busType: "AC Seater",
        price: 920,
        rating: 4.4,
        boardingPoint: "Electronic City",
        droppingPoint: "Ernakulam",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // BANGALORE → HYDERABAD
    // =======================================================

    {
        busName: "VRL Hyderabad Express",
        operator: "VRL Travels",
        busNumber: "VRL020",
        from: "Bangalore",
        to: "Hyderabad",
        departureTime: "19:30",
        arrivalTime: "07:00",
        duration: "11h 30m",
        busType: "AC Sleeper",
        price: 1250,
        rating: 4.7,
        boardingPoint: "Majestic",
        droppingPoint: "MGBS Hyderabad",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "TSRTC Super Luxury",
        operator: "TSRTC",
        busNumber: "TSR021",
        from: "Bangalore",
        to: "Hyderabad",
        departureTime: "18:45",
        arrivalTime: "06:30",
        duration: "11h 45m",
        busType: "Super Luxury",
        price: 980,
        rating: 4.3,
        boardingPoint: "Electronic City",
        droppingPoint: "MGBS",
        amenities: [
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // HYDERABAD → CHENNAI
    // =======================================================

    {
        busName: "Orange Chennai Express",
        operator: "Orange Tours and Travels",
        busNumber: "ORG022",
        from: "Hyderabad",
        to: "Chennai",
        departureTime: "18:30",
        arrivalTime: "07:30",
        duration: "13h 00m",
        busType: "AC Sleeper",
        price: 1350,
        rating: 4.6,
        boardingPoint: "MGBS Hyderabad",
        droppingPoint: "Koyambedu",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "APSRTC Garuda Plus",
        operator: "APSRTC",
        busNumber: "APS023",
        from: "Hyderabad",
        to: "Chennai",
        departureTime: "19:15",
        arrivalTime: "08:00",
        duration: "12h 45m",
        busType: "AC Seater",
        price: 1120,
        rating: 4.4,
        boardingPoint: "MGBS",
        droppingPoint: "Koyambedu",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
        ],
    },

    // =======================================================
    // COIMBATORE → BANGALORE
    // =======================================================

    {
        busName: "AJJ AC Sleeper",
        operator: "AJJ Travels",
        busNumber: "AJJ024",
        from: "Coimbatore",
        to: "Bangalore",
        departureTime: "21:30",
        arrivalTime: "05:30",
        duration: "8h 00m",
        busType: "AC Sleeper",
        price: 850,
        rating: 4.5,
        boardingPoint: "Gandhipuram",
        droppingPoint: "Majestic",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    {
        busName: "Sharma AC Seater",
        operator: "Sharma Transports",
        busNumber: "SHA025",
        from: "Coimbatore",
        to: "Bangalore",
        departureTime: "22:15",
        arrivalTime: "06:15",
        duration: "8h 00m",
        busType: "AC Seater",
        price: 760,
        rating: 4.3,
        boardingPoint: "Gandhipuram",
        droppingPoint: "Electronic City",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },

    // =======================================================
    // MADURAI → CHENNAI
    // =======================================================

    {
        busName: "Viji Yatra AC Sleeper",
        operator: "Viji Yatra",
        busNumber: "VIJ026",
        from: "Madurai",
        to: "Chennai",
        departureTime: "21:45",
        arrivalTime: "06:00",
        duration: "8h 15m",
        busType: "AC Sleeper",
        price: 780,
        rating: 4.5,
        boardingPoint: "Mattuthavani",
        droppingPoint: "Koyambedu",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    {
        busName: "Universal Travels AC",
        operator: "Universal Travels",
        busNumber: "UNI027",
        from: "Madurai",
        to: "Chennai",
        departureTime: "22:30",
        arrivalTime: "06:45",
        duration: "8h 15m",
        busType: "AC Seater",
        price: 690,
        rating: 4.3,
        boardingPoint: "Mattuthavani",
        droppingPoint: "Koyambedu",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
        ],
    },

    // =======================================================
    // CHENNAI → THIRUVANANTHAPURAM
    // =======================================================

    {
        busName: "Kallada Kerala Sleeper",
        operator: "Kallada Travels",
        busNumber: "KAL028",
        from: "Chennai",
        to: "Thiruvananthapuram",
        departureTime: "17:30",
        arrivalTime: "08:30",
        duration: "15h 00m",
        busType: "AC Sleeper",
        price: 1450,
        rating: 4.7,
        boardingPoint: "Koyambedu",
        droppingPoint: "Thampanoor",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Pillow",
            "Water Bottle",
        ],
    },

    {
        busName: "SRS Kerala Sleeper",
        operator: "SRS Travels",
        busNumber: "SRS029",
        from: "Chennai",
        to: "Thiruvananthapuram",
        departureTime: "18:15",
        arrivalTime: "09:00",
        duration: "14h 45m",
        busType: "AC Sleeper",
        price: 1380,
        rating: 4.5,
        boardingPoint: "Guindy",
        droppingPoint: "Thampanoor",
        amenities: [
            "WiFi",
            "Charging Point",
            "Blanket",
            "Water Bottle",
        ],
    },

    // =======================================================
    // CHENNAI → VIJAYAWADA
    // =======================================================

    {
        busName: "APSRTC Amaravati",
        operator: "APSRTC",
        busNumber: "APS030",
        from: "Chennai",
        to: "Vijayawada",
        departureTime: "20:00",
        arrivalTime: "06:30",
        duration: "10h 30m",
        busType: "AC Seater",
        price: 950,
        rating: 4.4,
        boardingPoint: "Koyambedu",
        droppingPoint: "Vijayawada Bus Stand",
        amenities: [
            "AC",
            "Charging Point",
            "Water Bottle",
            "Reading Light",
        ],
    },
];

/* =========================================================
   PREPARE BUS DATA
   ========================================================= */

const prepareBuses = () => {
    return buses.map((bus) => ({
        ...bus,

        // Every bus has exactly 40 seats
        totalSeats: 40,

        // Initially 2 seats are booked
        availableSeats: 38,

        // Generate fresh seat layout
        seats: createSeats(),

        // Active bus
        isActive: true,

        // Demo travel date
        date: "2026-09-13",
    }));
};

/* =========================================================
   SEED DATABASE
   ========================================================= */

const seedBuses = async () => {
    try {
        console.log("");
        console.log("==============================================");
        console.log("      SOLAN BUS BOOKING SYSTEM");
        console.log("             DATABASE SEED");
        console.log("==============================================");
        console.log("");

        // Connect to MongoDB Atlas
        await connectDB();

        console.log("");
        console.log("Clearing existing bus records...");

        // Delete old buses
        const deleted = await Bus.deleteMany({});

        console.log(
            `Deleted ${deleted.deletedCount} old bus records.`
        );

        // Prepare fresh buses
        const preparedBuses = prepareBuses();

        console.log("");
        console.log(
            `Preparing ${preparedBuses.length} buses...`
        );

        // Insert all buses
        const insertedBuses = await Bus.insertMany(
            preparedBuses
        );

        console.log("");
        console.log("==============================================");
        console.log("           SEED COMPLETED SUCCESSFULLY");
        console.log("==============================================");
        console.log("");

        console.log(
            `Total buses inserted : ${insertedBuses.length}`
        );

        console.log("Seats per bus         : 40");
        console.log("Available seats       : 38");
        console.log("Initially booked      : A1, A2");
        console.log("Travel date           : 2026-09-13");

        console.log("");
        console.log("Sample seat status:");
        console.log("A1  ❌ Booked");
        console.log("A2  ❌ Booked");
        console.log("A3  ✅ Available");
        console.log("A4  ✅ Available");
        console.log("B1  ✅ Available");
        console.log("B2  ✅ Available");
        console.log("J1  ✅ Available");
        console.log("J2  ✅ Available");
        console.log("J3  ✅ Available");
        console.log("J4  ✅ Available");

        console.log("");
        console.log("Routes available:");

        const routes = [
            ...new Set(
                insertedBuses.map(
                    (bus) => `${bus.from} → ${bus.to}`
                )
            ),
        ];

        routes.forEach((route) => {
            console.log(`  • ${route}`);
        });

        console.log("");
        console.log("==============================================");
        console.log("Database is ready for booking.");
        console.log("==============================================");
        console.log("");
    } catch (error) {
        console.error("");
        console.error("==============================================");
        console.error("             SEED FAILED");
        console.error("==============================================");
        console.error("");
        console.error(error.message);
        console.error("");

        if (error.name === "ValidationError") {
            console.error("MongoDB validation details:");

            Object.values(error.errors).forEach((err) => {
                console.error(`- ${err.path}: ${err.message}`);
            });
        }

        console.error("");
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    }
};

/* =========================================================
   RUN SEED
   ========================================================= */

seedBuses();
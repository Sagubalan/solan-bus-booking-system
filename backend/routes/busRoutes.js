import express from "express";

import {
    getBuses,
    getBusById,
    searchBuses
} from "../controllers/busController.js";

const router = express.Router();

router.get("/search", searchBuses);
router.get("/", getBuses);
router.get("/:id", getBusById);

export default router;

import express, { Router } from "express";
import {getAllEvents, createEvent, getEventById, updateEvent, deleteEvent,} from "../controllers/eventController";
import { validateRequest } from "../middleware/validate";
import { eventSchemas } from "../validation/eventValidation";

const router: Router = express.Router();

router.get("/events", getAllEvents);
router.post("/events", validateRequest(eventSchemas.create), createEvent);
router.get("/events/:id", getEventById);
router.put(
    "/events/:id",
    validateRequest(eventSchemas.update),
    updateEvent
);
router.delete("/events/:id", deleteEvent);

export default router;

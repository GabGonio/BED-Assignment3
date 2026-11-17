import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as eventService from "../services/eventService";
import { Event } from "../models/eventModel";

const handleEventError = (
    error: unknown,
    res: Response,
    next: NextFunction
): void => {
    if (
        error instanceof Error &&
        error.message.startsWith("Event with ID ") &&
        error.message.endsWith(" not found")
    ) {
        res.status(404).json({ message: error.message });
        return;
    }

    next(error);
};

/**
 * Manages requests and responses to retrieve all Events
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEvents = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: Event[] = await eventService.getAllEvents();

        res.status(HTTP_STATUS.OK).json({
            message: "Events retrieved",
            count: events.length,
            data: events,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to create an Event
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
        } = req.body;

        const newEvent: Event = await eventService.createEvent({
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Event created",
            data: newEvent,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to retrieve an Event by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEventById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const event: Event = await eventService.getEventById(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Event retrieved",
            data: event,
        });
    } catch (error: unknown) {
        handleEventError(error, res, next);
    }
};

/**
 * Manages requests and responses to update an Event
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEvent = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const updatedEvent: Event = await eventService.updateEvent(
            id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json({
            message: "Event updated",
            data: updatedEvent,
        });
    } catch (error: unknown) {
        handleEventError(error, res, next);
    }
};

/**
 * Manages requests and responses to delete an Event
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEvent = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        await eventService.deleteEvent(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Event deleted",
        });
    } catch (error: unknown) {
        handleEventError(error, res, next);
    }
};
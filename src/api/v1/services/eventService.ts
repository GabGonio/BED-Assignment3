
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Event } from "../models/eventModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "events";

const toDate = (value: Date | { toDate(): Date }): Date => {
    return value instanceof Date ? value : value.toDate();
};

const toEvent = (id: string, data: DocumentData): Event => {
    return {
        id,
        ...data,
        date: toDate(data.date),
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
    } as Event;
};

/**
 * Retrieves all events from storage
 * @returns Array of all events
 */
export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const events: Event[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return toEvent(doc.id, data);
        });

        return events;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new event
 * @param eventData - The data for the new event
 * @returns The created event with generated ID
 */
export const createEvent = async (eventData: {
    name: string;
    date: Date;
    capacity: number;
    registrationCount?: number;
    status?: Event["status"];
    category?: Event["category"];
}): Promise<Event> => {
    const dateNow = new Date();

    const newEvent: Partial<Event> = {
        name: eventData.name,
        date: new Date(eventData.date),
        capacity: eventData.capacity,
        registrationCount: eventData.registrationCount ?? 0,
        status: eventData.status ?? "active",
        category: eventData.category ?? "general",
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const eventId: string = await createDocument<Event>(
        COLLECTION,
        newEvent
    );

    return structuredClone({ id: eventId, ...newEvent } as Event);
};

/**
 * Retrieves a single event by ID from the database
 * @param id - The ID of the event to retrieve
 * @returns The event if found
 */
export const getEventById = async (id: string): Promise<Event> => {
    const doc: DocumentSnapshot | null = await getDocumentById(
        COLLECTION,
        id
    );

    if (!doc) {
        throw new Error(`Event with ID ${id} not found`);
    }

    const data: DocumentData | undefined = doc.data();

    if (!data) {
        throw new Error(`Event with ID ${id} not found`);
    }

    const event: Event = toEvent(doc.id, data);

    return structuredClone(event);
};

/**
 * Updates an existing event
 * @param id - The ID of the event to update
 * @param eventData - The event fields to update
 * @returns The updated event
 */
export const updateEvent = async (
    id: string,
    eventData: Partial<
        Pick<
            Event,
            | "name"
            | "date"
            | "capacity"
            | "registrationCount"
            | "status"
            | "category"
        >
    >
): Promise<Event> => {
    const event: Event = await getEventById(id);

    const updatedEvent: Event = {
        ...event,
        ...eventData,
        date:
            eventData.date !== undefined
                ? new Date(eventData.date)
                : event.date,
        updatedAt: new Date(),
    };

    if (updatedEvent.registrationCount > updatedEvent.capacity) {
        throw new Error("Registration count cannot exceed capacity");
    }

    const changes: Partial<Event> = {
        ...eventData,
        updatedAt: updatedEvent.updatedAt,
    };

    if (eventData.date !== undefined) {
        changes.date = updatedEvent.date;
    }

    await updateDocument<Event>(COLLECTION, id, changes);

    return structuredClone(updatedEvent);
};

/**
 * Deletes an event from storage
 * @param id - The ID of the event to delete
 */
export const deleteEvent = async (id: string): Promise<void> => {
    await getEventById(id);

    await deleteDocument(COLLECTION, id);
};

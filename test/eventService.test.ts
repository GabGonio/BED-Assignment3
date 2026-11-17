import { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent, } from "../src/api/v1/services/eventService";
import { getDocuments, createDocument, getDocumentById, updateDocument, deleteDocument, } from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
    createDocument: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

describe("Event Service Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const eventDate = new Date("2027-01-15T09:00:00.000Z");
    const createdAt = new Date("2026-11-01T09:00:00.000Z");

    const mockDocument = {
        id: "event123",
        data: () => ({
            name: "Test Event",
            date: { toDate: () => eventDate },
            capacity: 100,
            registrationCount: 0,
            status: "active",
            category: "general",
            createdAt: { toDate: () => createdAt },
            updatedAt: { toDate: () => createdAt },
        }),
    };

    it("should retrieve all events", async () => {
        // Arrange
        const mockSnapshot = {
            docs: [mockDocument],
        };

        (getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

        // Act
        const events = await getAllEvents();

        // Assert
        expect(getDocuments).toHaveBeenCalledWith("events");
        expect(events).toHaveLength(1);
        expect(events[0].name).toBe("Test Event");
        expect(events[0].capacity).toBe(100);
        expect(events[0].date).toEqual(eventDate);
    });

    it("should create a new event", async () => {
        // Arrange
        const eventData = {
            name: "Test Conference",
            date: new Date("2027-01-15T09:00:00.000Z"),
            capacity: 100,
        };

        (createDocument as jest.Mock).mockResolvedValue("event456");

        // Act
        const event = await createEvent(eventData);

        // Assert
        expect(createDocument).toHaveBeenCalledWith(
            "events",
            expect.objectContaining({
                name: "Test Conference",
                capacity: 100,
                registrationCount: 0,
                status: "active",
                category: "general",
            })
        );

        expect(event.id).toBe("event456");
        expect(event.name).toBe("Test Conference");
    });

    it("should retrieve an event by ID", async () => {
        // Arrange
        (getDocumentById as jest.Mock).mockResolvedValue(mockDocument);

        // Act
        const event = await getEventById("event123");

        // Assert
        expect(getDocumentById).toHaveBeenCalledWith(
            "events",
            "event123"
        );
        expect(event.id).toBe("event123");
        expect(event.name).toBe("Test Event");
        expect(event.capacity).toBe(100);
        expect(event.date).toEqual(eventDate);
    });

    it("should update an existing event", async () => {
        // Arrange
        (getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
        (updateDocument as jest.Mock).mockResolvedValue(undefined);

        const updateData = {
            name: "Updated Test Event",
            capacity: 150,
        };

        // Act
        const event = await updateEvent("event123", updateData);

        // Assert
        expect(getDocumentById).toHaveBeenCalledWith(
            "events",
            "event123"
        );

        expect(updateDocument).toHaveBeenCalledWith(
            "events",
            "event123",
            expect.objectContaining({
                name: "Updated Test Event",
                capacity: 150,
                updatedAt: expect.any(Date),
            })
        );

        expect(event.name).toBe("Updated Test Event");
        expect(event.capacity).toBe(150);
        expect(event.registrationCount).toBe(0);
    });

    it("should delete an existing event", async () => {
        // Arrange
        (getDocumentById as jest.Mock).mockResolvedValue(mockDocument);
        (deleteDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        await deleteEvent("event123");

        // Assert
        expect(getDocumentById).toHaveBeenCalledWith(
            "events",
            "event123"
        );

        expect(deleteDocument).toHaveBeenCalledWith(
            "events",
            "event123"
        );
    });
});
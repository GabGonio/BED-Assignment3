import { eventSchemas } from "../src/api/v1/validation/eventValidation";

describe("Create Event Validation", () => {
    it("should reject an event when name is missing", () => {
        // Arrange
        const eventData = {
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
        };

        // Act
        const { error } = eventSchemas.create.body!.validate(eventData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toBe('"name" is required');
    });

    it("should reject an event when name is less than 3 characters", () => {
        // Arrange
        const eventData = {
            name: "AB",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
        };

        // Act
        const { error } = eventSchemas.create.body!.validate(eventData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toBe(
            '"name" length must be at least 3 characters long'
        );
    });

    it("should reject an event when capacity is below 5", () => {
        // Arrange
        const eventData = {
            name: "Small Event",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 4,
        };

        // Act
        const { error } = eventSchemas.create.body!.validate(eventData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toBe(
            '"capacity" must be greater than or equal to 5'
        );
    });

    it("should reject an event when registration count exceeds capacity", () => {
        // Arrange
        const eventData = {
            name: "Overbooked Event",
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 100,
            registrationCount: 150,
        };

        // Act
        const { error } = eventSchemas.create.body!.validate(eventData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toBe(
            '"registrationCount" must be less than or equal to ref:capacity'
        );
    });
});

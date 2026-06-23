import { query } from "./database/db.js";

class Person {
    async createPerson(firstName, surname, dateOfBirth, emailAddress, age) {
        if (!firstName || !surname || !dateOfBirth || !emailAddress) {
            throw new Error("All fields are required");
        }

        if (age < 0 || age > 150) {
            throw new Error("Age must be between 0 and 150");
        }

        const sql = "INSERT INTO Person (FirstName, Surname, DateOfBirth, EmailAddress, Age) VALUES (?, ?, ?, ?, ?)";
        const result = await query(sql, [firstName, surname, dateOfBirth, emailAddress, age]);
        return { success: true, message: `User created with ID: ${result.insertId}`, id: result.insertId };
    }

    async loadPerson(personId) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const rows = await query("SELECT * FROM Person WHERE Id = ?", [personId]);

        if (rows.length === 0) throw new Error(`Person with ID ${personId} not found`);
        return rows[0];
    }

    async updatePerson(personId, firstName, surname, dateOfBirth, emailAddress, age) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const existingUser = await this.loadPerson(personId).catch(() => null);

        if (!existingUser) throw new Error(`Person with ID ${personId} not found`);
        
        const sql = "UPDATE Person SET FirstName = ?, Surname = ?, DateOfBirth = ?, EmailAddress = ?, Age = ? WHERE Id = ?";
        await query(sql, [firstName, surname, dateOfBirth, emailAddress, age, personId]);
        
        const rows = await this.loadPerson(personId);
        return rows;
    }

    async deletePerson(personId) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const existingUser = await this.loadPerson(personId).catch(() => null);

        if (!existingUser) throw new Error(`Person with ID ${personId} not found`);

        await query("DELETE FROM Person WHERE Id = ?", [personId]);
        return { success: true, message: `Person deleted with ID: ${personId}` };
    }

    async loadAllPeople() {
        return await query("SELECT * FROM Person");
    }

    async deleteAllPeople() {
        const result = await query("DELETE FROM Person");
        return { success: true, message: "All people deleted", deleted: result.affectedRows };
    }
}

export default Person;

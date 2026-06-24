import { query } from "../database/db.js";

export class Person {
    static calculateAge(dateOfBirth) {
        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        const yearsOld = currentDate.getFullYear() - birthDate.getFullYear();
        const monthsDiff = currentDate.getMonth() - birthDate.getMonth();
        const daysDiff = currentDate.getDate() - birthDate.getDate();

        if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
            return yearsOld - 1;
        }
        return yearsOld;
    }

    async createPerson(firstName, lastName, dateOfBirth, emailAddress, age) {
        if (!firstName || !lastName || !dateOfBirth || !emailAddress) {
            throw new Error("All fields are required");
        }

        if (age < 0 || age > 150) {
            throw new Error("Age must be between 0 and 150");
        }

        const sql = "INSERT INTO Person (FirstName, LastName, DateOfBirth, EmailAddress, Age) VALUES (?, ?, ?, ?, ?)";
        let result;
        try {
            result = await query(sql, [firstName, lastName, dateOfBirth, emailAddress, age]);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error("A person with this email address already exists");
            }
            throw error;
        }
        return { id: result.insertId, firstName, lastName, dateOfBirth, emailAddress, age };
    }

    async loadPerson(personId) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const rows = await query("SELECT * FROM Person WHERE Id = ?", [personId]);

        if (rows.length === 0) throw new Error(`Person with ID ${personId} not found`);
        return rows[0];
    }

    async updatePerson(personId, firstName, lastName, dateOfBirth, emailAddress, age) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const existingUser = await this.loadPerson(personId);

        if (!existingUser) throw new Error(`Person with ID ${personId} not found`);

        const sql = "UPDATE Person SET FirstName = ?, LastName = ?, DateOfBirth = ?, EmailAddress = ?, Age = ? WHERE Id = ?";
        const rows = await query(sql, [firstName, lastName, dateOfBirth, emailAddress, age, personId]);

        const rows = await this.loadPerson(personId);
        return rows;
    }

    async deletePerson(personId) {
        if (!personId || personId < 1) throw new Error("Invalid person ID");

        const existingUser = await this.loadPerson(personId);

        if (!existingUser) throw new Error(`Person with ID ${personId} not found`);

        await query("DELETE FROM Person WHERE Id = ?", [personId]);
        return { message: `Person deleted with ID: ${personId}` };
    }

    async loadAllPeople() {
        return await query("SELECT * FROM Person");
    }

    async deleteAllPeople() {
        const result = await query("DELETE FROM Person");
        return { message: "All people deleted", deleted: result.affectedRows };
    }
}
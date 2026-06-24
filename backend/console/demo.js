import { Person } from "../models/person.js";

const person = new Person();

async function demo() {
    console.log("=== DELETE ALL ===");
    console.log(await person.deleteAllPeople());

    console.log("\n CREATE PERSON ===");
    
    const created = await person.createPerson("John", "Doe", "2001-05-10", "johndoe@example.com", Person.calculateAge("2001-05-10"));
    console.log(created);
    const personId = created.id;

    console.log("\n=== LOAD ALL PEOPLE ===");
    console.log(await person.loadAllPeople());

    console.log("\n=== LOAD PERSON ===");
    console.log(await person.loadPerson(personId));

    console.log("\n=== UPDATE PERSON ===");
    const updated = await person.updatePerson(personId, "John", "Doe Updated", "2001-05-10", "tyrique.updated@demo.com", Person.calculateAge("2001-05-10"));
    console.log(updated);

    console.log("\n=== DELETE PERSON ===");
    console.log(await person.deletePerson(personId));

    console.log("\n=== LOAD ALL (empty) ===");
    console.log(await person.loadAllPeople());

    process.exit(0);
}

demo().catch((err) => {
    console.error(err);
    process.exit(1);
});

import http from "http";
import { URL } from "url";
import { Person } from "./models/person.js";

const person = new Person();

function send(response, status, data) {
    response.statusCode = status;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(data));
}

function getBody(request) {
    return new Promise((resolve, reject) => {
        let data = "";
        request.on("data", (chunk) => (data += chunk));
        request.on("end", () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (error) {
                reject(new Error("Invalid JSON in request body"));
            }
        });
        request.on("error", (error) => reject(new Error(`Request error: ${error.message}`)));
    });
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const method = request.method;
    const path = url.pathname;

    try {
        if (method === "GET" && path === "/people") {
            const people = await person.loadAllPeople();
            return send(response, 200, people);
        }

        const matchGet = path.match(/^\/people\/(\d+)$/);
        if (method === "GET" && matchGet) {
            const result = await person.loadPerson(Number(matchGet[1]));
            return send(response, 200, result);
        }

        if (method === "POST" && path === "/people") {
            const body = await getBody(request);
            const age = Person.calculateAge(body.dateOfBirth);
            const result = await person.createPerson(
                body.firstName,
                body.lastName,
                body.dateOfBirth,
                body.emailAddress,
                age
            );
            return send(response, 201, result);
        }

        const matchPatch = path.match(/^\/people\/(\d+)$/);
        if (method === "PATCH" && matchPatch) {
            const body = await getBody(request);
            const age = Person.calculateAge(body.dateOfBirth);
            const result = await person.updatePerson(
                Number(matchPatch[1]),
                body.firstName,
                body.lastName,
                body.dateOfBirth,
                body.emailAddress,
                age
            );
            return send(response, 203, result);
        }

        const matchDelete = path.match(/^\/people\/(\d+)$/);
        if (method === "DELETE" && matchDelete) {
            await person.deletePerson(Number(matchDelete[1]));
            response.statusCode = 204;
            return response.end();
        }

        if (method === "DELETE" && path === "/people") {
            await person.deleteAllPeople();
            response.statusCode = 204;
            return response.end();
        }

        send(response, 404, { error: "Route not found" });

    } catch (error) {
        const message = error.message;

        if (message.includes("not found")) {
            return send(response, 404, { error: message });
        }
        if (
            message.includes("required") ||
            message.includes("Invalid") ||
            message.includes("already exists") ||
            message.includes("Invalid JSON")
        ) {
            return send(response, 400, { error: message });
        }

        console.error("Unhandled error:", error);
        send(response, 500, { error: "Internal server error" });
    }
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));

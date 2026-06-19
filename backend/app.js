import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;
const gear = {
    "Baseball Bat": "Andy",
    "Padel raquet": "Andy",
    "Golf club": "Bob",
    "Cricket Bat": "Andy",
    "Hockey stick": "Candice",
};

app.use(cors());
app.use(express.json());

function groupByOwner(ownerKey) {
    return Object.fromEntries(
        Object.entries(gear).filter(([item, owner]) => owner === ownerKey)
    );
}

app.post("/api/data", (request, response) => {
    let ownerKey = request.body.ownerKey;

    const dataFromNode = {
        results: {
            equipmentObj: groupByOwner(ownerKey),
        },
    };

    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
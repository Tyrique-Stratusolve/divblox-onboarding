import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function groupByOwner(ownerKey) {
    console.log(ownerKey);
    return ownerKey;
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
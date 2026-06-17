import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function nearestFibonacci(number) {
    return number;
}

function generateFibonacci(number) {
    return number;
}

app.post("/api/data", (request, response) => {
    const fibNum = request.body.fibNum;

    const dataFromNode = {
        results: {
            nearestFibonacci: nearestFibonacci(fibNum),
            generateFibonacci: generateFibonacci(fibNum),
        },
    };

    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
import express from 'express';
import cors from 'cors';

console.log('hello from app.js');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/data', (request, response) => {
    const dataFromNode = {
        message: "Hello World timestamp:",
        timestamp: new Date()
    };
    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
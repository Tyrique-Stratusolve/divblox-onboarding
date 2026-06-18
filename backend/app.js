import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function nearestFibonacci(maxVal, currentNumVal = 0, nextNumVal = 1) {
    if (maxVal <= 0) return [];

    let fibArr = [];
    
    while (currentNumVal <= maxVal) {
        fibArr.push(currentNumVal);
        const tempNumVal = currentNumVal + nextNumVal;
        currentNumVal = nextNumVal;
        nextNumVal = tempNumVal;
    }

    return fibArr;
}

function generateFibonacci(numTerms, initalNumVal = 0, secondNumVal = 1, fibArr = []) {
    if (numTerms <= 0) return fibArr;

    fibArr.push(initalNumVal);
    let nextNumVal = initalNumVal + secondNumVal;

    return generateFibonacci(numTerms - 1, secondNumVal, nextNumVal, fibArr);
}

app.post("/api/data", (request, response) => {
    let palindromeStr = request.body.palindromeStr;

    const dataFromNode = {
        results: {
            nearestFibonacci: nearestFibonacci(fibNum),
            generateFibonacci: generateFibonacci(fibNum),
        },
    };

    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
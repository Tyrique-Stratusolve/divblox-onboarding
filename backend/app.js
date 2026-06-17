import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

function addAll(array) {
    if (array.length === 0) {
        return 0;
    }

    let grandTotal = array.reduce((accumulator, current) => accumulator + current, 0);
    array.shift();

    return grandTotal + addAll(array);
}

function addAllForLoop(array) {
    let grandTotal = 0;
    
    for (let i = 0; i < array.length; i++) {
        let sum = 0;
        sum = array.slice(i).reduce((accumulator, current) => accumulator + current, 0);
        grandTotal += sum;
    }

    return grandTotal;
}

function addAllShift(array) {
    let grandTotal = 0;

    while (array.length > 0) {
        let currentSum = array.reduce((accumulator, current) => accumulator + current, 0);
        array.shift();
        grandTotal = grandTotal + currentSum;
    }

    return grandTotal;
}

function addAllPop(array) {
    let grandTotal = 0;

    while (array.length > 0) {
        let currentSum = array.reduce((accumulator, current) => accumulator + current, 0);
        array.pop();
        grandTotal = grandTotal + currentSum;
    }

    return grandTotal;
}

app.get("/api/data", (request, response) => {
    const array = [1, 1, 1, 1, 1];

    const dataFromNode = {
        array: array,
        results: {
            recursive: addAll([...array]),
            forLoop: addAllForLoop([...array]),
            shift: addAllShift([...array]),
            pop: addAllPop([...array]),
        },
    };

    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
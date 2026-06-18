import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function isPalindrome(palindromeStr) {
    const cleanPalindromeStr = palindromeStr.toLowerCase().replace(/[^a-z0-9]/g,'');
    return cleanPalindromeStr === cleanPalindromeStr.split('').reverse().join('');
}

app.post("/api/data", (request, response) => {
    let palindromeStr = request.body.palindromeStr;

    const dataFromNode = {
        results: {
            isPalindrome: isPalindrome(palindromeStr),
        },
    };

    response.json(dataFromNode);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const input = document.getElementById("palindromeInputField");
const button = document.getElementById("actionBtn");
const displayPalindrome = document.getElementById("displayPalindrome");

const errorDisplay = document.getElementById("errorDisplay");

function setResult(id, value) {
    const element = document.getElementById(id);
    element.textContent = value;
}

button.addEventListener("click", async () => {
    let inputValue = input.value;

    errorDisplay.textContent = "";
    try {
        const response = await fetch("http://localhost:3000/api/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                palindromeStr: inputValue
            })
        });

        const data = await response.json();

        setResult("nearestFibonacci", data.results.nearestFibonacci);
        setResult("generateFibonacci", data.results.generateFibonacci);
    } catch (error) {
        console.error("Error fetching data:", error);
        errorDisplay.textContent = "Failed to connect to Node.js server. Make sure it's running on port 3000.";
    }
});

const button = document.getElementById("actionBtn");
const arrayDisplay = document.getElementById("arrayDisplay");
const resultRecursive = document.getElementById("resultRecursive");
const resultForLoop = document.getElementById("resultForLoop");
const resultShift = document.getElementById("resultShift");
const resultPop = document.getElementById("resultPop");
const errorDisplay = document.getElementById("errorDisplay");

function setResult(id, value) {
    const element = document.getElementById(id);
    element.textContent = value;
}

button.addEventListener("click", async () => {
    errorDisplay.textContent = "";
    try {
        const response = await fetch("http://localhost:3000/api/data");
        const data = await response.json();

        arrayDisplay.textContent = JSON.stringify(data.array);

        setResult("resultRecursive", data.results.recursive);
        setResult("resultForLoop", data.results.forLoop);
        setResult("resultShift", data.results.shift);
        setResult("resultPop", data.results.pop);
    } catch (error) {
        console.error("Error fetching data:", error);
        errorDisplay.textContent = "Failed to connect to Node.js server. Make sure it's running on port 3000.";
    }
});

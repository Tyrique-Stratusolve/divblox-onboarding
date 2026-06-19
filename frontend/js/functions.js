const input = document.getElementById("ownersDropdown");
const button = document.getElementById("actionBtn");

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
                ownerKey: inputValue
            })
        });

        const data = await response.json();

        const items = Object.keys(data.results.equipmentObj);
        setResult("displayEquipment", items.join(", "));
    } catch (error) {
        console.error("Error fetching data:", error);
        errorDisplay.textContent = "Failed to connect to Node.js server. Make sure it's running on port 3000.";
    }
});

const button = document.getElementById("actionBtn");
const errorDisplay = document.getElementById("errorDisplay");

function setResult(id, value) {
    const element = document.getElementById(id);
    element.textContent = value;
}

async function fetchTestData() {
    const response = await fetch("https://api.agify.io/?name=test", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log(`Age: ${data.age} | Called ${data.count} times`);

    setResult("testApi", `Age: ${data.age} | Called ${data.count} times`);
}

async function fetchDragoniteData() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/dragonite", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Oops`);
    }

    const dragonite = await response.json();
    const stats = dragonite.stats.map(stats => `${stats.stat.name}: ${stats.base_stat}`).join(', ');
    const typeUrls = dragonite.types.map(types => types.type.url);
    
    const typeResponses = await Promise.all(
        typeUrls.map(url => fetch(url).then(response => response.json()))
    );

    const weaknesses = [];
    typeResponses.forEach(type => {
        type.damage_relations.double_damage_from.forEach(weakness => {
            if (!weaknesses.find(existing => existing.name === weakness.name)) {
                weaknesses.push(weakness);
            }
        });
    });

    const weaknessNames = weaknesses.map(weaknesses => weaknesses.name).join(', ');
    
    console.log('Dragonite:', dragonite);
    console.log('Stats:', stats);
    console.log('Type URLs:', typeUrls);
    console.log('Dragonite is weak against:', weaknessNames);
    
    setResult("pokemonApi", weaknessNames);
}

button.addEventListener("click", async () => {
    errorDisplay.textContent = "";
    try {
        await fetchTestData();
        await fetchDragoniteData();
    } catch (error) {
        console.error("Error fetching data:", error);
        errorDisplay.textContent = "Failed to fetch data: " + error.message;
    }
});

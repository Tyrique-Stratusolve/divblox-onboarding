const button = document.getElementById('actionBtn');
const heading = document.getElementById('displayTxt');

button.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        const data = await response.json();
        
        heading.textContent = data.message + ' ' + data.totalSum;
    } catch (error) {
        console.error('Error fetching data:', error);
        heading.textContent = 'Failed to connect to Node.js server';
    }
});
d3.json('data/data.json', d => {
    // Assuming 'd' contains your JSON data
}).then(data => {

    const venueSpan = document.getElementById('venueName');
    venueSpan.textContent = data.venueName;

    const scoreSpan = document.getElementById('scoreSpan');
    scoreSpan.textContent = data.score;

    renderFormations(data.home.formations[0].formationPositions, 'home');

}).catch(error => {
    console.error('Error loading data:', error);
});

const map = L.map('map').setView([coordinate1, coordinate0], 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a marker at the same coordinates as the map's view
const marker = L.marker([coordinate1, coordinate0]).addTo(map);

// Optionally, you can add a popup to the marker
marker.bindPopup("<b>Here is you room!</b><br>Check it Now!.").openPopup();

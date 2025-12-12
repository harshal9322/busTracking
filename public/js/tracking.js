const mapEl = document.getElementById("map");
const bus = JSON.parse(mapEl.dataset.bus);

console.log('bus data:', bus);
 const lat = bus.currentLocation?.lat || 0;
 const lng = bus.currentLocation?.lng || 0;

  const map = L.map("map").setView([lat, lng], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const socket = io();
const busMarker = {};

socket.on("busLocationUpdated", ({busNumber, lat, lng}) => {
    console.log("📍 Received update:", busNumber, lat, lng);
    if(busMarker[busNumber]){
        busMarker[busNumber].setLatLng([lat, lng]);
    }else{
        busMarker[busNumber] = L.marker({lat, lng})
        .addTo(map)
        .bindPopup(`Bus Number: ${busNumber}`);
        map.setView([lat, lng], 25);
    }
});
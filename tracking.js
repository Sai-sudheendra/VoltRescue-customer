function redirectToPayment() {
  window.location.href = "payment.html";
}

// Initialize Firebase apps
const providerApp = firebase.initializeApp({
  apiKey: "AIzaSyAAyrEFXbkXBLdLL5GfC1uhKtwXtyxw2Co",
  authDomain: "provider-be5bb.firebaseapp.com",
  databaseURL: "https://provider-be5bb-default-rtdb.firebaseio.com",
  projectId: "provider-be5bb",
  storageBucket: "provider-be5bb.appspot.com",
  messagingSenderId: "369217308539",
  appId: "1:369217308539:android:15ed20e5b6899114845fde"
}, "provider");

const customerApp = firebase.initializeApp({
  apiKey: "AIzaSyAqrdaF-b89oIkq5pcPU5S29HdbvuuVFdI",
  authDomain: "customer-cf63b.firebaseapp.com",
  databaseURL: "https://customer-cf63b-default-rtdb.firebaseio.com",
  projectId: "customer-cf63b",
  storageBucket: "customer-cf63b.appspot.com",
  messagingSenderId: "994638162715",
  appId: "1:994638162715:android:869a9f3ea345edb12dc1be"
}, "customer");

const providerDB = providerApp.database();
const customerDB = customerApp.database();

// Get IDs from URL
const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get("customerId");
const providerId = urlParams.get("providerId");

if (!customerId || !providerId) {
  alert("Missing customerId or providerId in URL.");
  throw new Error("Missing URL parameters");
}

// Set up map
const map = L.map("map").setView([20, 78], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Icons
const providerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/726/726448.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

const customerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

let providerMarker = null;
let customerMarker = null;
let providerLatLng = null;
let customerLatLng = null;
let routeControl = null;

// Update ETA
function updateETA(distKm) {
  const eta = distKm > 0 ? Math.round((distKm / 40) * 60) : 0;
  document.getElementById("distance").textContent = distKm.toFixed(2);
  document.getElementById("eta").textContent = eta;
}

// Calculate distance
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Draw route
function refreshDistance() {
  if (providerLatLng && customerLatLng) {
    const dist = getDistanceKm(providerLatLng[0], providerLatLng[1], customerLatLng[0], customerLatLng[1]);
    updateETA(dist);

    if (routeControl) {
      map.removeControl(routeControl);
    }

    routeControl = L.Routing.control({
      waypoints: [
        L.latLng(providerLatLng[0], providerLatLng[1]),
        L.latLng(customerLatLng[0], customerLatLng[1])
      ],
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "red", weight: 6, opacity: 0.9 }],
        addWaypoints: false
      },
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false
    }).addTo(map);
  }
}

// Fetch customer location from Realtime DB
customerDB.ref("locations/" + customerId).once("value").then(snapshot => {
  const loc = snapshot.val();
  console.log("Customer location:", loc);
  if (loc && loc.lat && loc.lng) {
    customerLatLng = [loc.lat, loc.lng];
    if (customerMarker) {
      customerMarker.setLatLng(customerLatLng);
    } else {
      customerMarker = L.marker(customerLatLng, { icon: customerIcon }).addTo(map);
      customerMarker.bindPopup("Customer Location").openPopup();
    }
    map.setView(customerLatLng, 13);
    refreshDistance();
  } else {
    alert("Customer location data is missing.");
  }
});

// Fetch provider details
providerDB.ref("providers/" + providerId).on("value", snapshot => {
  const data = snapshot.val();
  if (data) {
    document.getElementById("providerName").textContent = data.name || "N/A";
    document.getElementById("providerPhone").textContent = data.phone || "N/A";
    document.getElementById("providerPayment").textContent = data.paymentId || "N/A";
  }
});

// Track provider location
providerDB.ref("locations/" + providerId).on("value", snapshot => {
  const loc = snapshot.val();
  if (loc && loc.lat && loc.lng) {
    providerLatLng = [loc.lat, loc.lng];
    if (providerMarker) {
      providerMarker.setLatLng(providerLatLng);
    } else {
      providerMarker = L.marker(providerLatLng, { icon: providerIcon }).addTo(map);
      providerMarker.bindPopup("Provider Location");
    }
    refreshDistance();
  }
});

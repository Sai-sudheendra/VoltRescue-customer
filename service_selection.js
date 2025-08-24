// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAyrEFXbkXBLdLL5GfC1uhKtwXtyxw2Co",
  authDomain: "provider-be5bb.firebaseapp.com",
  databaseURL: "https://provider-be5bb-default-rtdb.firebaseio.com",
  projectId: "provider-be5bb",
  storageBucket: "provider-be5bb.appspot.com",
  messagingSenderId: "369217308539",
  appId: "1:369217308539:android:15ed20e5b6899114845fde"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function selectService(service, buttonElement) {
  document.getElementById("serviceType").value = service;
  document.querySelectorAll(".service-btn").forEach(btn => btn.classList.remove("selected"));
  buttonElement.classList.add("selected");
}

function submitRequest() {
  const service = document.getElementById("serviceType").value;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const vehicle = document.getElementById("vehicle").value.trim();
  const statusEl = document.getElementById("statusText");

  if (!service || !name || !phone || !vehicle) {
    alert("Please complete all fields including service, name, phone, and vehicle.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  statusEl.textContent = "Retrieving your location…";

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude: lat, longitude: lng } = position.coords;

      db.collection("customerRequests").add({
        customerName: name,
        customerPhone: phone,
        serviceType: service,
        vehicle: vehicle,
        status: "pending",
        providerId: "", // will be assigned later
        latitude: lat,
        longitude: lng,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        statusEl.textContent = "Request submitted successfully!";
        const customerId = docRef.id;
        const providerId = docRef.id; // initially same, or can be "" until matched
        window.location.href = `tracking.html?customerId=${customerId}&providerId=${providerId}`;
      })
      .catch(err => {
        console.error("Error writing to Firestore:", err);
        statusEl.textContent = "Submission failed.";
      });
    },
    error => {
      alert("Failed to get location: " + error.message);
      statusEl.textContent = "";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

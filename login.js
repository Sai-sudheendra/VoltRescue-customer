// Firebase configuration for Provider app
const firebaseConfig = {
 apiKey: "AIzaSyAqrdaF-b89oIkq5pcPU5S29HdbvuuVFdI",
  authDomain: "customer-cf63b.firebaseapp.com",
  databaseURL: "https://customer-cf63b-default-rtdb.firebaseio.com",
  projectId: "customer-cf63b",
  storageBucket: "customer-cf63b.appspot.com",
  messagingSenderId: "994638162715",
  appId: "1:994638162715:android:869a9f3ea345edb12dc1be"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Email/password login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "service_selection.html";
    })
    .catch(error => {
      alert('Login error: ' + error.message);
      console.error(error);
    });
});

// Google sign-in
document.getElementById('googleBtn').addEventListener('click', function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      window.location.href = "service_selection.html";
    })
    .catch(error => {
      alert('Google Sign-In error: ' + error.message);
      console.error(error);
    });
});

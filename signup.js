import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Replace with your actual provider Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAqrdaF-b89oIkq5pcPU5S29HdbvuuVFdI",
  authDomain: "customer-cf63b.firebaseapp.com",
  databaseURL: "https://customer-cf63b-default-rtdb.firebaseio.com",
  projectId: "customer-cf63b",
  storageBucket: "customer-cf63b.appspot.com",
  messagingSenderId: "994638162715",
  appId: "1:994638162715:android:869a9f3ea345edb12dc1be"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Provider account created successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Sign Up Failed: " + error.message);
    console.error(error);
  }
});

window.googleSignUp = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Signed in as: " + result.user.displayName);
    window.location.href = "index.html";
  } catch (error) {
    alert("Google Sign-In Failed: " + error.message);
    console.error("Google Sign-In Error:", error);
  }
};

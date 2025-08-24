// Initialize Firebase only if not already initialized
if (!firebase.apps.length || !firebase.apps.some(app => app.name === "provider")) {
  const providerApp = firebase.initializeApp({
    apiKey: "AIzaSyAAyrEFXbkXBLdLL5GfC1uhKtwXtyxw2Co",
    authDomain: "provider-be5bb.firebaseapp.com",
    databaseURL: "https://provider-be5bb-default-rtdb.firebaseio.com",
    projectId: "provider-be5bb",
    storageBucket: "provider-be5bb.appspot.com",
    messagingSenderId: "369217308539", // ✅ Corrected
    appId: "1:369217308539:android:15ed20e5b6899114845fde"
  }, "provider");

  window.providerDB = providerApp.database();
}

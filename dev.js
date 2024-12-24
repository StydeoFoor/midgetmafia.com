import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyB17qMT--ON4KaYZLnEjU5HbwZmds9KgWg",
  authDomain: "midget-mafia.firebaseapp.com",
  databaseURL: "https://midget-mafia-default-rtdb.firebaseio.com",
  projectId: "midget-mafia",
  storageBucket: "midget-mafia.firebasestorage.app",
  messagingSenderId: "597092364947",
  appId: "1:597092364947:web:2c7db18295c2cd151f5366",
  measurementId: "G-3PTREP7EJ8",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

function checkUser() {
    if (!loggedInUser) {
      alert("You are not logged in");
      window.location.href = "index.html";
      return;
    }
  
    if (loggedInUser.role !== "Developer" && loggedInUser.role !== "TrustedInstaller") {
      alert("You are not allowed here.");
      window.location.href = "index.html";
      return;
    }
  }
  
  // Call the function to perform the checks
  checkUser();

// Fetch all user names from the "users" node


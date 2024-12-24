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

function generateRandomPassword(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
  
  // Function to create the TrustedInstaller account in Firebase
  function createTrustedInstaller() {
    const password = generateRandomPassword();
    const userData = {
      role: "TrustedInstaller",
      name: "TrustedInstaller",
      currentInvolvement: "N/A",
      password: password,
      team: "Developer Team",
    };
  
    set(ref(database, "users/Test"), userData)
      .then(() => {
        document.getElementById("trustPass").textContent = `TrustedInstaller password: ${password}`;
        alert("TrustedInstaller account created.");
      })
      .catch((error) => {
        console.error("Error creating account:", error);
      });
  }
  
  // Function to delete the TrustedInstaller account from Firebase
  function deleteTrustedInstaller() {
    remove(ref(database, "users/TrustedInstaller"))
      .then(() => {
        document.getElementById("trustPass").textContent = "TrustedInstaller password:";
        alert("TrustedInstaller account deleted.");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });
  }
  
  // Event listeners for the buttons
  document.getElementById("create").addEventListener("click", createTrustedInstaller);
  document.getElementById("delete").addEventListener("click", deleteTrustedInstaller);

  const statusRef = ref(database, 'users/TrustedInstaller/status');
onValue(statusRef, (snapshot) => {
  if (snapshot.exists()) {
    const status = snapshot.val();
    const statusMessageElement = document.getElementById('trustStatus');
    if (status === "active") {
      statusMessageElement.textContent = "TrustedInstaller is active.";
      statusMessageElement.style.color = "green";
    } else if (status === "inactive") {
      statusMessageElement.textContent = "TrustedInstaller is inactive.";
      statusMessageElement.style.color = "red";
    } else {
      statusMessageElement.textContent = "Unknown status.";
      statusMessageElement.style.color = "gray";
    }
  } else {
    console.log("No status data found for TrustedInstaller.");
  }
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

checkUser();

document.getElementById("userForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("role").value.trim();
  const team = document.getElementById("team").value.trim();
  const name = document.getElementById("name").value.trim();
  const currentInvolvement = document.getElementById("currentInvolvement").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !role || !team || !name || !currentInvolvement || !password) {
    alert("All fields are required!");
    return;
  }

  try {
    const userRef = ref(database, `users/${username}`);
    await set(userRef, { role, team, name, currentInvolvement, password });
    alert("User data submitted successfully!");
    document.getElementById("userForm").reset();
    loadUsers();
  } catch (error) {
    console.error("Error submitting user data:", error);
    alert("An error occurred. Please try again.");
  }
});

async function loadRequests() {
    const requestsRef = ref(database, "requests");
  
    onValue(requestsRef, (snapshot) => {
      const requestsList = document.getElementById("requestsList");
      requestsList.innerHTML = ""; // Clear existing list
  
      if (snapshot.exists()) {
        const requests = snapshot.val();
  
        Object.entries(requests).forEach(([requestId, requestData]) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Request ID: ${requestId}, Type: ${requestData.type}, Description: ${requestData.description}`;
          requestsList.appendChild(listItem);
        });
      } else {
        requestsList.innerHTML = "<li>No requests available</li>";
      }
    });
  }

window.onload = loadRequests;
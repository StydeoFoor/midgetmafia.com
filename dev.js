import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const topbar = document.getElementById("myTopBar");
const body = document.body;

const themes = ["dark", "light", "ocean", "sunset", "midnight"];
let currentThemeIndex = themes.indexOf(localStorage.getItem("theme") || "dark");

// Apply the selected theme
function applyTheme(theme) {
  switch (theme) {
    case "dark":
      applyDarkMode();
      break;
    case "light":
      applyLightMode();
      break;
    case "ocean":
      applyOceanTheme();
      break;
    case "sunset":
      applySunsetTheme();
      break;
    case "midnight":
      applyMidnightTheme();
      break;
    default:
      console.error("Unknown theme:", theme);
  }
  localStorage.setItem("theme", theme); // Save theme to localStorage
}

// Theme Functions
function applyDarkMode() {
  body.style.background = "#303030";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#242424";
  if (sidebar) sidebar.style.backgroundColor = "#242424";
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";
  if (sidebar) sidebar.style.backgroundColor = "#e8e8e8";
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";
  if (sidebar) sidebar.style.backgroundColor = "#003c60";
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";
  if (sidebar) sidebar.style.backgroundColor = "#b35b47";

  body.querySelectorAll("h1, h2, h3").forEach((el) => (el.style.color = "white"));
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";
  if (sidebar) sidebar.style.backgroundColor = "#000000";
}


// Initialize the theme
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const defaultTheme = savedTheme || "dark";
  applyTheme(defaultTheme);
}

// Add theme switching button logic
document.getElementById("themeButton")?.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(themes[currentThemeIndex]);
});

// Call the theme initializer
initializeTheme();

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
  if (!auth.currentUser) {
    alert("User not authenticated, go to login and re-login");
    return; // Stops sending message
  } 
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
  if (!auth.currentUser) {
    return; // Stops sending message
  } 
    const requestsRef = ref(database, "requests");
  
    onValue(requestsRef, (snapshot) => {
      const requestsList = document.getElementById("requestsList");
      requestsList.innerHTML = ""; // Clear existing list
  
      if (snapshot.exists()) {
        const requests = snapshot.val();
  
        Object.entries(requests).forEach(([requestId, requestData]) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Name: ${requestData.name}, Description: ${requestData.description}`;
          requestsList.appendChild(listItem);
        });
      } else {
        requestsList.innerHTML = "<li>No requests available</li>";
      }
    });
  }

window.onload = loadRequests;
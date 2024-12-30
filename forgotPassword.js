import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

const themes = ["dark", "light", "ocean", "sunset", "chrome", "midnight"];
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
    case "chrome":
      applyChromeTheme();
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
  document.body.style.background = "#303030";
  document.body.style.color = "white";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
}

function applyLightMode() {
  document.body.style.background = "#ffffff";
  document.body.style.color = "black";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
}

function applyOceanTheme() {
  document.body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  document.body.style.minHeight = "100vh";
  document.body.style.color = "white";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
}

function applySunsetTheme() {
  document.body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  document.body.style.minHeight = "100vh";
  document.body.style.color = "black";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
}

function applyChromeTheme() {
  document.body.style.background = "#303030";
  document.body.style.color = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
}

function applyMidnightTheme() {
  document.body.style.background = "#1a1a1a";
  document.body.style.color = "white";

  document.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
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

// Handle Password Reset Form Submission
document.getElementById("password-reset-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect user input
  const username = document.getElementById("username").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const role = document.getElementById("role").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  // Validate input
  if (!username || !ownerName || !role || !newPassword) {
    alert("All fields are required.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    // Reference the user node by username
    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      alert("No account found with the provided username.");
      return;
    }

    const userData = snapshot.val();

    // Validate owner name and role
    if (userData.name !== ownerName || userData.role !== role) {
      alert("The details provided do not match our records.");
      return;
    }

    // Update the password
    await set(userRef, {
      ...userData, // Retain existing data
      password: newPassword, // Update the password
    });

    alert("Password has been reset successfully.");
    // Optionally redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("An error occurred while resetting the password. Please try again.");
  }
});

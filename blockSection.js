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
const topbar = document.getElementById("myTopBar");
const body = document.body;

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
  body.style.background = "#303030";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#242424";

  localStorage.setItem("theme", "dark");
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";

  localStorage.setItem("theme", "light");
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";

  localStorage.setItem("theme", "ocean");
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";

  localStorage.setItem("theme", "sunset");
}

function applyChromeTheme() {
  body.style.background = "#303030";
  body.style.color = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);"

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#242424";

  localStorage.setItem("theme", "chrome");
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white"

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";

  localStorage.setItem("theme", "midnight");
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

const sections = {
    msgBlock: { id: "messages", label: "Messages" },
    courtBlock: { id: "courtroom", label: "Courtroom" },
    lockdown: { id: "lockdown", label: "Website Lockdown" },
  };

// Fetch all user names from the "users" node
async function lockSection(sectionId, button) {
    try {
      await set(ref(database, `locked/${sectionId}`), true);
      updateButtonState(button, sections[button.id].label, true);
      alert(`${sections[button.id].label} has been locked.`);
    } catch (error) {
      console.error(`Error locking ${sectionId}:`, error);
      alert("An error occurred while locking the section.");
    }
  }
  
  // Unlock a Section
  async function unlockSection(sectionId, button) {
    try {
      await set(ref(database, `locked/${sectionId}`), false);
      updateButtonState(button, sections[button.id].label, false);
      alert(`${sections[button.id].label} has been unlocked.`);
    } catch (error) {
      console.error(`Error unlocking ${sectionId}:`, error);
      alert("An error occurred while unlocking the section.");
    }
  }
  
  // Fetch Lock Status from Firebase
  async function fetchLockStatus() {
    try {
      const lockStatusRef = ref(database, "locked");
      const snapshot = await get(lockStatusRef);
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error("Error fetching lock status:", error);
      return {};
    }
  }
  
  // Update Button State
  function updateButtonState(button, sectionLabel, isLocked) {
    button.textContent = `${isLocked ? "Unlock" : "Lock"} ${sectionLabel}`;
    button.style.backgroundColor = isLocked ? "green" : "red";
  }
  
  // Initialize Buttons and Attach Events
  async function init() {
    try {
      const lockStatus = await fetchLockStatus();
  
      Object.entries(sections).forEach(([buttonId, section]) => {
        const button = document.getElementById(buttonId);
        if (!button) return;
  
        const isLocked = lockStatus[section.id] ?? false;
  
        // Update button state based on lock status
        updateButtonState(button, section.label, isLocked);
  
        // Attach click event listener
        button.addEventListener("click", async () => {
          if (isLocked) {
            await unlockSection(section.id, button);
          } else {
            await lockSection(section.id, button);
          }
        });
      });
    } catch (error) {
      console.error("Error initializing section lock system:", error);
    }
  }

window.onload = init;

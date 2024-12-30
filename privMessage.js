import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase Configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get Firebase Database instance

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

// Send message function using 'set'
function sendMessage(message) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    console.log("User is not logged in");
    return;
  }

  if (message.length > 500) {
    alert("Message exceeds the 500-character limit. Please shorten your message.");
    return;
  }

  // Get reference to 'chats' node in Firebase
  const messageRef = ref(database, "privChats/" + Date.now()); // Timestamp as unique ID for each message

  // Set the message data in Firebase
  set(messageRef, {
    username: loggedInUser.name,
    message: message,
    timestamp: Date.now(),
  })
    .then(() => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}


// Function to display messages in the chat bo

// Listen for real-time updates (whenever new messages are added)

// Call fetchMessages to load initial messages when the page loads

// Get references for input and send button
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Add event listener for Send button
sendButton.addEventListener("click", function () {
  const message = messageInput.value.trim();
  if (message) {
    sendMessage(message); // Send message to Firebase
    messageInput.value = ""; // Clear the input after sending
  }
});

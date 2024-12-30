import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

function fetchMessages() {
  const messagesRef = ref(database, "privChats/"); // Reference to your 'chats' node

  // Fetch messages once from Firebase
  get(messagesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const messages = snapshot.val();
        displayMessages(messages);
      } else {
        console.log("No messages available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching messages: ", error);
    });
}

// Function to display messages in the chat box
function displayMessages(messages) {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) {
    console.error("HTML element with ID 'chat-box' is missing.");
    return;
  }

  console.log("Fetched messages:", messages); // Add this
  chatBox.innerHTML = ""; // Clear the chat box

  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];
      const messageElement = document.createElement("div");
      messageElement.textContent = `${message.username}: ${message.message}`;
      chatBox.appendChild(messageElement);
    });
  } else {
    chatBox.innerHTML = "<div>No messages to display</div>";
  }
}

// Listen for real-time updates (whenever new messages are added)
const messagesRef = ref(database, "chats/");
onValue(messagesRef, (snapshot) => {
  const messages = snapshot.val();
  displayMessages(messages);
});

// Call fetchMessages to load initial messages when the page loads
window.onload = () => {
  fetchMessages(); // Load messages on page load (optional if onValue is enough)
};
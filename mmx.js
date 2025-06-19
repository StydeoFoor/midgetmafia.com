import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);
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
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";
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
// Fetch and display messages using 'get'
function fetchMessages() {
  if (!auth.currentUser) {
  return; // Stops sending message
  } 
  const messagesRef = ref(database, "logs/"); // Reference to your 'chats' node

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
  const chatBox = document.getElementById("logMMX");
  if (!chatBox) {
    console.error("HTML element with ID 'chat-box' is missing.");
    return;
  }

  chatBox.innerHTML = ""; // Clear chat box

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const allowedRoles = ["Leader", "Manager", "Vice Manager", "Developer", "Executive"];
  const canDelete = allowedRoles.includes(loggedInUser?.role);

  // Helper to format date with ordinal (e.g. 18th)
  function getOrdinal(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  function formatDate(date) {
    const options = { month: "long" };
    const monthStr = date.toLocaleDateString(undefined, options);
    const day = date.getDate();
    const ordinal = getOrdinal(day);
    return `${monthStr} ${day}${ordinal}`;
  }

  // Convert messages object into array with keys included
  const messagesArray = Object.entries(messages).map(([key, msg]) => ({
    key,
    ...msg
  }));

  // Sort messages by timestamp ascending
  messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let previousDate = null;

  messagesArray.forEach(msg => {
    const currentDate = new Date(msg.timestamp);
    const currentDateMidnight = new Date(currentDate);
    currentDateMidnight.setHours(0, 0, 0, 0);

    // Insert date divider if day changes
    if (
      !previousDate ||
      previousDate.getTime() !== currentDateMidnight.getTime()
    ) {
      const dateDivider = document.createElement("div");
      dateDivider.textContent = formatDate(currentDateMidnight);
      dateDivider.style.fontSize = "14px";
      dateDivider.style.fontWeight = "bold";
      dateDivider.style.color = "#888";
      dateDivider.style.margin = "20px 0 10px";
      dateDivider.style.borderBottom = "1px solid #ccc";
      dateDivider.style.paddingBottom = "5px";
      chatBox.appendChild(dateDivider);
    }

    previousDate = currentDateMidnight;

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.style.display = "flex";
    messageElement.style.justifyContent = "space-between";
    messageElement.style.alignItems = "center";
    messageElement.style.marginBottom = "8px";

    const messageText = document.createElement("div");
    messageText.innerHTML = `<strong>${msg.number}</strong>: ${msg.text}`;
    messageText.style.flex = "1";
    messageText.style.color = "black";

    const time = currentDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();

    const timeElement = document.createElement("span");
    timeElement.textContent = time;
    timeElement.style.fontSize = "12px";
    timeElement.style.color = "#aaa";
    timeElement.style.marginLeft = "10px";
    timeElement.style.whiteSpace = "nowrap";

    messageElement.appendChild(messageText);
    messageElement.appendChild(timeElement);

    chatBox.appendChild(messageElement);
  });

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Listen for real-time updates (whenever new messages are added)
const messagesRef = ref(database, "logs/");
onValue(messagesRef, (snapshot) => {
  const messages = snapshot.val();
  displayMessages(messages);
});

// Call fetchMessages to load initial messages when the page loads
window.onload = () => {
  fetchMessages(); // Load messages on page load (optional if onValue is enough)
};

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
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
const topbar = document.getElementById("myTopBar");
const sidebar = document.getElementById("msgSidebar");
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
  if (sidebar) sidebar.style.backgroundColor = "#242424";

  localStorage.setItem("theme", "dark");
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";
  if (sidebar) sidebar.style.backgroundColor = "#e8e8e8";

  localStorage.setItem("theme", "light");
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";
  if (sidebar) sidebar.style.backgroundColor = "#003c60";

  localStorage.setItem("theme", "ocean");
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";
  if (sidebar) sidebar.style.backgroundColor = "#b35b47";

  localStorage.setItem("theme", "sunset");
}

function applyChromeTheme() {
  body.style.background = "#303030";
  body.style.color = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);"

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#242424";
  if (sidebar) sidebar.style.backgroundColor = "#242424";

  localStorage.setItem("theme", "chrome");
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white"

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";
  if (sidebar) sidebar.style.backgroundColor = "#000000";

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

async function checkIfLocked() {
  const lockedRef = ref(database, "locked");

  try {
    const snapshot = await get(lockedRef);

    if (snapshot.exists()) {
      const lockedSections = snapshot.val();

      // Check if "Messages" is in the locked sections
      if (lockedSections["courtroom"]) {
        displayLockedUI(); // Display red lock overlay
      } else {
        enableChatUI(); // Enable the chat UI if "Messages" is not locked
      }
    } else {
      console.log("No locked sections found.");
      enableChatUI(); // Default to unlocked if no locked sections exist
    }
  } catch (error) {
    console.error("Error fetching locked sections:", error);
  }
}

// Display locked notification UI
function displayLockedUI() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found.");
    return;
  }

  // Clear the chat container
  chatContainer.innerHTML = "";

  // Create a lock overlay
  const lockOverlay = document.createElement("div");
  lockOverlay.style.position = "absolute";
  lockOverlay.style.top = "0";
  lockOverlay.style.left = "0";
  lockOverlay.style.width = "100%";
  lockOverlay.style.height = "100%";
  lockOverlay.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
  lockOverlay.style.display = "flex";
  lockOverlay.style.justifyContent = "center";
  lockOverlay.style.alignItems = "center";
  lockOverlay.style.zIndex = "1000";

  // Add a lock icon or image
  const lockIcon = document.createElement("i");
  lockIcon.className = "fas fa-lock";
  lockIcon.style.fontSize = "50px";
  lockIcon.style.color = "white";
  lockIcon.style.marginBottom = "20px";

  // Add the h1 element
  const lockMessage = document.createElement("h1");
  lockMessage.textContent = "We are sorry, but the courtroom is locked right now, come back later. :C";
  lockMessage.style.color = "white";
  lockMessage.style.textAlign = "center";

  // Append lock icon and message to the overlay
  lockOverlay.appendChild(lockIcon);
  lockOverlay.appendChild(lockMessage);

  // Append overlay to the chat container
  chatContainer.appendChild(lockOverlay);
}

// Enable chat UI
function enableChatUI() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found.");
    return;
  }

  // Clear any overlays and display the chat UI
  chatContainer.innerHTML = `
    <div id="chat-box" style="height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 10px; padding: 15px;"></div>
    <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px;">
      <input id="message-input" type="text" placeholder="Type a message..." style="flex: 1; padding: 10px; border-radius: 20px;">
      <button id="send-button" style="padding: 10px; border-radius: 20px; background-color: #007bff; color: white;">Send</button>
    </div>
  `;
}

// Call the function to check if the section is locked
checkIfLocked();

// Send message function using 'set'
const _0x3687fb=_0x231c;function _0x231c(_0x1e290b,_0xe2c6b7){const _0x5221b3=_0x5221();return _0x231c=function(_0x231c66,_0x849340){_0x231c66=_0x231c66-0x193;let _0x4d4710=_0x5221b3[_0x231c66];return _0x4d4710;},_0x231c(_0x1e290b,_0xe2c6b7);}function _0x5221(){const _0xe65f3b=['794374qtYgJS','nigga','737188jPWJjL','fuck','63JfCkah','whore','1888740IwsoKj','nigger','shit','1104966WewThB','2280090phTBWb','slave','327768XYEnwq','189904qvTQsg'];_0x5221=function(){return _0xe65f3b;};return _0x5221();}(function(_0x103f19,_0x68ad56){const _0x25ec7f=_0x231c,_0x24c092=_0x103f19();while(!![]){try{const _0xd6941e=-parseInt(_0x25ec7f(0x198))/0x1+parseInt(_0x25ec7f(0x199))/0x2+-parseInt(_0x25ec7f(0x194))/0x3+parseInt(_0x25ec7f(0x19b))/0x4+-parseInt(_0x25ec7f(0x195))/0x5+parseInt(_0x25ec7f(0x19f))/0x6+-parseInt(_0x25ec7f(0x19d))/0x7*(-parseInt(_0x25ec7f(0x197))/0x8);if(_0xd6941e===_0x68ad56)break;else _0x24c092['push'](_0x24c092['shift']());}catch(_0x4065cb){_0x24c092['push'](_0x24c092['shift']());}}}(_0x5221,0x3d391));const bannedWords=[_0x3687fb(0x19c),_0x3687fb(0x19a),_0x3687fb(0x1a0),'ass',_0x3687fb(0x193),_0x3687fb(0x196),'hoe','slut','cunt',_0x3687fb(0x19e)];

function containsBannedWords(message) {
  // Check if the message contains any banned words (case-insensitive)
  const regex = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "i");
  return regex.test(message);
}

function sendMessage(message) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    console.log("User is not logged in");
    return;
  }

  // Validate the message length
  if (message.trim().length > 500) {
    alert("Message exceeds the 500-character limit. Please shorten your message.");
    return;
  }

  // Check for banned words
  if (containsBannedWords(message)) {
    alert("Your message was moderated and not sent.");
    return;
  }

  // Get reference to 'chats' node in Firebase
  const messageRef = ref(database, "court/" + Date.now()); // Timestamp as unique ID for each message

  // Set the message data in Firebase
  set(messageRef, {
    username: loggedInUser.name,
    message: message.trim(),
    timestamp: Date.now(),
  })
    .then(() => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}

// Fetch and display messages using 'get'
function fetchMessages() {
  const messagesRef = ref(database, "court/"); // Reference to your 'chats' node

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

  chatBox.innerHTML = ""; // Clear the chat box

  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];

      // Create a container for each message
      const messageElement = document.createElement("div");
      messageElement.textContent = `${message.username}: ${message.message}`;
      
      // Apply styles for spacing
      messageElement.style.margin = "10px 0"; // Add vertical spacing between messages // Optional border for clarity

      chatBox.appendChild(messageElement);
    });
  } else {
    chatBox.innerHTML = "<div>No messages to display</div>";
  }
}

// Listen for real-time updates (whenever new messages are added)
const messagesRef = ref(database, "court/");
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

// Handle send button click
sendButton.addEventListener("click", async () => {
  await handleUserInput(); // Call shared function for input handling
});

// Enter key listener
messageInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default newline behavior
    await handleUserInput(); // Call shared function for input handling
  }
});

// Shared function to handle user input
async function handleUserInput() {
  const inputField = messageInput; // Reuse the constant here
  const userMessage = inputField.value.trim(); // Fetch the input value

  console.log("User message length:", userMessage.length);

  if (!userMessage) {
    console.log("No message entered.");
    return;
  }

  if (userMessage.length > 500) {
    alert("Message exceeds 500 characters!");
    return;
  }

  // Send user message
  sendMessage(userMessage);
  inputField.value = ""; // Clear the input field after sending

  // Increment user message count
}

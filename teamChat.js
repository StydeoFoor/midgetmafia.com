import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
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
const sidebar = document.getElementById("msgSidebar");
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

let currentChatId = null;
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Validate logged-in user and extract name
if (!loggedInUser || !loggedInUser.name) {
  alert("User not logged in. Please log in first.");
  throw new Error("User not logged in.");
}
loggedInUser = loggedInUser.name; // Extract the name string

// Populate DM List
async function fetchUserDMs() {
  try {
    const dmsRef = ref(database, "team_chats");
    const snapshot = await get(dmsRef);

    if (!snapshot.exists()) {
      console.log("No DMs available.");
      return;
    }

    const allDMs = snapshot.val();
    const userDMs = Object.entries(allDMs).filter(([chatId, chatData]) =>
      chatData.metadata.users.includes(loggedInUser.role)
    );

    const dmList = document.getElementById("dm-list");
    dmList.innerHTML = "";

    userDMs.forEach(([chatId, chatData]) => {
      const lastMessage = chatData.metadata.lastMessage;
      const otherUser = chatData.metadata.users.find(user => user !== loggedInUser);

      const dmElement = document.createElement("div");
      dmElement.textContent = `${otherUser}`;
      dmElement.style.margin = "10px 0";
      dmElement.style.cursor = "pointer";
      dmElement.addEventListener("click", () => switchChat(chatId, otherUser));

      dmList.appendChild(dmElement);
    });
  } catch (error) {
    console.error("Error fetching DMs:", error);
  }
}

// Switch Chat
function switchChat(chatId, otherUser) {
  currentChatId = chatId;

  const chatHeader = document.getElementById("chat-header");
  chatHeader.textContent = `${otherUser}`;

  displayDM(chatId);
}

// Display Messages
function displayDM(chatId) {
  const messagesRef = ref(database, `dm_chats/${chatId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    if (!messages) {
      chatBox.innerHTML = "<div>No messages to display.</div>";
      return;
    }

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

    // Convert messages object into array, include keys if needed
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

      // Add date divider when day changes
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
      messageText.innerHTML = `<strong>${msg.sender}</strong>: ${msg.message}`;
      messageText.style.flex = "1";

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

    // Scroll to bottom after messages load
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
// Send Message
async function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (!currentChatId) {
    alert("No conversation selected. Please select or start a conversation first.");
    return;
  }

  if (!message) {
    alert("Cannot send an empty message.");
    return;
  }

  console.log("Current Chat ID:", currentChatId);

  try {
    // Sanitize the chat ID
    const sanitizedChatId = currentChatId.replace(/[.#$/[\]]/g, "_");
    console.log("Sanitized Chat ID:", sanitizedChatId);

    // Construct the Firebase path
    const chatMessagesPath = `dm_chats/${sanitizedChatId}/messages/${Date.now()}`;
    console.log("Chat Messages Path:", chatMessagesPath);

    // Set the message in Firebase
    await set(ref(database, chatMessagesPath), {
      sender: loggedInUser,
      message,
      timestamp: Date.now(),
    });

    messageInput.value = ""; // Clear input field
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  }
}
// Start New DM
async function startNewDM() {
  const recipient = prompt("Enter the name to start a new DM:");
  if (!recipient || recipient.trim() === "" || recipient === loggedInUser) {
    alert("Invalid recipient.");
    return;
  }

  const chatId = [loggedInUser, recipient].sort().join("-");
  const chatRef = ref(database, `dm_chats/${chatId}`);

  try {
    const chatSnapshot = await get(chatRef);

    if (!chatSnapshot.exists()) {
      await set(chatRef, {
        metadata: {
          users: [loggedInUser, recipient],
          lastMessage: {
            message: "Start of conversation.",
            sender: loggedInUser,
            timestamp: Date.now(),
          },
        },
      });

      console.log("Chat created successfully!");
    }

    fetchUserDMs(); // Refresh DM list
    switchChat(chatId, recipient); // Open the new chat
  } catch (error) {
    console.error("Error creating or switching to chat:", error);
    alert("An error occurred. Please try again.");
  }
}

async function blockUser() {
  alert("Sorry, but this feature isn't here yet, try again later")
}

// Event Listeners
document.getElementById("send-dm-button").addEventListener("click", sendMessage);
document.getElementById("start-new-dm").addEventListener("click", startNewDM);
document.getElementById("block-user").addEventListener("click", blockUser);

// On Load
window.onload = fetchUserDMs;

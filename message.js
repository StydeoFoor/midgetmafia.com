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
  signOut,
  onAuthStateChanged
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
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
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

function checkUser() {
  if (!loggedInUser) {
    alert("You are not logged in");
    window.location.href = "index.html";
    return;
  }
}

checkUser();

async function checkIfMuted() {
  const mutedRef = ref(database, "muted");

  try {
    const snapshot = await get(mutedRef);

    if (snapshot.exists()) {
      const mutedList = snapshot.val();

      // Check if logged-in user is in the muted list
      if (mutedList[loggedInUser.name]) {
        displayMutedUI(); // User is muted
      } else {
        console.log("User isn't muted") // User is not muted
      }
    } else {
      console.log("No muted list found."); 
    }
  } catch (error) {
    console.error("Error fetching muted list:", error);
  }
}

// Display muted notification UI
function displayMutedUI() {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = ""; // Clear the chat container

  const mutedBar = document.createElement("div");
  mutedBar.style.backgroundColor = "black";
  mutedBar.style.color = "white";
  mutedBar.style.padding = "15px";
  mutedBar.style.textAlign = "center";
  mutedBar.style.borderRadius = "10px";
  mutedBar.style.marginTop = "15px";
  mutedBar.style.display = "flex";
  mutedBar.style.justifyContent = "center";
  mutedBar.style.alignItems = "center";
  mutedBar.style.gap = "10px";

  const mutedIcon = document.createElement("span");
  mutedIcon.style.color = "red";
  mutedIcon.innerHTML = `<i class="fas fa-microphone-slash" style="font-size: 20px;"></i>`;

  const mutedText = document.createElement("span");
  mutedText.textContent = "You are currently muted. You cannot chat in public chatrooms.";

  mutedBar.appendChild(mutedIcon);
  mutedBar.appendChild(mutedText);
  chatContainer.appendChild(mutedBar);
}

// Enable chat UI

// Send message function using 'set'
const _0x3687fb=_0x231c;function _0x231c(_0x1e290b,_0xe2c6b7){const _0x5221b3=_0x5221();return _0x231c=function(_0x231c66,_0x849340){_0x231c66=_0x231c66-0x193;let _0x4d4710=_0x5221b3[_0x231c66];return _0x4d4710;},_0x231c(_0x1e290b,_0xe2c6b7);}function _0x5221(){const _0xe65f3b=['794374qtYgJS','nigga','737188jPWJjL','fuck','63JfCkah','whore','1888740IwsoKj','nigger','shit','1104966WewThB','2280090phTBWb','slave','327768XYEnwq','189904qvTQsg'];_0x5221=function(){return _0xe65f3b;};return _0x5221();}(function(_0x103f19,_0x68ad56){const _0x25ec7f=_0x231c,_0x24c092=_0x103f19();while(!![]){try{const _0xd6941e=-parseInt(_0x25ec7f(0x198))/0x1+parseInt(_0x25ec7f(0x199))/0x2+-parseInt(_0x25ec7f(0x194))/0x3+parseInt(_0x25ec7f(0x19b))/0x4+-parseInt(_0x25ec7f(0x195))/0x5+parseInt(_0x25ec7f(0x19f))/0x6+-parseInt(_0x25ec7f(0x19d))/0x7*(-parseInt(_0x25ec7f(0x197))/0x8);if(_0xd6941e===_0x68ad56)break;else _0x24c092['push'](_0x24c092['shift']());}catch(_0x4065cb){_0x24c092['push'](_0x24c092['shift']());}}}(_0x5221,0x3d391));const bannedWords=[_0x3687fb(0x19c),_0x3687fb(0x19a),_0x3687fb(0x1a0),'ass',_0x3687fb(0x193),_0x3687fb(0x196),'hoe','slut','cunt',_0x3687fb(0x19e)];

function containsBannedWords(message) {
  // Check if the message contains any banned words (case-insensitive)
  const regex = new RegExp(`\\b(${bannedWords.join("|")})\\b`, "i");
  return regex.test(message);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
    fetchMessages(); // NOW it's safe to call it
  } else {
    console.log("No user, signing in...");
    signInAnonymously(auth)
      .then((result) => {
        console.log("Signed in as:", result.user.uid);
        fetchMessages(); // Also safe here
      })
      .catch((error) => {
        console.error("Sign-in failed:", error);
      });
  }
});

async function sendMessage(message) {
  if (!auth.currentUser) {
    alert("User not authenticated, go to login and re-login");
    return; // Stops sending message
  } 

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userRef = ref(database, `users/${loggedInUser}`);
  const snapshot = await get(userRef);
  const user = snapshot.val();
  const name = user.name;
  if (!loggedInUser) {
    console.log("User is not logged in");
    return;
  }

  // Check if user is muted
  const mutedRef = ref(database, "muted/" + name);

  get(mutedRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        alert("You are muted and cannot send messages.");
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

      // Send the message if not muted
      const messageRef = ref(database, "chats/" + Date.now());

      set(messageRef, {
        username: name,
        message: message.trim(),
        timestamp: Date.now(),
      })
        .then(() => {
          console.log("Message sent successfully");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    })
    .catch((error) => {
      console.error("Error checking mute status:", error);
    });
}

// Fetch and display messages using 'get'
function fetchMessages() {
  if (!auth.currentUser) {
    return; // Stops sending message
  } 
  const messagesRef = ref(database, "chats/"); // Reference to your 'chats' node

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
    messageText.innerHTML = `<strong>${msg.username}</strong>: ${msg.message}`;
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

    if (canDelete) {
      const deleteButton = document.createElement("button");
      deleteButton.style.marginLeft = "10px";
      deleteButton.style.padding = "5px";
      deleteButton.style.backgroundColor = "transparent";
      deleteButton.style.border = "none";
      deleteButton.style.cursor = "pointer";
      deleteButton.innerHTML = `<i class="fas fa-trash-alt" style="color: red; font-size: 16px;"></i>`;
      deleteButton.onclick = () => deleteMessage(msg.key);

      messageElement.appendChild(deleteButton);
    }

    chatBox.appendChild(messageElement);
  });

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function deleteMessage(messageId) {
  if (!messageId) {
    console.error("Invalid message ID provided.");
    return;
  }

  try {
    const messageRef = ref(database, `chats/${messageId}`);
    await set(messageRef, null); // Remove the message from Firebase

    alert("Message deleted successfully.");
    console.log(`Message ${messageId} deleted.`);
  } catch (error) {
    console.error("Error deleting message:", error);
    alert("An error occurred while deleting the message.");
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
  checkIfMuted(); // Check mute status
  fetchMessages(); // Fetch initial messages
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
}



import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Current Chat Variables
let currentChatId = null; // Tracks the active chat
let loggedInUser = "currentUser"; // Replace with actual logged-in user
let availableUsers = ["user1", "user2", "user3"]; // Replace with dynamic fetching

// Display the list of DMs
async function fetchUserDMs() {
  const dmsRef = ref(database, `dm_chats`);
  const snapshot = await get(dmsRef);

  if (!snapshot.exists()) {
    console.log("No DMs available.");
    return;
  }

  const allDMs = snapshot.val();
  const userDMs = Object.entries(allDMs).filter(([chatId, chatData]) =>
    chatData.metadata.users.includes(loggedInUser),
  );

  const dmList = document.getElementById("dm-list");
  dmList.innerHTML = "";

  userDMs.forEach(([chatId, chatData]) => {
    const dmElement = document.createElement("div");
    const lastMessage = chatData.metadata.lastMessage;
    const otherUser = chatData.metadata.users.find(
      (user) => user !== loggedInUser,
    );

    dmElement.textContent = `Chat with ${otherUser}: ${lastMessage.message}`;
    dmElement.addEventListener("click", () => switchChat(chatId, otherUser));

    dmList.appendChild(dmElement);
  });
}

// Switch Chat
function switchChat(chatId, otherUser) {
  currentChatId = chatId;

  const chatTitle = document.getElementById("chat-title");
  chatTitle.textContent = `Chat with ${otherUser}`;

  displayDM(chatId);
}

// Display Messages for Current Chat
function displayDM(chatId) {
  const messagesRef = ref(database, `dm_chats/${chatId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    const chatBox = document.getElementById("dm-chat-box");
    chatBox.innerHTML = "";

    if (messages) {
      Object.values(messages).forEach((messageData) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
        messageElement.style.margin = "10px 0";
        chatBox.appendChild(messageElement);
      });
    } else {
      chatBox.innerHTML = "<div>No messages to display.</div>";
    }
  });
}

// Handle Sending Messages
async function sendMessageToDM(message) {
  if (!currentChatId) {
    alert("Please select a conversation first.");
    return;
  }

  const chatMessagesRef = ref(database, `dm_chats/${currentChatId}/messages`);
  const messageId = Date.now();

  await set(ref(chatMessagesRef, messageId), {
    sender: loggedInUser,
    message,
    timestamp: messageId,
  });
}

// Start a New DM
async function startNewDM() {
  const recipient = prompt("Enter the username to start a new DM:");
  if (!recipient || recipient === loggedInUser) {
    alert("Invalid recipient.");
    return;
  }

  const chatId = [loggedInUser, recipient].sort().join("-");
  const chatRef = ref(database, `dm_chats/${chatId}`);

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
  }

  fetchUserDMs(); // Refresh the DM list
  switchChat(chatId, recipient); // Open the new chat
}

// Event Listeners
document.getElementById("send-dm-button").addEventListener("click", () => {
  const messageInput = document.getElementById("dm-message-input");
  const message = messageInput.value.trim();

  if (message) {
    sendMessageToDM(message);
    messageInput.value = ""; // Clear the input
  }
});

document.getElementById("start-new-dm").addEventListener("click", startNewDM);

// On page load, fetch and display user's DMs
window.onload = fetchUserDMs;

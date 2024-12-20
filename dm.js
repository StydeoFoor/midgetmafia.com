import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
    const dmsRef = ref(database, "dm_chats");
    const snapshot = await get(dmsRef);

    if (!snapshot.exists()) {
      console.log("No DMs available.");
      return;
    }

    const allDMs = snapshot.val();
    const userDMs = Object.entries(allDMs).filter(([chatId, chatData]) =>
      chatData.metadata.users.includes(loggedInUser)
    );

    const dmList = document.getElementById("dm-list");
    dmList.innerHTML = "";

    userDMs.forEach(([chatId, chatData]) => {
      const lastMessage = chatData.metadata.lastMessage;
      const otherUser = chatData.metadata.users.find(user => user !== loggedInUser);

      const dmElement = document.createElement("div");
      dmElement.textContent = `Chat with ${otherUser}: ${lastMessage.message}`;
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
  chatHeader.textContent = `Chat with ${otherUser}`;

  displayDM(chatId);
}

// Display Messages
function displayDM(chatId) {
  const messagesRef = ref(database, `dm_chats/${chatId}/messages`);

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    const chatBox = document.getElementById("chat-box");
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
    // Sanitize chat ID
    const sanitizedChatId = currentChatId.replace(/[.#$/[\]]/g, "_");
    console.log("Sanitized Path:", `dm_chats/${sanitizedChatId}/messages`);

    // Reference to chat messages
    const chatMessagesRef = ref(database, `dm_chats/${sanitizedChatId}/messages`);
    const messageId = Date.now();

    // Set message in Firebase
    await set(ref(chatMessagesRef, messageId), {
      sender: loggedInUser,
      message,
      timestamp: messageId,
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

// Event Listeners
document.getElementById("send-dm-button").addEventListener("click", sendMessage);
document.getElementById("start-new-dm").addEventListener("click", startNewDM);

// On Load
window.onload = fetchUserDMs;

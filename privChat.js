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

function checkUser() {

  const allowedRoles = [
    "Owner",
    "Vice Manager",
    "Developer",
    "Manager",
    "Vice Owner",
    "TrustedInstaller",
  ];

  if (!loggedInUser) {
    alert("You are not logged in");
    window.location.href = "index.html";
    return;
  }

  if (loggedInUser.role !== allowedRoles) {
    alert("You are not allowed here.");
    window.location.href = "index.html";
    return;
  }
}

checkUser();

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
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Track last known message timestamps for notifications
let lastBodyChatsTimestamp = null;
let lastAdminChatsTimestamp = null;

// Create a notification box dynamically
const notificationBox = document.createElement("div");
notificationBox.style.position = "fixed";
notificationBox.style.top = "10px";
notificationBox.style.left = "50%";
notificationBox.style.transform = "translateX(-50%)";
notificationBox.style.backgroundColor = "#2c2f33";
notificationBox.style.color = "white";
notificationBox.style.padding = "10px 20px";
notificationBox.style.borderRadius = "20px";
notificationBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
notificationBox.style.display = "none";
notificationBox.style.zIndex = "9999";
notificationBox.style.fontFamily = "Arial, sans-serif";
notificationBox.style.fontSize = "16px";
document.body.appendChild(notificationBox);

// Show the notification
function showNotification(chatroom, user) {
  notificationBox.textContent = `${chatroom} - ${user}`;
  notificationBox.style.display = "block";

  // Hide the notification after 5 seconds
  setTimeout(() => {
    notificationBox.style.display = "none";
  }, 5000);
}

// Listen for changes in bodyChats
function listenForBodyChats() {
  const bodyChatsRef = ref(database, "bodyChats");

  onValue(bodyChatsRef, (snapshot) => {
    const messages = snapshot.val();

    if (messages) {
      const timestamps = Object.values(messages).map(msg => msg.timestamp || 0);
      const latestTimestamp = Math.max(...timestamps);

      // Check if there's a new message
      if (!lastBodyChatsTimestamp || latestTimestamp > lastBodyChatsTimestamp) {
        lastBodyChatsTimestamp = latestTimestamp;

        // Get the latest message details
        const latestMessage = Object.values(messages).find(msg => msg.timestamp === latestTimestamp);
        if (latestMessage) {
          showNotification("BodyChats", latestMessage.sender);
        }
      }
    }
  });
}

// Listen for changes in adminChats
function listenForAdminChats() {
  const adminChatsRef = ref(database, "adminChats");

  onValue(adminChatsRef, (snapshot) => {
    const messages = snapshot.val();

    if (messages) {
      const timestamps = Object.values(messages).map(msg => msg.timestamp || 0);
      const latestTimestamp = Math.max(...timestamps);

      // Check if there's a new message
      if (!lastAdminChatsTimestamp || latestTimestamp > lastAdminChatsTimestamp) {
        lastAdminChatsTimestamp = latestTimestamp;

        // Get the latest message details
        const latestMessage = Object.values(messages).find(msg => msg.timestamp === latestTimestamp);
        if (latestMessage) {
          showNotification("AdminChats", latestMessage.sender);
        }
      }
    }
  });
}

// Start listening for changes
listenForBodyChats();
listenForAdminChats();

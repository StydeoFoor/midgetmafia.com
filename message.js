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

// Send message function using 'set'
const bannedWords = ["fuck", "nigga", "nigger", "ass", "shit"]; // Replace with your words

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
  const messageRef = ref(database, "chats/" + Date.now()); // Timestamp as unique ID for each message

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

  chatBox.innerHTML = ""; // Clear the chat box

  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];

      // Create a container for each message
      const messageElement = document.createElement("div");
      messageElement.textContent = `${message.username}: ${message.message}`;
      
      // Apply styles for spacing
      messageElement.style.margin = "10px 0"; // Add vertical spacing between messages
      messageElement.style.borderTop = "1px solid #ccc"; // Optional border for clarity

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

// Get references for input and send button
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Add event listener for Send button

const COHERE_API_KEY = "peALrg2ivFtYudJwPeUAY9mMY8PVuNbnFbJiuzKZ";
let userMessageCount = 0; // Track user messages to decide when the bot should respond

async function getBotResponse(userInput) {
  try {
    const response = await fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-xlarge",
        prompt: `You are a friendly and casual chatbot for a website. Respond simply and engagingly.\nUser: ${userInput}\nChatbot:`,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("API response:", data); // Debug log
    return data.generations[0]?.text?.trim() || "Hmm, I couldn't understand that!";
  } catch (error) {
    console.error("Error getting response from Cohere API:", error);
    return "Sorry, there was an issue with the chatbot.";
  }
}

// Handle send button click
sendButton.addEventListener("click", async () => {
  const inputField = document.getElementById("message-input");
  const messageInput = inputField.value.trim();

  console.log("Message length:", messageInput.length);

  // Check for message length
  if (messageInput.length > 500) {
    alert("Message exceeds 500 characters!");
    return;
  }

  // If no input, log and exit
  if (!messageInput) {
    console.log("No input provided");
    return;
  }

  // Send user message
  sendMessage(messageInput);
  inputField.value = ""; // Clear the input field after sending
  userMessageCount++;

  // Chatbot responds every three messages
  if (userMessageCount % 3 === 0) {
    const chatBox = document.getElementById("chat-box");

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.textContent = "Titan is typing...";
    typingIndicator.style.color = "gray";
    chatBox.appendChild(typingIndicator);

    // Fetch bot response
    const botResponse = await getBotResponse(messageInput);

    // Remove typing indicator
    chatBox.removeChild(typingIndicator);

    // Append bot response
    const botMessageElement = document.createElement("div");
    botMessageElement.innerHTML = `<strong style="color: darkred;">Titan:</strong> <span style="color: darkred;">${botResponse}</span>`;
    botMessageElement.style.margin = "10px 0";
    botMessageElement.style.borderTop = "1px solid #ccc";

    chatBox.appendChild(botMessageElement);
  }
});
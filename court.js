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

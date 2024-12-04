import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push, // Import the push function to create new child nodes
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
function sendMessage(request) {
  const requestsRef = ref(database, "requests/"); // Reference to your 'requests' node in Firebase
  const newRequestRef = push(requestsRef); // Create a new child node
  set(newRequestRef, request) // Save the request object (name and description)
    .then(() => {
      console.log("Request submitted successfully:", request);
    })
    .catch((error) => {
      console.error("Error submitting request:", error);
    });
}

// Get references for input and send button
const descriptionInput = document.getElementById("requestDescription");
const nameInput = document.getElementById("requestName");
const sendButton = document.getElementById("submit");

// Add event listener for Send button
sendButton.addEventListener("click", function () {
  const name = nameInput.value.trim(); // Get the name input value
  const description = descriptionInput.value.trim(); // Get the description input value

  if (name && description) {
    // Ensure both fields are filled
    sendMessage({ name, description }); // Send both name and description to Firebase
    nameInput.value = ""; // Clear the name input after sending
    descriptionInput.value = ""; // Clear the description input after sending
  } else {
    alert("Please fill out both the name and description fields.");
  }
});

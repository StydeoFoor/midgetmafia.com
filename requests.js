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
// Function to fetch messages once from Firebase
function fetchMessages() {
  const messagesRef = ref(database, "requests/"); // Reference to your 'requests' node

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

// Function to display requests in the list
function displayMessages(messages) {
  const requestList = document.getElementById("requestsList");
  if (!requestList) {
    console.error("HTML element with ID 'requestsList' is missing.");
    return;
  }

  requestList.innerHTML = ""; // Clear the list

  if (messages) {
    Object.keys(messages).forEach((key) => {
      const message = messages[key];

      // Create a list item for each request
      const listItem = document.createElement("li");
      listItem.style.marginBottom = "15px"; // Add spacing between items
      listItem.style.padding = "10px";
      listItem.style.borderRadius = "8px";
      listItem.style.listStyleType = "none";
      listItem.id = "listContainer";

      // Name
      const nameElement = document.createElement("p");
      nameElement.textContent = `Name: ${message.name}`;
      nameElement.style.marginBottom = "5px";

      // Description
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = `Description: ${message.description}`;

      // Append elements to the list item
      listItem.appendChild(nameElement);
      listItem.appendChild(descriptionElement);

      // Append the list item to the request list
      requestList.appendChild(listItem);
    });
  } else {
    requestList.innerHTML = "<li>No requests to display</li>";
  }
}

// Listen for real-time updates (whenever new requests are added)
const messagesRef = ref(database, "requests/");
onValue(messagesRef, (snapshot) => {
  const messages = snapshot.val();
  displayMessages(messages);
});

// Call fetchMessages to load initial messages when the page loads
window.onload = () => {
  fetchMessages(); // Load messages on page load (optional if onValue is enough)
};

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
// Define allowed names
const allowedNames = [
  "Shawn Rabb",
  "Mason Leibenguth"
];
 // Replace with the actual request element selector

// Function to create and append the Accept button
function showAcceptButton() {
  const requestContainer = document.querySelector("#requestContainer"); // Find the container inside the function

  if (!requestContainer) {
    console.error("HTML element with ID 'requestContainer' is missing.");
    return; // Exit if the container is not found
  }

  if (allowedNames.includes(loggedInUser?.name)) {
    const acceptButton = document.createElement("button");
    acceptButton.innerText = "Accept";
    acceptButton.style.marginLeft = "10px"; // Add some spacing
    acceptButton.style.padding = "5px 10px";
    acceptButton.style.backgroundColor = "#4CAF50"; // Green background
    acceptButton.style.color = "#fff";
    acceptButton.style.border = "none";
    acceptButton.style.cursor = "pointer";

    // Add functionality to the Accept button
    acceptButton.addEventListener("click", () => {
      alert("Request Accepted!"); // Replace with your accept logic
    });

    // Append the button to the request container
    requestContainer.appendChild(acceptButton);
  } else {
    console.log("User not allowed to see the Accept button.");
  }
}

// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  showAcceptButton();
});


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
  onAuthStateChanged,
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
const topbar = document.getElementById("myTopBar");
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
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";
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

// Send message function using 'set'
function sendYesVote() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    console.log("User is not logged in");
    return;
  }

  const userVoteRef = ref(database, `flagVotes/${loggedInUser}`);

  get(userVoteRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.warn("User has already voted.");
      alert("You've already voted!");
      return;
    }

    // User hasn't voted yet, proceed to vote
    set(userVoteRef, {
      vote: "yes",
      name: loggedInUser,
      timestamp: Date.now()
    })
    .then(() => {
      console.log("Voted successfully");
    })
    .catch((error) => {
      console.error("Error sending vote:", error);
    });
  });
}

function sendNoVote() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    console.log("User is not logged in");
    return;
  }

  const userVoteRef = ref(database, `flagVotes/${loggedInUser}`);

  get(userVoteRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.warn("User has already voted.");
      alert("You've already voted!");
      return;
    }

    // User hasn't voted yet, proceed to vote
    set(userVoteRef, {
      vote: "no",
      name: loggedInUser,
      timestamp: Date.now()
    })
    .then(() => {
      console.log("Voted successfully");
    })
    .catch((error) => {
      console.error("Error sending vote:", error);
    });
  });
}


// Fetch and display messages using 'get'
function fetchVotes() {
  const messagesRef = ref(database, "flagVotes/"); // Reference to your 'chats' node

  // Fetch messages once from Firebase
    get(messagesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const votes = snapshot.val();
        displayVotes(votes);
      } else {
        console.log("No messages available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching messages: ", error);
    });
}

// Function to display messages in the chat box
function displayVotes(votes) {
  const yesVotes = document.getElementById("yesVotes");
  const noVotes = document.getElementById("noVotes");

  let yesCount = 0;
  let noCount = 0;

  for (const voter in votes) {
    const vote = votes[voter].vote;
    if (vote === "yes") yesCount++;
    if (vote === "no") noCount++;
  }

  if (yesVotes) yesVotes.textContent = `Replace the Flag: ${yesCount}`;
  if (noVotes) noVotes.textContent = `Keep the Old Flag: ${noCount}`;
}

// Listen for real-time updates (whenever new messages are added)
const messagesRef = ref(database, "flagVotes/");
onValue(messagesRef, (snapshot) => {
  const votes = snapshot.val();
  displayVotes(votes);
});

// Call fetchMessages to load initial messages when the page loads
window.onload = () => {
  fetchVotes(); // Load messages on page load (optional if onValue is enough)
};

// Get references for input and send button
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");

// Add event listener for Send button
yesButton.addEventListener("click", function () {
    sendYesVote(); // Send message to Firebase
  }
);
noButton.addEventListener("click", function () {
    sendNoVote(); // Send message to Firebase
  }
);

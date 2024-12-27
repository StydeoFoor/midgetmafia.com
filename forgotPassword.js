import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Handle Password Reset Form Submission
document.getElementById("password-reset-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect user input
  const username = document.getElementById("username").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const role = document.getElementById("role").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  // Validate input
  if (!username || !ownerName || !role || !newPassword) {
    alert("All fields are required.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    // Reference the user node by username
    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      alert("No account found with the provided username.");
      return;
    }

    const userData = snapshot.val();

    // Validate owner name and role
    if (userData.name !== ownerName || userData.role !== role) {
      alert("The details provided do not match our records.");
      return;
    }

    // Update the password
    await set(userRef, {
      ...userData, // Retain existing data
      password: newPassword, // Update the password
    });

    alert("Password has been reset successfully.");
    // Optionally redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("An error occurred while resetting the password. Please try again.");
  }
});

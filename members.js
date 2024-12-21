import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Fetch all user names from the "users" node
async function fetchAllUsers() {
    const usersRef = ref(database, "users");
  
    try {
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        const users = snapshot.val();
  
        // Validate each user object
        const validatedUsers = Object.entries(users).reduce((acc, [userId, userData]) => {
          if (userData?.name && userData?.role) {
            acc[userId] = userData; // Only include valid users
          } else {
            console.warn(`Skipping invalid user:`, userId, userData);
          }
          return acc;
        }, {});
  
        console.log("Validated Users:", validatedUsers);
        displayUserList(validatedUsers); // Display the validated user list
      } else {
        console.log("No users found.");
        displayUserList({});
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      displayUserList({});
    }
  }
  
  function displayUserList(users) {
    const userListContainer = document.getElementById("user-list");
  
    if (!userListContainer) {
      console.error("HTML element with ID 'user-list' is missing.");
      return;
    }
  
    userListContainer.innerHTML = ""; // Clear the user list
  
    if (Object.keys(users).length === 0) {
      userListContainer.textContent = "No users found.";
      return;
    }
  
    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";
    ul.style.padding = "0";
  
    Object.entries(users).forEach(([userId, userData]) => {
      const li = document.createElement("li");
      li.style.padding = "10px 0";
      li.style.fontFamily = "Arial, sans-serif";
      li.style.color = "#333";
  
      const name = userData.name || "Unknown User";
      const role = userData.role || "No Role";

      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Get the current logged-in user
  const allowedToChangeRoles = loggedInUser?.name === "Specific Name";
  
      // Add user details
      const userText = document.createElement("span");
      userText.textContent = `${name} - ${role}`;
      li.appendChild(userText);

      if (allowedToChangeRoles) {
        const roleButton = document.createElement("button");
        roleButton.textContent = "Change Role";
        roleButton.style.marginLeft = "10px";
        roleButton.style.padding = "5px 10px";
        roleButton.style.backgroundColor = "#007bff";
        roleButton.style.color = "white";
        roleButton.style.border = "none";
        roleButton.style.borderRadius = "5px";
        roleButton.style.cursor = "pointer";
  
        // Hook the `showRolePopup` function
        roleButton.onclick = () => showRolePopup(userId, name);
  
        li.appendChild(roleButton);
      }
  
      // Add Mute button
      const muteButton = document.createElement("button");
      muteButton.textContent = "Mute";
      muteButton.style.marginLeft = "10px";
      muteButton.style.padding = "5px 10px";
      muteButton.style.backgroundColor = "#ff4d4d";
      muteButton.style.color = "white";
      muteButton.style.border = "none";
      muteButton.style.borderRadius = "5px";
      muteButton.style.cursor = "pointer";
  
      muteButton.onclick = () => muteUser(name); // Hook `muteUser`
  
      li.appendChild(muteButton);
      ul.appendChild(li);
    });
  
    userListContainer.appendChild(ul);
  }

  async function muteUser(userName) {
    if (!userName) {
      console.error("Invalid user name provided.");
      return;
    }
  
    try {
      const mutedRef = ref(database, `muted/${userName}`);
      await set(mutedRef, true); // Set the user as muted
  
      alert(`${userName} has been muted.`);
      console.log(`${userName} added to muted list.`);
    } catch (error) {
      console.error("Error muting user:", error);
      alert("An error occurred while muting the user.");
    }
  }

  function showRolePopup(userName) {
    // Create popup elements
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #ccc";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "1000";
  
    const title = document.createElement("h3");
    title.textContent = `Change Role for ${userName}`;
    title.style.marginBottom = "15px";
  
    const select = document.createElement("select");
    select.style.width = "100%";
    select.style.padding = "10px";
    select.style.marginBottom = "15px";
    select.innerHTML = `
      <option value="Owner">Owner</option>
      <option value="Manager">Manager</option>
      <option value="Vice Manager">Vice Manager</option>
      <option value="SPY!!!">Spy</option>
      <option value="Mighty Midget">Mighty Midget</option>
      <option value="Developer">Developer</option>
      <option value="Bodyguard">Bodyguard</option>
      <option value="Member">Member</option>
    `;
  
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.marginRight = "10px";
    saveButton.style.padding = "10px 15px";
    saveButton.style.backgroundColor = "#28a745";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    saveButton.onclick = () => updateUserRole(userName, select.value, popup);
  
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.padding = "10px 15px";
    cancelButton.style.backgroundColor = "#dc3545";
    cancelButton.style.color = "white";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "5px";
    cancelButton.style.cursor = "pointer";
    cancelButton.onclick = () => document.body.removeChild(popup);
  
    popup.appendChild(title);
    popup.appendChild(select);
    popup.appendChild(saveButton);
    popup.appendChild(cancelButton);
  
    document.body.appendChild(popup);
  }

  async function updateUserRole(userId, newRole, popup) {
    try {
      const userRef = ref(database, `users/${userId}/role`);
      await set(userRef, newRole); // Update the user's role
  
      alert(`Role updated to ${newRole}`);
      console.log(`User role updated: ${userId} -> ${newRole}`);
  
      document.body.removeChild(popup); // Close the popup
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("An error occurred while updating the role.");
    }
  }

// On page load, fetch and display the user list
window.onload = fetchAllUsers;

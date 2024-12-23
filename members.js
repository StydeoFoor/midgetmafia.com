import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

      // Use the name as the key for simplicity and validation
      const validatedUsers = Object.values(users).filter(userData => userData?.name && userData?.role);
      displayUserList(validatedUsers); // Pass only valid user data
    } else {
      console.log("No users found.");
      displayUserList([]);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    displayUserList([]);
  }
}
  
async function displayUserList(users) {
  const userListContainer = document.getElementById("user-list");

  if (!userListContainer) {
    console.error("HTML element with ID 'user-list' is missing.");
    return;
  }

  userListContainer.innerHTML = ""; // Clear the user list

  if (users.length === 0) {
    userListContainer.textContent = "No users found.";
    return;
  }

  // Fetch the muted list from Firebase
  const mutedRef = ref(database, "muted");
  let mutedList = {};
  try {
    const snapshot = await get(mutedRef);
    if (snapshot.exists()) {
      mutedList = snapshot.val();
    }
  } catch (error) {
    console.error("Error fetching muted list:", error);
  }

  const ul = document.createElement("ul");
  ul.style.listStyleType = "none";
  ul.style.padding = "0";

  users.forEach((userData) => {
    const { name, role } = userData;

    if (!name) return; // Skip users without a name

    const li = document.createElement("li");
    li.style.padding = "10px 0";
    li.style.fontFamily = "Arial, sans-serif";
    li.style.color = "#333";

    // Add user details
    const userText = document.createElement("span");
    userText.textContent = `${name} - ${role || "No Role"}`;
    li.appendChild(userText);

    // Determine if user is muted
    const isMuted = !!mutedList[name];

    // Add Mute/Unmute button
    const muteButton = document.createElement("button");
    muteButton.textContent = isMuted ? "Unmute" : "Mute";
    muteButton.style.marginLeft = "10px";
    muteButton.style.padding = "5px 10px";
    muteButton.style.backgroundColor = isMuted ? "#28a745" : "#ff4d4d";
    muteButton.style.color = "white";
    muteButton.style.border = "none";
    muteButton.style.borderRadius = "5px";
    muteButton.style.cursor = "pointer";

    muteButton.onclick = () => {
      if (isMuted) {
        unmuteUser(name); // Call unmute function
      } else {
        muteUser(name); // Call mute function
      }
    };

    li.appendChild(muteButton);

    // Add Role Change button (visible only to specific users)
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const allowedToChangeRoles = loggedInUser?.name === "Shawn Rabb";
    const allowedRoleChange = loggedInUser?.role === "TrustedInstaller";

    if (allowedToChangeRoles) {
      if (role !== "TrustedInstaller") {
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
        roleButton.onclick = () => showRolePopup(name);
  
        li.appendChild(roleButton);
      }
    }
    else if (allowedRoleChange) {
      if (role !== "TrustedInstaller") {
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
        roleButton.onclick = () => showRolePopup(name);
  
        li.appendChild(roleButton);
      }
    }

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
      await set(mutedRef, true); // Add user to muted list
  
      alert(`${userName} has been muted.`);
      console.log(`${userName} added to muted list.`);
      fetchAllUsers(); // Refresh the user list to update the button
    } catch (error) {
      console.error("Error muting user:", error);
      alert("An error occurred while muting the user.");
    }
  }
  
  async function unmuteUser(userName) {
    if (!userName) {
      console.error("Invalid user name provided.");
      return;
    }
  
    try {
      const mutedRef = ref(database, `muted/${userName}`);
      await set(mutedRef, null); // Remove user from muted list
  
      alert(`${userName} has been unmuted.`);
      console.log(`${userName} removed from muted list.`);
      fetchAllUsers(); // Refresh the user list to update the button
    } catch (error) {
      console.error("Error unmuting user:", error);
      alert("An error occurred while unmuting the user.");
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

  async function updateUserRole(userName, newRole, popup) {
    try {
      if (!userName) {
        throw new Error("Invalid userName: userName is required");
      }
  
      // Reference the entire "users" node
      const usersRef = ref(database, "users");
  
      // Fetch all users to find the one with the matching name
      const snapshot = await get(usersRef);
      if (!snapshot.exists()) {
        throw new Error("Users not found in the database");
      }
  
      const users = snapshot.val();
      let userKey = null;
  
      // Find the user key by matching the name
      for (const key in users) {
        if (users[key]?.name === userName) {
          userKey = key;
          break;
        }
      }
  
      if (!userKey) {
        throw new Error(`User with name "${userName}" not found`);
      }
  
      // Update the role of the specific user
      const userRef = ref(database, `users/${userKey}`);
      await set(userRef, { ...users[userKey], role: newRole });
  
      alert(`Role for ${userName} updated to ${newRole}`);
      console.log(`User role updated: ${userName} -> ${newRole}`);
  
      document.body.removeChild(popup); // Close the popup
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("An error occurred while updating the role.");
    }
  }


// On page load, fetch and display the user list
window.onload = fetchAllUsers;

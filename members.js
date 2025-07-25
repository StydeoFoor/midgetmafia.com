import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
      break;
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
  if (topbar) topbar.style.backgroundColor = "#1f1f1f";
  if (sidebar) sidebar.style.backgroundColor = "#1f1f1f";
}

function applyLightMode() {
  body.style.background = "#ffffff";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
  if (topbar) topbar.style.backgroundColor = "#e8e8e8";
  if (sidebar) sidebar.style.backgroundColor = "#e8e8e8";
}

function applyOceanTheme() {
  body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
  body.style.minHeight = "100vh";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
  if (topbar) topbar.style.backgroundColor = "#003c60";
  if (sidebar) sidebar.style.backgroundColor = "#003c60";
}

function applySunsetTheme() {
  body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
  body.style.minHeight = "100vh";
  body.style.color = "black";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
  if (topbar) topbar.style.backgroundColor = "#b35b47";
  if (sidebar) sidebar.style.backgroundColor = "#b35b47";

  body.querySelectorAll("h1, h2, h3").forEach((el) => (el.style.color = "white"));
}

function applyMidnightTheme() {
  body.style.background = "#1a1a1a";
  body.style.color = "white";

  body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
  if (topbar) topbar.style.backgroundColor = "#000000";
  if (sidebar) sidebar.style.backgroundColor = "#000000";
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
    fetchAllUsers(); // NOW it's safe to call it
  } else {
    console.log("No user, signing in...");
    signInAnonymously(auth)
      .then((result) => {
        console.log("Signed in as:", result.user.uid);
        fetchAllUsers(); // Also safe here
      })
      .catch((error) => {
        console.error("Sign-in failed:", error);
      });
  }
});

// Fetch all user names from the "users" node
async function fetchAllUsers() {
  if (!auth.currentUser) {
    return; // Stops sending message
  } 
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
  if (!auth.currentUser) return;

  const userListContainer = document.getElementById("user-list");
  if (!userListContainer) {
    console.error("HTML element with ID 'user-list' is missing.");
    return;
  }
  userListContainer.innerHTML = "";

  if (users.length === 0) {
    userListContainer.textContent = "No users found.";
    return;
  }

  // Fetch muted list once
  const mutedRef = ref(database, "muted");
  let mutedList = {};
  try {
    const snapshot = await get(mutedRef);
    if (snapshot.exists()) mutedList = snapshot.val();
  } catch (error) {
    console.error("Error fetching muted list:", error);
  }

  // Fetch current user info once
  const loggedInUser = localStorage.getItem("loggedInUser");
  let canChangeRoles = false;
  try {
    const userRef = ref(database, `users/${loggedInUser}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const currentUser = snapshot.val();
      const username = currentUser?.name;
      const userrole = currentUser?.role;
      canChangeRoles = username === "John Doe" || userrole === "TrustedInstaller";
    }
  } catch (error) {
    console.error("Error fetching logged in user info:", error);
  }

  const ul = document.createElement("ul");
  ul.style.listStyleType = "none";
  ul.style.padding = "0";

  users.forEach(({ name, role }) => {
    if (!name) return;

    const li = document.createElement("li");
    li.style.padding = "10px 0";
    li.style.fontFamily = "Arial, sans-serif";
    li.style.color = "#333";

    const userText = document.createElement("span");
    userText.textContent = `${name} - ${role || "No Role"}`;
    li.appendChild(userText);

    const isMuted = !!mutedList[name];

    const muteButton = document.createElement("button");
    muteButton.textContent = isMuted ? "Unmute" : "Mute";
    muteButton.style.marginLeft = "10px";
    muteButton.style.padding = "5px 10px";
    muteButton.style.backgroundColor = isMuted ? "#28a745" : "#ff4d4d";
    muteButton.style.color = "white";
    muteButton.style.border = "none";
    muteButton.style.borderRadius = "5px";
    muteButton.style.cursor = "pointer";
    muteButton.onclick = () => (isMuted ? unmuteUser(name) : muteUser(name));
    li.appendChild(muteButton);

    if (canChangeRoles) {
      const roleButton = document.createElement("button");
      roleButton.textContent = "Change Role";
      roleButton.style.marginLeft = "10px";
      roleButton.style.padding = "5px 10px";
      roleButton.style.backgroundColor = "#007bff";
      roleButton.style.color = "white";
      roleButton.style.border = "none";
      roleButton.style.borderRadius = "5px";
      roleButton.style.cursor = "pointer";
      roleButton.onclick = () => showRolePopup(name);
      li.appendChild(roleButton);

      const objButton = document.createElement("button");
      objButton.textContent = "Set Objective";
      objButton.style.marginLeft = "10px";
      objButton.style.padding = "5px 10px";
      objButton.style.backgroundColor = "limegreen";
      objButton.style.color = "white";
      objButton.style.border = "none";
      objButton.style.borderRadius = "5px";
      objButton.style.cursor = "pointer";
      objButton.onclick = () => showObjPopup(name);
      li.appendChild(objButton);
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
      <option value="Executive">Executive</option>
      <option value="Manager">Manager</option>
      <option value="Vice Manager">Vice Manager</option>
      <option value="Judge">Judge</option>
      <option value="SPY!!!">Spy</option>
      <option value="Mighty Midget">Mighty Midget</option>
      <option value="Developer">Developer</option>
      <option value="Bodyguard">Bodyguard</option>
      <option value="Member">Member</option>
      <option style="color: green; font-weight: bold;" value="Retired Staff">Demote to Retired</option>
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

  function showObjPopup(userName) {
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
    title.textContent = `Set Objective for ${userName}`;
    title.style.marginBottom = "15px";
  
    const input = document.createElement("input");
    input.style.placeholder = "Set Objective";
    input.style.width = "100%";
    input.style.padding = "10px";
    input.style.marginBottom = "15px";
  
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.marginRight = "10px";
    saveButton.style.padding = "10px 15px";
    saveButton.style.backgroundColor = "#28a745";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
    saveButton.onclick = () => updateUserObj(userName, input.value, popup);
  
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
    popup.appendChild(input);
    popup.appendChild(saveButton);
    popup.appendChild(cancelButton);
  
    document.body.appendChild(popup);
  }

  async function updateUserObj(userName, newObj, popup) {
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
      await set(userRef, { ...users[userKey], currentInvolvement: newObj });
  
      alert(`Objective for ${userName} updated`);
      console.log(`User objective updated: ${userName} -> ${objRole}`);
  
      document.body.removeChild(popup); // Close the popup
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("An error occurred while updating the role.");
    }
  }


// On page load, fetch and display the user list
window.onload = fetchAllUsers;
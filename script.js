import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  signOut,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const topbar = document.getElementById("myTopBar");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleViewBtn");
  const sunButton = document.getElementById("sunButton");
  const body = document.body;

  const firebaseConfig = {
    apiKey: "AIzaSyB17qMT--ON4KaYZLnEjU5HbwZmds9KgWg",
    authDomain: "midget-mafia.firebaseapp.com",
    databaseURL: "https://midget-mafia-default-rtdb.firebaseio.com",
    projectId: "midget-mafia",
    storageBucket: "midget-mafia.appspot.com",
    messagingSenderId: "597092364947",
    appId: "1:597092364947:web:2c7db18295c2cd151f5366",
    measurementId: "G-3PTREP7EJ8",
  };

  // Firebase Initialization
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  async function initializeLoginForm() {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("Login form not found.");
    return;
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    try {
      // Anonymous Auth
      await setPersistence(auth, browserLocalPersistence)
      const userCredential = await signInAnonymously(auth);
      console.log("Anonymous auth success. UID:", userCredential.user.uid);

      // Get user data from DB
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await signOut(auth);
        alert("Invalid username or password.");
        return;
      }

      const user = snapshot.val();

      if (user.password !== password) {
        await signOut(auth);
        alert("Invalid username or password.");
        return;
      }

      // Login success
      localStorage.setItem("loggedInUser", username);
      alert("Login successful!");
      window.location.href = "dashboard.html";
      const usernameRef = ref(database, `users/${username}` + Date.now()); // Timestamp as unique ID for each message
      update(ref(database, `users/${username}`), { online: "true" });
      onDisconnect(ref(database, `users/${username}/online`)).set("false");

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  });
}

  // Firebase initialization moved before the functions that use it

  // ===== Fetch User Data Dynamically on Each Refresh ====

  // ===== Dark Mode Functions =====
  const themes = ["dark", "light", "ocean", "sunset", "midnight"];
let currentThemeIndex = themes.indexOf(localStorage.getItem("theme") || "dark");
  
  // DOM Element
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
    if (sunButton) sunButton.textContent = "🌙";
    body.style.background = "#303030";
    body.style.color = "white";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
    if (topbar) topbar.style.backgroundColor = "#242424";
    if (sidebar) sidebar.style.backgroundColor = "#242424";
  }
  
  function applyLightMode() {
    if (sunButton) sunButton.textContent = "☀️";
    body.style.background = "#ffffff";
    body.style.color = "black";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
    if (topbar) topbar.style.backgroundColor = "#e8e8e8";
    if (sidebar) sidebar.style.backgroundColor = "#e8e8e8";
  }
  
  function applyOceanTheme() {
    if (sunButton) sunButton.textContent = "🌊";
    body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
    body.style.minHeight = "100vh";
    body.style.color = "white";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
    if (topbar) topbar.style.backgroundColor = "#003c60";
    if (sidebar) sidebar.style.backgroundColor = "#003c60";
  }
  
  function applySunsetTheme() {
    if (sunButton) sunButton.textContent = "🌅";
    body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
    body.style.minHeight = "100vh";
    body.style.color = "black";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
    if (topbar) topbar.style.backgroundColor = "#b35b47";
    if (sidebar) sidebar.style.backgroundColor = "#b35b47";
  
    body.querySelectorAll("h1, h2, h3").forEach((el) => (el.style.color = "white"));
  }
  
  function applyMidnightTheme() {
    if (sunButton) sunButton.textContent = "🌌";
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
  
  // Add button functionality
  if (sunButton) {
    sunButton.addEventListener("click", () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(themes[currentThemeIndex]);
    });
  }
  
  // Initialize everything on page load
  initializeTheme();

  // ===== Sidebar/Topbar Toggle =====
  let useSidebar = localStorage.getItem("useSidebar") === "true";

  function switchToSidebar() {
    if (sidebar) {
      sidebar.style.width = "250px";
    }
    if (topbar) {
      topbar.style.display = "none";
    }
    if (body) {
      body.style.marginLeft = "250px";
    }
    if (toggleBtn) {
      toggleBtn.textContent = "Switch to Topbar";
    }
    useSidebar = true;
    localStorage.setItem("useSidebar", "true");
  }

  function switchToTopbar() {
    if (sidebar) {
      sidebar.style.width = "0";
    }
    if (topbar) {
      topbar.style.display = "flex";
    }
    if (body) {
      body.style.marginLeft = "0";
    }
    if (toggleBtn) {
      toggleBtn.textContent = "Switch to Sidebar";
    }
    useSidebar = false;
    localStorage.setItem("useSidebar", "false");
  }

  function initializeLayout() {
    if (useSidebar) {
      switchToSidebar();
    } else {
      switchToTopbar();
    }
  }

  // ===== Login System =====

  // ===== Dashboard Logic =====
  async function populateDashboard() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    // Redirect to login only if not already on the login page
    if (!loggedInUser && !window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
      return;
    }

    if (loggedInUser) {
      const username = localStorage.getItem("loggedInUser");
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);
      const user = snapshot.val();
      if (!snapshot.exists()) {
        console.error(`User data not found for username: ${username}`);
        return;
      }
      const nameEl = document.getElementById("name");
      const roleEl = document.getElementById("role");
      const teamEl = document.getElementById("team");
      const involvementEl = document.getElementById("currentInvolvement");
      const ownerDash = document.getElementById("ownerDash");
      const giveQuest = document.getElementById("giveQuest");
      const name = user.name;
      const role = user.role;
      const team = user.team;
      const currentInvolvement = user.currentInvolvement

      if (nameEl) nameEl.textContent = name || "N/A";
      if (roleEl) roleEl.textContent = role || "N/A";
      if (teamEl) teamEl.textContent = team || "N/A";
      if (involvementEl)
        involvementEl.textContent = currentInvolvement || "N/A";

      const allowedRoles = [
        "Leader",
        "Executive",
        "Vice Manager",
        "Developer",
        "Manager",
        "Vice Owner",
        "TrustedInstaller",
      ];
      if (ownerDash && allowedRoles.includes(role)) {
        ownerDash.style.display = "block";
        ownerDash.style.pointerEvents = "auto";
      }
      if (giveQuest && allowedRoles.includes(role)) {
        giveQuest.style.display = "block";
        giveQuest.style.pointerEvents = "auto";
      }
    }
    function fetchMessages() {
      const messagesRef = ref(database, "quests/"); // Reference to your 'chats' node
    
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
      const chatBox = document.getElementById("quests");
      if (!chatBox) {
        console.error("HTML element with ID 'chat-box' is missing.");
        return;
      }
    
      chatBox.innerHTML = ""; // Clear chat box
    
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const allowedRoles = ["Leader", "Manager", "Vice Manager", "Developer", "Executive"];
      const canDelete = allowedRoles.includes(loggedInUser?.role);
    
      // Helper to format date with ordinal (e.g. 18th)
      function getOrdinal(day) {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      }
    
      function formatDate(date) {
        const options = { month: "long" };
        const monthStr = date.toLocaleDateString(undefined, options);
        const day = date.getDate();
        const ordinal = getOrdinal(day);
        return `${monthStr} ${day}${ordinal}`;
      }
    
      // Convert messages object into array with keys included
      const messagesArray = Object.entries(messages).map(([key, msg]) => ({
        key,
        ...msg
      }));
    
      // Sort messages by timestamp ascending
      messagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
      let previousDate = null;
    
      messagesArray.forEach(msg => {
        const currentDate = new Date(msg.timestamp);
        const currentDateMidnight = new Date(currentDate);
        currentDateMidnight.setHours(0, 0, 0, 0);
    
        // Insert date divider if day changes
        if (
          !previousDate ||
          previousDate.getTime() !== currentDateMidnight.getTime()
        ) {
          const dateDivider = document.createElement("div");
          dateDivider.textContent = formatDate(currentDateMidnight);
          dateDivider.style.fontSize = "14px";
          dateDivider.style.fontWeight = "bold";
          dateDivider.style.color = "#888";
          dateDivider.style.margin = "20px 0 10px";
          dateDivider.style.borderBottom = "1px solid #ccc";
          dateDivider.style.paddingBottom = "5px";
          chatBox.appendChild(dateDivider);
        }
    
        previousDate = currentDateMidnight;
    
        // Create message element
        const messageElement = document.createElement("div");
        messageElement.style.display = "flex";
        messageElement.style.justifyContent = "space-between";
        messageElement.style.alignItems = "center";
        messageElement.style.marginBottom = "8px";
        messageElement.style.marginLeft = "5px";
    
        const messageText = document.createElement("div");
        messageText.innerHTML = `<strong>${msg.title}</strong>: ${msg.description}`;
        messageText.style.flex = "1";
        messageText.style.color = "black";
    
        const time = currentDate.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toLowerCase();
    
        const timeElement = document.createElement("span");
        timeElement.textContent = time;
        timeElement.style.fontSize = "12px";
        timeElement.style.color = "#aaa";
        timeElement.style.marginLeft = "10px";
        timeElement.style.whiteSpace = "nowrap";
    
        messageElement.appendChild(messageText);
        messageElement.appendChild(timeElement);
    
        chatBox.appendChild(messageElement);
      });
    
      // Scroll to bottom
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    fetchMessages();
  }

  async function bodyguardMessage() {
    const username = localStorage.getItem("loggedInUser");
    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);
    const user = snapshot.val();
    const role = user.role;

    const bodyMsg = document.getElementById("bodyMsg");

    const allowedRoles = [
      "Leader",
      "Executive",
      "Bodyguard",
      "Developer",
      "TrustedInstaller",
    ];
    if (bodyMsg && allowedRoles.includes(role)) {
      bodyMsg.style.display = "block";
      bodyMsg.style.pointerEvents = "auto";
    }
  }

  function initializeDashboard() {
    if (window.location.pathname.includes("dashboard.html")) {
      populateDashboard();
    }
  }

  async function ownerDashboard() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const username = localStorage.getItem("loggedInUser");
    const userRef = ref(database, `users/${username}`);
    const snapshot = await get(userRef);
    const user = snapshot.val();
    const name = user.name;
    const role = user.role;
    const currentInvolvement = user.currentInvolvement

    const allowedRoles = [
      "Leader",
      "Executive",
      "Vice Manager",
      "Developer",
      "Manager",
      "Vice Owner",
      "TrustedInstaller",
    ];
    if (!allowedRoles.includes(role)) {
      window.location.href = "index.html";
      alert("You aren't allowed here")
      return;
    }

    if (!loggedInUser) {
      window.location.href = "login.html";
      return;
    }

    const nameEl = document.getElementById("adname");
    const roleEl = document.getElementById("adrole");
    const involvementEl = document.getElementById("adcurrentInvolvement");

    if (nameEl) nameEl.textContent = name || "N/A";
    if (roleEl) roleEl.textContent = role || "N/A";
    if (involvementEl)
      involvementEl.textContent = currentInvolvement || "N/A";
  }

  function initOwnerDashboard() {
    if (window.location.pathname.includes("ownerDashboard.html")) {
      ownerDashboard();
    }
  }

  // ===== Initialize Page =====
  function initializePage() {
    initializeTheme();
    initializeLayout();
    initializeLoginForm();
    initializeDashboard();
    initOwnerDashboard();
    bodyguardMessage();
  }

  // Load user data and initialize the page
  initializePage();

  // Add event listener for layout toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (useSidebar) {
        switchToTopbar();
      } else {
        switchToSidebar();
      }
    });
  }

  // Add event listener for theme toggle

  if (window.location.href.includes("login.html")) {
    console.log("Login page detected.");
    initializeLoginForm();
  } else {
    console.log("Not on the login page.");
  }

  if (window.location.href.includes("index.html")) {
    const roleList = document.getElementById("roleList");
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      console.log("Foreign user detected");
      roleList.style.display = "none";
    }
    else if (loggedInUser) {
      roleList.style.display = "block";
    }
    else {

      }
  }

  // Easter egg: Chicken Nugget on 'N' key press
  document.addEventListener("keydown", function (event) {
  console.log("Key pressed:", event.key);
  if (event.key === "n" || event.key === "N") {
    if (document.getElementById("nugget-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "nugget-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.5s ease",
    });

    const nuggetImage = document.createElement("img");
    nuggetImage.src = "./chicken.png"; // Make sure this is correct
    nuggetImage.alt = "Chicken Nugget";
    Object.assign(nuggetImage.style, {
      maxWidth: "300px",
      maxHeight: "300px",
      borderRadius: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
      transition: "opacity 1s ease",
    });

    overlay.appendChild(nuggetImage);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    setTimeout(() => {
      nuggetImage.style.opacity = "0";
      overlay.style.opacity = "0";
      overlay.addEventListener("transitionend", () => {
        overlay.remove();
      });
    }, 2000);
  }
});
});
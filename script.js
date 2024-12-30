import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
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

  function initializeLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
  
        if (!username || !password) {
          alert("Username and password are required.");
          return;
        }
  
        try {
          // Fetch only the specific user's data from Firebase
          const userRef = ref(database, `users/${username}`);
          const snapshot = await get(userRef);
  
          if (snapshot.exists()) {
            const user = snapshot.val();
  
            // Validate the password
            if (user.password === password) {
              localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store only the logged-in user's info
              alert("Login successful!");
              window.location.href = "dashboard.html";
            } else {
              alert("Invalid username or password.");
            }
          } else {
            alert("Invalid username or password.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred while logging in. Please try again.");
        }
      });
    }
  }

  // Firebase initialization moved before the functions that use it

  // ===== Fetch User Data Dynamically on Each Refresh ====

  // ===== Dark Mode Functions =====
  const themes = ["dark", "light", "ocean", "sunset", "chrome", "midnight"];
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
      case "chrome":
        applyChromeTheme();
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
  
    localStorage.setItem("theme", "dark");
  }
  
  function applyLightMode() {
    if (sunButton) sunButton.textContent = "☀️";
    body.style.background = "#ffffff";
    body.style.color = "black";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "black"));
    if (topbar) topbar.style.backgroundColor = "#e8e8e8";
    if (sidebar) sidebar.style.backgroundColor = "#e8e8e8";
  
    localStorage.setItem("theme", "light");
  }
  
  function applyOceanTheme() {
    if (sunButton) sunButton.textContent = "🌊";
    body.style.background = "linear-gradient(to bottom, #0077be, #004080)";
    body.style.minHeight = "100vh";
    body.style.color = "white";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "#a8d0e6"));
    if (topbar) topbar.style.backgroundColor = "#003c60";
    if (sidebar) sidebar.style.backgroundColor = "#003c60";
  
    localStorage.setItem("theme", "ocean");
  }
  
  function applySunsetTheme() {
    if (sunButton) sunButton.textContent = "🌅";
    body.style.background = "linear-gradient(to bottom, #ff7e5f, #feb47b)";
    body.style.minHeight = "100vh";
    body.style.color = "black";
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "#ffdda1"));
    if (topbar) topbar.style.backgroundColor = "#b35b47";
    if (sidebar) sidebar.style.backgroundColor = "#b35b47";
  
    localStorage.setItem("theme", "sunset");
  }
  
  function applyChromeTheme() {
    if (sunButton) sunButton.textContent = "🌈";
    body.style.background = "#303030";
    body.style.color = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);"
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
    if (topbar) topbar.style.backgroundColor = "#242424";
    if (sidebar) sidebar.style.backgroundColor = "#242424";
  
    localStorage.setItem("theme", "chrome");
  }

  function applyMidnightTheme() {
    if (sunButton) sunButton.textContent = "🌌";
    body.style.background = "#1a1a1a";
    body.style.color = "white"
  
    body.querySelectorAll("a").forEach((a) => (a.style.color = "white"));
    if (topbar) topbar.style.backgroundColor = "#000000";
    if (sidebar) sidebar.style.backgroundColor = "#000000";
  
    localStorage.setItem("theme", "midnight");
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
  function populateDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Redirect to login only if not already on the login page
    if (!loggedInUser && !window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
      return;
    }

    if (loggedInUser) {
      const nameEl = document.getElementById("name");
      const roleEl = document.getElementById("role");
      const teamEl = document.getElementById("team");
      const involvementEl = document.getElementById("currentInvolvement");
      const ownerDash = document.getElementById("ownerDash");

      if (nameEl) nameEl.textContent = loggedInUser.name || "N/A";
      if (roleEl) roleEl.textContent = loggedInUser.role || "N/A";
      if (teamEl) teamEl.textContent = loggedInUser.team || "N/A";
      if (involvementEl)
        involvementEl.textContent = loggedInUser.currentInvolvement || "N/A";

      const allowedRoles = [
        "Owner",
        "Vice Manager",
        "Developer",
        "Manager",
        "Vice Owner",
        "TrustedInstaller",
      ];
      if (ownerDash && allowedRoles.includes(loggedInUser.role)) {
        ownerDash.style.display = "block";
        ownerDash.style.pointerEvents = "auto";
      }
    }
  }

  function bodyguardMessage() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const bodyMsg = document.getElementById("bodyMsg");

    const allowedRoles = [
      "Owner",
      "Bodyguard",
      "Developer",
      "TrustedInstaller",
    ];
    if (bodyMsg && allowedRoles.includes(loggedInUser.role)) {
      bodyMsg.style.display = "block";
      bodyMsg.style.pointerEvents = "auto";
    }
  }

  function initializeDashboard() {
    if (window.location.pathname.includes("dashboard.html")) {
      populateDashboard();
    }
  }

  function ownerDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const allowedRoles = [
      "Owner",
      "Vice Manager",
      "Developer",
      "Manager",
      "Vice Owner",
      "TrustedInstaller",
    ];
    if (!allowedRoles.includes(loggedInUser.role)) {
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
    const teamEl = document.getElementById("memberrequest");
    const involvementEl = document.getElementById("membercount");

    if (nameEl) nameEl.textContent = loggedInUser.name || "N/A";
    if (roleEl) roleEl.textContent = loggedInUser.role || "N/A";
    if (teamEl) teamEl.textContent = loggedInUser.team || "N/A";
    if (involvementEl)
      involvementEl.textContent = loggedInUser.currentInvolvement || "N/A";
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

  // Easter egg: Chicken Nugget on 'N' key press
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", function (event) {
      console.log("Key pressed:", event.key); // Debug keypress
      if (event.key === "n" || event.key === "N") {
        if (document.getElementById("nugget-overlay")) return;
  
        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = "nugget-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.5s ease";
  
        // Create image element
        const nuggetImage = document.createElement("img");
        nuggetImage.src = "./chicken.png"; // Ensure this path is correct
        nuggetImage.alt = "Chicken Nugget";
        nuggetImage.style.maxWidth = "300px";
        nuggetImage.style.maxHeight = "300px";
        nuggetImage.style.borderRadius = "20px";
        nuggetImage.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
        nuggetImage.style.transition = "opacity 1s ease";
  
        overlay.appendChild(nuggetImage);
        document.body.appendChild(overlay);
  
        // Fade-in the overlay and image
        requestAnimationFrame(() => {
          overlay.style.opacity = "1";
        });
  
        // Fade-out logic after 2 seconds
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
});
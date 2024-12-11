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

  // Firebase initialization moved before the functions that use it

  // ===== Fetch User Data Dynamically on Each Refresh =====
  function loadUsersFromDatabase(callback) {
    const dbRef = ref(database);
    get(child(dbRef, "users"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          localStorage.setItem("users", JSON.stringify(users));
          if (callback) callback(users);
        } else {
          console.error("No user data found in the database.");
          if (callback) callback([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error.message);
        if (callback) callback([]);
      });
  }

  // ===== Dark Mode Functions =====
  function applyDarkMode() {
    if (sunButton) sunButton.textContent = "🌙";
    body.style.backgroundColor = "#2d5f29";
    body.style.color = "white";

    body.querySelectorAll("a").forEach((a) => {
      a.style.color = "white";
    });

    if (topbar) topbar.style.backgroundColor = "#242424";
    if (sidebar) sidebar.style.backgroundColor = "#242424";

    body.querySelectorAll("p, h1, h2, h3").forEach((el) => {
      if (el && !el.classList.contains("exclude-dark-mode")) {
        el.style.color =
          el.tagName === "H3"
            ? "red"
            : el.tagName === "H1" || el.tagName === "H2"
              ? "white"
              : "white";
      }
    });

    // Reset colors for excluded elements
    body.querySelectorAll(".exclude-dark-mode").forEach((el) => {
      el.style.color = ""; // Reset to default or inherited color
      el.style.backgroundColor = ""; // Optional, if background color matters
    });

    localStorage.setItem("theme", "dark");
  }

  function applyLightMode() {
    if (sunButton) sunButton.textContent = "☀️";
    body.style.backgroundColor = "#7fff76";
    body.style.color = "black";

    body.querySelectorAll("a").forEach((a) => {
      a.style.color = "black";
    });

    if (topbar) topbar.style.backgroundColor = "#c2c2c2";
    if (sidebar) sidebar.style.backgroundColor = "#c2c2c2";

    // Check if elements exist before modifying their styles

    body.querySelectorAll("p, h1, h2, h3").forEach((el) => {
      if (el && !el.classList.contains("exclude-dark-mode")) {
        el.style.color = "black";
      }
    });

    // Reset colors for excluded elements
    body.querySelectorAll(".exclude-dark-mode").forEach((el) => {
      el.style.color = ""; // Reset to default or inherited color
      el.style.backgroundColor = ""; // Optional, if background color matters
    });

    localStorage.setItem("theme", "light");
  }

  // ===== Initialize Theme =====
  function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");

  // If no theme is saved, set dark mode as default
  if (!savedTheme) {
    applyDarkMode();
    localStorage.setItem("theme", "dark"); // Save the dark theme as default
  } else if (savedTheme === "dark") {
    applyDarkMode();
  } else {
    applyLightMode();
  }
}

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
  function initializeLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
          alert("Username and password are required.");
          return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || {};
        const user = users[username];

        if (user && user.password === password) {
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          alert("Login successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("Invalid username or password.");
        }
      });
    }
  }

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
  loadUsersFromDatabase(initializePage);

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
  sunButton.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
      applyDarkMode();
    } else {
      applyLightMode();
    }
  });

  if (window.location.href.includes("login.html")) {
    console.log("Login page detected.");
    loginTheme();
  } else {
    console.log("Not on the login page.");
  }

  function loginTheme() {
    console.log("loginTheme function called.");

    const loginContainer = document.getElementById("loginContainer");
    console.log("loginContainer:", loginContainer); // Debugging line

    if (!loginContainer) {
      console.error("loginContainer not found.");
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    console.log("Saved theme in localStorage:", savedTheme); // Debugging line

    if (savedTheme === "dark") {
      loginContainer.style.setProperty(
        "background-color",
        "#303030",
        "important",
      );
      loginContainer.style.setProperty("color", "white", "important");
      loginContainer.querySelectorAll("input, label").forEach((el) => {
        el.style.setProperty("color", "white", "important");
      });
      console.log("Dark theme applied.");
    } else {
      loginContainer.style.setProperty(
        "background-color",
        "#f4f4f9",
        "important",
      );
      loginContainer.style.setProperty("color", "black", "important");
      loginContainer.querySelectorAll("input, label").forEach((el) => {
        el.style.setProperty("color", "black", "important");
      });
      console.log("Light theme applied.");
    }
  }

  // Easter egg: Chicken Nugget on 'N' key press
  document.addEventListener("keydown", function (event) {
  if (event.key === "n" || event.key === "N") {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = 1000;
    overlay.style.opacity = "0"; // Start with opacity 0 for transition
    overlay.style.transition = "opacity 0.5s ease";

    const nuggetImage = document.createElement("img");
    nuggetImage.src = "./chicken.png"; // Update with correct path
    nuggetImage.alt = "Chicken Nugget";
    nuggetImage.style.maxWidth = "90%";
    nuggetImage.style.maxHeight = "90%";
    nuggetImage.style.borderRadius = "20px";
    nuggetImage.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
    nuggetImage.style.opacity = "1"; // Set initial opacity for nuggetImage

    overlay.appendChild(nuggetImage);
    document.body.appendChild(overlay);

    // Trigger transition
    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 0);

    setTimeout(() => {
      nuggetImage.style.opacity = "0"; // Fade out the image
      overlay.style.opacity = "0"; // Fade out the overlay
      overlay.addEventListener("transitionend", () => {
        overlay.remove();
      });
    }, 2000);
  }
});
});

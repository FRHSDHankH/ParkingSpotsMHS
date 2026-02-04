/**
 * ===================================
 * GLOBAL APPLICATION SCRIPT (app.js)
 * ===================================
 * Central hub for all pages. Handles:
 * - Navbar injection on all pages
 * - Light/Dark mode system with LocalStorage persistence
 * - Shared utility functions (LocalStorage, alerts, formatting)
 * - Theme toggle UI initialization
 *
 * USAGE: Include this script on all HTML pages before other scripts
 * THEME: Uses CSS custom properties (:root and [data-theme="dark"])
 * STORAGE: Saves theme preference to localStorage['theme']
 */

// ===================================
// INITIALIZE NAVBAR ON PAGE LOAD
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  // Set dark mode as default
  document.documentElement.setAttribute('data-theme', 'dark');
  
  // Load navbar
  loadNavbar();
});

/**
 * Load and inject navbar from component
 */
function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  
  if (!navbarContainer) {
    console.warn('Navbar container not found');
    return;
  }

  // Navbar HTML (embedded instead of fetching)
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand" href="index.html">
          <img src="public/images/MustangsLogo.png" alt="Marlboro Mustangs Logo" height="40" class="me-2">
          Marlboro High School Parking
        </a>

        <!-- Toggler for Mobile -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Navigation Links -->
            <li class="nav-item">
              <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="parking.html">Select Spot</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="admin.html">Admin</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  navbarContainer.innerHTML = navbarHTML;
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Get value from LocalStorage
 * @param {string} key
 * @param {any} defaultValue
 * @returns {any}
 */
function getFromLocalStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Error reading from localStorage: ${key}`, e);
    return defaultValue;
  }
}

/**
 * Save value to LocalStorage
 * @param {string} key
 * @param {any} value
 */
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing to localStorage: ${key}`, e);
  }
}

/**
 * Remove value from LocalStorage
 * @param {string} key
 */
function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing from localStorage: ${key}`, e);
  }
}

/**
 * Clear all LocalStorage
 */
function clearLocalStorage() {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Error clearing localStorage', e);
  }
}

/**
 * Format date to readable string
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Format datetime to readable string
 * @param {Date|string} date
 * @returns {string}
 */
function formatDateTime(date) {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Show alert notification
 * @param {string} message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - milliseconds
 */
function showAlert(message, type = 'info', duration = 3000) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.body;
  container.insertBefore(alertDiv, container.firstChild);

  if (duration > 0) {
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }
}

console.log('Global app.js loaded successfully');

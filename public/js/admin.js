/**
 * ===================================
 * ADMIN DASHBOARD SCRIPT
 * ===================================
 * Handles:
 * - Admin authentication
 * - Session management
 * - Access control
 */

// Admin password (in production, this should be hashed and server-side)
const ADMIN_PASSWORD = 'admin2024';

// Session timeout (30 minutes in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000;

document.addEventListener('DOMContentLoaded', function () {
  // Check if user is already authenticated
  if (isAdminLoggedIn()) {
    showAdminDashboard();
    // Start session timeout timer
    startSessionTimeout();
  } else {
    showLoginScreen();
  }

  // Setup login form
  setupLoginForm();

  // Setup logout button
  setupLogoutButton();

  // Setup control buttons (for future functionality)
  setupControlButtons();
});

/**
 * Check if admin is currently logged in
 * @returns {boolean} - True if logged in with valid session
 */
function isAdminLoggedIn() {
  const adminSession = getFromLocalStorage('adminSession', null);
  
  if (!adminSession) {
    return false;
  }

  // Check if session has expired
  const sessionTimestamp = new Date(adminSession.timestamp).getTime();
  const currentTime = new Date().getTime();
  const sessionAge = currentTime - sessionTimestamp;

  if (sessionAge > SESSION_TIMEOUT) {
    // Session expired
    removeFromLocalStorage('adminSession');
    return false;
  }

  // Refresh session timestamp on each page load
  refreshAdminSession();
  return true;
}

/**
 * Create an admin session
 */
function createAdminSession() {
  const session = {
    authenticated: true,
    timestamp: new Date().toISOString(),
    loginTime: formatDateTime(new Date()),
  };

  saveToLocalStorage('adminSession', session);
  console.log('✓ Admin session created');
}

/**
 * Refresh admin session timestamp
 */
function refreshAdminSession() {
  const adminSession = getFromLocalStorage('adminSession', null);
  if (adminSession) {
    adminSession.timestamp = new Date().toISOString();
    saveToLocalStorage('adminSession', adminSession);
  }
}

/**
 * Setup login form submission
 */
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleLoginSubmission();
    });
  }
}

/**
 * Handle login form submission
 */
function handleLoginSubmission() {
  const passwordInput = document.getElementById('adminPassword');
  const password = passwordInput.value.trim();

  // Validate password
  if (!password) {
    showAlert('❌ Please enter a password', 'danger', 3000);
    return;
  }

  // Check password
  if (password === ADMIN_PASSWORD) {
    // Create session
    createAdminSession();
    
    // Show success message
    showAlert('✓ Login successful! Redirecting...', 'success', 1500);
    
    // Hide login screen and show dashboard
    setTimeout(() => {
      showAdminDashboard();
      startSessionTimeout();
      // Clear password field
      passwordInput.value = '';
    }, 1500);
  } else {
    // Invalid password
    showAlert('❌ Invalid password. Please try again.', 'danger', 3000);
    passwordInput.value = '';
    passwordInput.focus();

    // Log failed attempt (in production, would be server-side)
    logFailedLoginAttempt();
  }
}

/**
 * Log failed login attempts
 */
function logFailedLoginAttempt() {
  let failedAttempts = getFromLocalStorage('failedLoginAttempts', 0);
  failedAttempts += 1;
  saveToLocalStorage('failedLoginAttempts', failedAttempts);
  
  console.warn(`⚠️ Failed login attempt #${failedAttempts}`);
}

/**
 * Show admin dashboard
 */
function showAdminDashboard() {
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');

  if (loginScreen) {
    loginScreen.style.display = 'none';
  }

  if (adminDashboard) {
    adminDashboard.style.display = 'block';
  }

  console.log('✓ Admin dashboard displayed');
}

/**
 * Show login screen
 */
function showLoginScreen() {
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');

  if (loginScreen) {
    loginScreen.style.display = 'flex';
  }

  if (adminDashboard) {
    adminDashboard.style.display = 'none';
  }

  console.log('✓ Login screen displayed');
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      handleLogout();
    });
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  // Show confirmation
  const confirmed = confirm('Are you sure you want to logout?');

  if (confirmed) {
    // Clear admin session
    removeFromLocalStorage('adminSession');

    // Show message
    showAlert('✓ Logged out successfully', 'info', 1500);

    // Redirect after delay
    setTimeout(() => {
      showLoginScreen();
      // Clear any visible data
      document.getElementById('tableBody').innerHTML = '';
    }, 1500);

    console.log('✓ Admin logged out');
  }
}

/**
 * Start session timeout timer
 * Session will expire after SESSION_TIMEOUT milliseconds of inactivity
 */
function startSessionTimeout() {
  // Clear any existing timeout
  if (window.sessionTimeoutId) {
    clearTimeout(window.sessionTimeoutId);
  }

  // Set new timeout
  window.sessionTimeoutId = setTimeout(() => {
    // Session expired
    removeFromLocalStorage('adminSession');
    showLoginScreen();
    showAlert('⚠️ Session expired. Please login again.', 'warning', 3000);
    console.log('✓ Admin session expired');
  }, SESSION_TIMEOUT);

  // Reset timeout on any user interaction
  document.addEventListener('mousemove', resetSessionTimeout);
  document.addEventListener('keypress', resetSessionTimeout);
  document.addEventListener('click', resetSessionTimeout);
}

/**
 * Reset session timeout on user activity
 */
function resetSessionTimeout() {
  // Refresh session
  refreshAdminSession();

  // Clear existing timeout
  if (window.sessionTimeoutId) {
    clearTimeout(window.sessionTimeoutId);
  }

  // Set new timeout
  if (isAdminLoggedIn()) {
    window.sessionTimeoutId = setTimeout(() => {
      removeFromLocalStorage('adminSession');
      showLoginScreen();
      showAlert('⚠️ Session expired due to inactivity. Please login again.', 'warning', 3000);
    }, SESSION_TIMEOUT);
  }
}

/**
 * Setup control buttons (placeholder for COMMIT 9)
 */
function setupControlButtons() {
  const resetAllBtn = document.getElementById('resetAllBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', function () {
      console.log('Reset all clicked - functionality in COMMIT 9');
      // Will be implemented in COMMIT 9
    });
  }

  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', function () {
      console.log('Export data clicked - functionality in COMMIT 9');
      // Will be implemented in COMMIT 9
    });
  }
}

console.log('✓ admin.js loaded successfully');

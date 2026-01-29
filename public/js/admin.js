/**
 * ===================================
 * ADMIN DASHBOARD SCRIPT (admin.js)
 * ===================================
 * Manages admin authentication and dashboard. Handles:
 * - Admin login with password verification
 * - Session management with 30-minute timeout
 * - Access control and view toggling
 * - Logout with confirmation
 * - Inactivity detection and auto-logout
 * - Failed login attempt tracking
 *
 * PASSWORD: MHSAdmin957734! (changeable constant)
 * STORAGE: Saves adminSession to localStorage
 * SESSION: 30-minute timeout + activity reset
 * SECURITY: Warns on failed attempts + session expiry
 * NEXT: Dashboard displays student data and controls
 */

// Admin password (in production, this should be hashed and server-side)
const ADMIN_PASSWORD = 'MHSAdmin957734!';

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
  const searchInput = document.getElementById('searchInput');

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', handleResetAllData);
  }

  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', handleExportData);
  }

  if (searchInput) {
    searchInput.addEventListener('input', handleSearchSubmissions);
  }

  // Load and display all student data
  loadAndDisplayAllSubmissions();
}

/**
 * Load all student submissions and populate the dashboard
 */
function loadAndDisplayAllSubmissions() {
  const submissions = getFromLocalStorage('submissions', []);
  
  // Update statistics
  updateStatistics(submissions);

  // Populate table
  populateDataTable(submissions);

  // Store for filtering
  window.allSubmissions = submissions;
  window.filteredSubmissions = submissions;
}

/**
 * Update statistics cards
 * @param {Array} submissions - Array of student submissions
 */
function updateStatistics(submissions) {
  const totalSpots = 68; // 3 lots × ~22 spots average
  const reservedSpots = submissions.length;
  const availableSpots = totalSpots - reservedSpots;
  const occupancyRate = Math.round((reservedSpots / totalSpots) * 100);

  document.getElementById('totalSpotsDisplay').textContent = totalSpots;
  document.getElementById('reservedSpotsDisplay').textContent = reservedSpots;
  document.getElementById('availableSpotsDisplay').textContent = availableSpots;
  document.getElementById('occupancyRateDisplay').textContent = occupancyRate + '%';

  console.log(`Statistics: ${reservedSpots}/${totalSpots} spots reserved (${occupancyRate}%)`);
}

/**
 * Populate data table with student submissions
 * @param {Array} submissions - Array of student submissions to display
 */
function populateDataTable(submissions) {
  const tableBody = document.getElementById('tableBody');
  const noDataMsg = document.getElementById('noDataMsg');

  // Clear existing rows
  tableBody.innerHTML = '';

  if (submissions.length === 0) {
    noDataMsg.style.display = 'block';
    return;
  }

  noDataMsg.style.display = 'none';

  // Create row for each submission
  submissions.forEach((submission, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(submission.fullName)}</td>
      <td>${escapeHtml(submission.studentId)}</td>
      <td>${escapeHtml(submission.email)}</td>
      <td>${escapeHtml(submission.partnerName)}</td>
      <td>${escapeHtml(submission.partnerId)}</td>
      <td><strong>${submission.selectedLot}</strong></td>
      <td><strong>${submission.selectedSpot}</strong></td>
      <td>
        <button class="btn btn-sm btn-copy" onclick="copyToClipboard(${index})">
          📋 Copy
        </button>
        <button class="btn btn-sm btn-remove" onclick="removeSpot(${index})">
          🗑️ Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  console.log(`✓ Populated table with ${submissions.length} submissions`);
}

/**
 * Copy submission data to clipboard
 * @param {number} index - Index of submission in array
 */
function copyToClipboard(index) {
  const submission = window.filteredSubmissions[index];
  
  if (!submission) {
    showAlert('❌ Error: Submission not found', 'danger', 2000);
    return;
  }

  // Format data for copying
  const copyText = `
Student: ${submission.fullName} (ID: ${submission.studentId})
Email: ${submission.email}
Partner: ${submission.partnerName} (ID: ${submission.partnerId})
Parking: Lot ${submission.selectedLot}, Spot ${submission.selectedSpot}
Submitted: ${formatDateTime(submission.submittedAt)}
  `.trim();

  // Copy to clipboard
  navigator.clipboard.writeText(copyText).then(() => {
    showAlert('✓ Data copied to clipboard', 'success', 2000);
    console.log('✓ Data copied to clipboard');
  }).catch(() => {
    showAlert('❌ Failed to copy to clipboard', 'danger', 2000);
  });
}

/**
 * Remove a parking spot reservation
 * @param {number} index - Index of submission in array
 */
function removeSpot(index) {
  const submission = window.filteredSubmissions[index];
  
  if (!submission) {
    showAlert('❌ Error: Submission not found', 'danger', 2000);
    return;
  }

  // Confirm removal
  const confirmed = confirm(
    `Remove parking reservation for ${submission.fullName} (Lot ${submission.selectedLot}, Spot ${submission.selectedSpot})?`
  );

  if (!confirmed) {
    return;
  }

  // Find original index in all submissions
  const originalIndex = window.allSubmissions.findIndex(
    s => s.studentId === submission.studentId && s.selectedSpot === submission.selectedSpot
  );

  if (originalIndex !== -1) {
    // Remove from submissions
    window.allSubmissions.splice(originalIndex, 1);
    
    // Save updated submissions
    saveToLocalStorage('submissions', window.allSubmissions);

    // Reload display
    loadAndDisplayAllSubmissions();

    showAlert(`✓ Removed ${submission.fullName}'s reservation`, 'success', 2000);
    console.log(`✓ Removed submission at index ${originalIndex}`);
  }
}

/**
 * Handle search/filter functionality
 */
function handleSearchSubmissions() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    // Show all if search is empty
    window.filteredSubmissions = window.allSubmissions;
  } else {
    // Filter submissions
    window.filteredSubmissions = window.allSubmissions.filter(submission => {
      return (
        submission.fullName.toLowerCase().includes(query) ||
        submission.studentId.toLowerCase().includes(query) ||
        submission.email.toLowerCase().includes(query) ||
        submission.partnerName.toLowerCase().includes(query) ||
        submission.partnerId.toLowerCase().includes(query) ||
        submission.selectedLot.includes(query) ||
        submission.selectedSpot.includes(query)
      );
    });
  }

  // Repopulate table with filtered results
  populateDataTable(window.filteredSubmissions);
  console.log(`✓ Filtered to ${window.filteredSubmissions.length} results`);
}

/**
 * Handle reset all data confirmation
 */
function handleResetAllData() {
  const confirmed = confirm(
    '⚠️ WARNING: This will delete ALL student parking reservations. This action cannot be undone. Continue?'
  );

  if (!confirmed) {
    return;
  }

  const secondConfirm = confirm(
    'Are you absolutely sure? Click OK to delete all data.'
  );

  if (!secondConfirm) {
    return;
  }

  // Clear all submissions
  removeFromLocalStorage('submissions');
  removeFromLocalStorage('studentFormData');
  removeFromLocalStorage('selectedParking');
  removeFromLocalStorage('selectedLot');
  removeFromLocalStorage('selectedSpot');

  // Reset display
  window.allSubmissions = [];
  window.filteredSubmissions = [];
  loadAndDisplayAllSubmissions();

  showAlert('✓ All parking data has been reset', 'warning', 3000);
  console.log('✓ All parking data reset');
}

/**
 * Handle export data to JSON file
 */
function handleExportData() {
  const submissions = window.allSubmissions;

  if (submissions.length === 0) {
    showAlert('⚠️ No data to export', 'warning', 2000);
    return;
  }

  // Create export object with metadata
  const exportData = {
    exportDate: new Date().toISOString(),
    exportedBy: 'Admin Dashboard',
    totalRecords: submissions.length,
    data: submissions
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `parking_data_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAlert(`✓ Exported ${submissions.length} records to JSON`, 'success', 2000);
  console.log('✓ Data exported successfully');
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

console.log('✓ admin.js loaded successfully');

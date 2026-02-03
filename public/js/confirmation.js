/**
 * ===================================
 * CONFIRMATION PAGE SCRIPT (confirmation.js)
 * ===================================
 * Displays submission confirmation. Handles:
 * - Retrieves student form data from localStorage
 * - Displays parking spot assignment details
 * - Shows student and partner information
 * - Displays next steps and important information
 * - Handles redirect if no submission exists
 *
 * FLOW: Form.js → Confirmation.js (on success)
 * STORAGE: Reads from localStorage['studentFormData']
 * DISPLAY: Shows lot, spot, names, IDs, email, phone
 * ACTION: Users can print or proceed to home
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize confirmation page
  initializeConfirmationPage();
});

/**
 * Initialize the confirmation page
 */
function initializeConfirmationPage() {
  // Load and display student data
  loadAndDisplayConfirmation();
}

/**
 * Load student submission data and display on confirmation page
 */
function loadAndDisplayConfirmation() {
  // Get the most recent form submission
  const formData = getFromLocalStorage('studentFormData', null);

  if (!formData) {
    // No submission found
    console.warn('No student form data found in LocalStorage');
    showAlert('⚠️ No submission found. Please complete the form first.', 'warning', 5000);
    
    // Redirect to form page after delay
    setTimeout(() => {
      window.location.href = 'form.html';
    }, 3000);
    return;
  }

  // Display parking spot information
  displayParkingSpotInfo(formData.selectedLot, formData.selectedSpot, formData.selectedOption);

  // Display student information
  displayStudentInfo(formData);

  // Display partner information
  displayPartnerInfo(formData);

  console.log('✓ Confirmation page loaded with student data');
}

/**
 * Display assigned parking lot and spot
 * @param {string} lot - Parking lot letter (A, B, C)
 * @param {string} spotId - Spot ID
 * @param {string} option - Selected option (A, B, or Solo)
 */
function displayParkingSpotInfo(lot, spotId, option = 'Solo') {
  // Map lot codes to lot names
  const lotMap = {
    'The Hill': 'The Hill',
    'The Box': 'The Box',
    'A': 'The Hill',
    'B': 'The Box'
  };
  const lotName = lotMap[lot] || lot;
  
  // Display lot and spot
  document.getElementById('confirmLot').textContent = lotName;
  document.getElementById('confirmSpot').textContent = spotId;
  document.getElementById('confirmOption').textContent = option;

  // Get day information from parking data (in real implementation)
  // For now, we'll show the spot ID which contains the lot letter
  console.log(`Assigned: ${lotName}, Spot ${spotId}, Option ${option}`);
}

/**
 * Display student information
 * @param {object} formData - Student form data
 */
function displayStudentInfo(formData) {
  document.getElementById('confirmName').textContent = formData.fullName || '-';
  document.getElementById('confirmStudentId').textContent = formData.studentId || '-';
  document.getElementById('confirmEmail').textContent = formData.email || '-';
  
  // Display submission date if available
  if (formData.submittedAt) {
    const submittedDate = formatDateTime(formData.submittedAt);
    document.getElementById('confirmDate').textContent = submittedDate;
  } else {
    document.getElementById('confirmDate').textContent = '-';
  }

  console.log(`Student: ${formData.fullName} (${formData.studentId})`);
}

/**
 * Display partner information
 * @param {object} formData - Student form data
 */
function displayPartnerInfo(formData) {
  document.getElementById('confirmPartnerName').textContent = formData.partnerName || '-';
  document.getElementById('confirmPartnerStudentId').textContent = formData.partnerId || '-';

  console.log(`Partner: ${formData.partnerName} (${formData.partnerId})`);
}

console.log('✓ confirmation.js loaded successfully');

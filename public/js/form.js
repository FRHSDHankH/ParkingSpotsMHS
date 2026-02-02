/**
 * ===================================
 * STUDENT INFORMATION FORM SCRIPT (form.js)
 * ===================================
 * Manages student registration form. Handles:
 * - Retrieves selected parking spot from parking.js
 * - Form validation: required fields + ID format check
 * - Student & partner information collection
 * - Form submission and data persistence
 * - Redirect to confirmation page
 *
 * VALIDATION: Bootstrap HTML5 + custom ID validation
 * STORAGE: Saves formData to localStorage['studentFormData']
 * STORAGE: Appends to localStorage['submissions'] array for admin
 * SUBMISSION: Redirects to confirmation.html on success
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize form page
  initializeFormPage();
});

/**
 * Initialize the form page
 */
function initializeFormPage() {
  // Display selected parking spot
  displaySelectedSpot();

  // Setup solo spot checkbox listener
  const soloSpotCheckbox = document.getElementById('soloSpotCheckbox');
  if (soloSpotCheckbox) {
    soloSpotCheckbox.addEventListener('change', togglePartnerFields);
  }

  // Setup form submission
  const form = document.getElementById('studentForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmission);
  }
}

/**
 * Toggle partner fields visibility based on solo spot checkbox
 */
function togglePartnerFields() {
  const soloSpotCheckbox = document.getElementById('soloSpotCheckbox');
  const partnerNameContainer = document.getElementById('partnerNameContainer');
  const partnerIdContainer = document.getElementById('partnerIdContainer');
  const partnerName = document.getElementById('partnerName');
  const partnerId = document.getElementById('partnerId');

  if (soloSpotCheckbox.checked) {
    // Hide partner fields and remove required attribute
    partnerNameContainer.style.display = 'none';
    partnerIdContainer.style.display = 'none';
    partnerName.removeAttribute('required');
    partnerId.removeAttribute('required');
  } else {
    // Show partner fields and add required attribute
    partnerNameContainer.style.display = 'block';
    partnerIdContainer.style.display = 'block';
    partnerName.setAttribute('required', 'required');
    partnerId.setAttribute('required', 'required');
  }
}

/**
 * Display the selected parking spot from the parking page
 */
function displaySelectedSpot() {
  // Get selected spot from localStorage (set by parking.js)
  const selectedLot = getFromLocalStorage('selectedLot', null);
  const selectedSpot = getFromLocalStorage('selectedSpot', null);
  const selectedOption = getFromLocalStorage('selectedOption', 'Solo');

  // Display in form
  const lotDisplay = document.getElementById('selectedLotDisplay');
  const spotDisplay = document.getElementById('selectedSpotDisplay');
  const optionDisplay = document.getElementById('selectedOptionDisplay');

  if (selectedLot && selectedSpot) {
    lotDisplay.textContent = selectedLot;
    // Extract just the number from spotId if it's formatted as "A-1"
    const spotNumber = selectedSpot.includes('-') ? selectedSpot.split('-')[1] : selectedSpot;
    spotDisplay.textContent = spotNumber;
    optionDisplay.textContent = selectedOption;
  } else {
    // If no spot selected, show warning
    lotDisplay.textContent = 'No Lot Selected';
    spotDisplay.textContent = 'N/A';
    optionDisplay.textContent = 'N/A';

    // Show alert
    showAlert('⚠️ No parking spot selected. Please go back and select a spot.', 'warning', 5000);
  }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmission(e) {
  e.preventDefault();

  const form = document.getElementById('studentForm');
  const soloSpotCheckbox = document.getElementById('soloSpotCheckbox');

  // Bootstrap form validation
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    showAlert('❌ Please fill in all required fields correctly.', 'danger', 4000);
    return;
  }

  // Validate email ends with @frhsd.com
  const email = document.getElementById('email').value.trim();
  if (!email.endsWith('@frhsd.com')) {
    showAlert('❌ Email must end with @frhsd.com', 'danger', 3000);
    return;
  }

  // Validate student ID is exactly 7 digits
  const studentId = document.getElementById('studentId').value.trim();
  if (!/^[0-9]{7}$/.test(studentId)) {
    showAlert('❌ Student ID must be exactly 7 digits.', 'danger', 3000);
    return;
  }

  // Collect form data
  const soloSpotRequested = document.getElementById('soloSpotRequest').checked;
  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    studentId: studentId,
    email: email,
    soloSpot: soloSpotCheckbox.checked,
    approvalPending: soloSpotCheckbox.checked,
    partnerName: soloSpotCheckbox.checked ? '' : document.getElementById('partnerName').value.trim(),
    partnerId: soloSpotCheckbox.checked ? '' : document.getElementById('partnerId').value.trim(),
    selectedLot: getFromLocalStorage('selectedLot', null),
    selectedSpot: getFromLocalStorage('selectedSpot', null),
    selectedOption: getFromLocalStorage('selectedOption', 'Solo'),
    soloSpotRequested: soloSpotRequested,
    approvalStatus: soloSpotRequested ? 'pending' : 'approved',
    submittedAt: new Date().toISOString(),
  };

  // Validate that a parking spot was selected
  if (!formData.selectedLot || !formData.selectedSpot) {
    showAlert('❌ Please select a parking spot before submitting.', 'danger', 4000);
    return;
  }

  // Validate student and partner IDs (basic format check)
  if (!isValidStudentId(formData.studentId)) {
    showAlert('❌ Student ID must be exactly 7 digits.', 'danger', 3000);
    return;
  }

  // Validate email ends in @frhsd.com
  if (!formData.email.endsWith('@frhsd.com')) {
    showAlert('❌ Email must end in @frhsd.com', 'danger', 3000);
    return;
  }

  // Validate partner ID only if partner name is provided
  if (formData.partnerName && !isValidStudentId(formData.partnerId)) {
    showAlert('❌ Partner ID must be exactly 7 digits.', 'danger', 3000);
    return;
  }

  // Save form data to localStorage
  saveStudentFormData(formData);

  // Show success message
  if (soloSpotCheckbox.checked) {
    showAlert('✓ Form submitted! Your solo spot request is pending admin approval.', 'success', 2000);
  } else {
    showAlert('✓ Form submitted successfully! Redirecting to confirmation...', 'success', 2000);
  }

  // Redirect to confirmation page after brief delay
  setTimeout(() => {
    window.location.href = 'confirmation.html';
  }, 2000);
}

/**
 * Validate student ID format (exactly 7 digits)
 * @param {string} id - Student ID
 * @returns {boolean} - True if valid
 */
function isValidStudentId(id) {
  // Must be exactly 7 digits
  return id && /^\d{7}$/.test(id);
}

/**
 * Save student form data to localStorage and JSON file
 * @param {object} formData - Form data object
 */
function saveStudentFormData(formData) {
  try {
    // Save the current submission to localStorage
    saveToLocalStorage('studentFormData', formData);

    // Also save to a submissions array for admin dashboard
    let submissions = getFromLocalStorage('submissions', []);

    // Ensure it's an array
    if (!Array.isArray(submissions)) {
      submissions = [];
    }

    submissions.push(formData);
    saveToLocalStorage('submissions', submissions);

    // Also save to the JSON file (via fetch POST)
    fetch('public/data/studentData.json')
      .then(response => response.json())
      .then(data => {
        // Ensure submissions array exists
        if (!Array.isArray(data.submissions)) {
          data.submissions = [];
        }

        // Add new submission
        data.submissions.push(formData);
        data.lastUpdated = new Date().toISOString();
        data.totalSubmissions = data.submissions.length;

        // Note: This would require a backend endpoint to save
        // For now, data persists in localStorage
        console.log('✓ Student form data prepared for JSON storage', data);
      })
      .catch(err => console.log('Note: JSON file update requires backend (localStorage used instead)'));

    console.log('✓ Student form data saved to localStorage');
  } catch (error) {
    console.error('✗ Error saving form data:', error);
    showAlert('⚠️ Error saving data. Please try again.', 'warning', 3000);
  }
}

console.log('✓ form.js loaded successfully');

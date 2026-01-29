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

  // Setup form submission
  const form = document.getElementById('studentForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmission);
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
    spotDisplay.textContent = selectedSpot;
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

  // Bootstrap form validation
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    showAlert('❌ Please fill in all required fields correctly.', 'danger', 4000);
    return;
  }

  // Collect form data
  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    studentId: document.getElementById('studentId').value.trim(),
    email: document.getElementById('email').value.trim(),
    partnerName: document.getElementById('partnerName').value.trim(),
    partnerId: document.getElementById('partnerId').value.trim(),
    selectedLot: getFromLocalStorage('selectedLot', null),
    selectedSpot: getFromLocalStorage('selectedSpot', null),
    selectedOption: getFromLocalStorage('selectedOption', 'Solo'),
    submittedAt: new Date().toISOString(),
  };

  // Validate that a parking spot was selected
  if (!formData.selectedLot || !formData.selectedSpot) {
    showAlert('❌ Please select a parking spot before submitting.', 'danger', 4000);
    return;
  }

  // Validate student and partner IDs (basic format check)
  if (!isValidStudentId(formData.studentId)) {
    showAlert('❌ Invalid student ID format.', 'danger', 3000);
    return;
  }

  if (!isValidStudentId(formData.partnerId)) {
    showAlert('❌ Invalid partner student ID format.', 'danger', 3000);
    return;
  }

  // Save form data to localStorage
  saveStudentFormData(formData);

  // Show success message
  showAlert('✓ Form submitted successfully! Redirecting to confirmation...', 'success', 2000);

  // Redirect to confirmation page after brief delay
  setTimeout(() => {
    window.location.href = 'confirmation.html';
  }, 2000);
}

/**
 * Validate student ID format (basic validation)
 * @param {string} id - Student ID
 * @returns {boolean} - True if valid
 */
function isValidStudentId(id) {
  // Allow alphanumeric IDs with at least 3 characters
  return id && id.length >= 3 && /^[a-zA-Z0-9]{3,}$/.test(id);
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
  } catch (error) {
    console.error('Error saving form data:', error);
    showAlert('⚠️ Error saving data. Please try again.', 'warning', 3000);
  }
}

console.log('✓ form.js loaded successfully');

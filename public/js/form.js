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
  // Check if returning from parking lot with saved form data
  restoreFormData();
  
  // Display selected parking spot
  displaySelectedSpot();

  // Setup solo spot checkbox listener
  const soloSpotCheckbox = document.getElementById('soloSpotRequest');
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
  const soloSpotCheckbox = document.getElementById('soloSpotRequest');
  const partnerNameContainer = document.getElementById('partnerName').parentElement;
  const partnerIdContainer = document.getElementById('partnerId').parentElement;
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
  const selectedLotId = getFromLocalStorage('selectedLotId', null);
  const selectedOption = getFromLocalStorage('selectedOption', 'Solo');

  console.log('Parking Spot Data Retrieved:', { selectedLot, selectedSpot, selectedLotId, selectedOption });

  // Display in form
  const lotDisplay = document.getElementById('selectedLotDisplay');
  const spotDisplay = document.getElementById('selectedSpotDisplay');
  const optionDisplay = document.getElementById('selectedOptionDisplay');

  if (selectedLot && selectedSpot && selectedLotId) {
    lotDisplay.textContent = selectedLot;
    // Display as LOT-SPOTNUMBER for clarity (e.g., B-133)
    spotDisplay.textContent = `${selectedLotId}-${selectedSpot}`;
    optionDisplay.textContent = selectedOption;
    console.log('Parking spot displayed successfully');
  } else {
    // If no spot selected, show warning
    lotDisplay.textContent = 'No Lot Selected';
    spotDisplay.textContent = 'N/A';
    optionDisplay.textContent = 'N/A';

    console.warn('No parking spot data found in localStorage');
    // Show alert
    showAlert('No parking spot selected. Please go back and select a spot.', 'warning', 5000);
  }
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmission(e) {
  e.preventDefault();

  const form = document.getElementById('studentForm');
  const soloSpotCheckbox = document.getElementById('soloSpotRequest');

  // Bootstrap form validation
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    showAlert('Please fill in all required fields correctly.', 'danger', 4000);
    return;
  }

  // Get values
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const studentId = document.getElementById('studentId').value.trim();
  const partnerName = document.getElementById('partnerName').value.trim();
  const partnerId = document.getElementById('partnerId').value.trim();

  // Validate email ends with @frhsd.com
  if (!email.endsWith('@frhsd.com')) {
    showAlert('Email must end with @frhsd.com', 'danger', 3000);
    return;
  }

  // Validate student ID is exactly 7 digits
  if (!/^[0-9]{7}$/.test(studentId)) {
    showAlert('Student ID must be exactly 7 digits.', 'danger', 3000);
    return;
  }

  // If not solo spot and partner name provided, validate partner ID
  if (!soloSpotCheckbox.checked && partnerName && partnerId) {
    if (!/^[0-9]{7}$/.test(partnerId)) {
      showAlert('Partner ID must be exactly 7 digits if provided.', 'danger', 3000);
      return;
    }
  }

  // Get parking spot data from localStorage
  const selectedLot = getFromLocalStorage('selectedLot', null);
  const selectedSpot = getFromLocalStorage('selectedSpot', null);
  const selectedSpotId = getFromLocalStorage('selectedSpotId', null);
  const selectedLotId = getFromLocalStorage('selectedLotId', null);
  const selectedOption = getFromLocalStorage('selectedOption', 'Solo');

  // Validate that a parking spot was selected
  if (!selectedLot || !selectedSpot) {
    showAlert('Please select a parking spot before submitting.', 'danger', 4000);
    return;
  }

  // Collect form data
  const formData = {
    fullName: fullName,
    studentId: studentId,
    email: email,
    soloSpot: soloSpotCheckbox.checked,
    approvalPending: soloSpotCheckbox.checked,
    partnerName: soloSpotCheckbox.checked ? '' : partnerName,
    partnerId: soloSpotCheckbox.checked ? '' : partnerId,
    selectedLot: selectedLot,
    selectedSpot: selectedSpot,
    selectedSpotId: selectedSpotId,
    selectedLotId: selectedLotId,
    selectedOption: selectedOption,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  console.log('Form data validated and collected:', formData);

  // Update JSON file to mark spot as taken
  updateParkingDataJson(formData);

  // Save form data to localStorage
  saveStudentFormData(formData);

  // Show success message
  if (soloSpotCheckbox.checked) {
    showAlert('Form submitted! Your solo spot request is pending admin approval.', 'success', 2000);
  } else {
    showAlert('Form submitted successfully! Redirecting to confirmation...', 'success', 2000);
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
        console.log('Student form data prepared for JSON storage', data);
      })
      .catch(err => console.log('Note: JSON file update requires backend (localStorage used instead)'));

    console.log('Student form data saved to localStorage');
  } catch (error) {
    console.error('Error saving form data:', error);
    showAlert('Error saving data. Please try again.', 'warning', 3000);
  }
}

console.log('✓ form.js loaded successfully');

/**
 * Save current form data temporarily before going back to parking page
 */
function changeSpot() {
  // Collect current form data
  const tempFormData = {
    fullName: document.getElementById('fullName').value.trim(),
    studentId: document.getElementById('studentId').value.trim(),
    email: document.getElementById('email').value.trim(),
    partnerName: document.getElementById('partnerName').value.trim(),
    partnerId: document.getElementById('partnerId').value.trim(),
    soloSpot: document.getElementById('soloSpotRequest').checked
  };
  
  // Save to temporary storage
  saveToLocalStorage('tempFormData', tempFormData);
  
  // Go back to parking page
  window.location.href = 'parking.html';
}

/**
 * Update parking data JSON file to mark spot as taken
 * @param {object} formData - Form submission data
 */
function updateParkingDataJson(formData) {
  // Note: In a real application, this would make a server request
  // Since we're client-side only, we'll update localStorage as a proxy
  // and log what would be sent to the server
  
  if (!formData.selectedSpotId || !formData.selectedLotId) {
    console.warn('Cannot update parking data: missing spot or lot ID');
    return;
  }

  const updateData = {
    spotId: formData.selectedSpotId,
    lotId: formData.selectedLotId,
    studentName: formData.fullName,
    studentId: formData.studentId,
    email: formData.email,
    partnerName: formData.partnerName || null,
    partnerId: formData.partnerId || null,
    reservedDate: new Date().toISOString(),
    taken: true
  };

  // Store update request in localStorage (simulating server persistence)
  let parkingUpdates = getFromLocalStorage('parkingUpdates', []);
  parkingUpdates.push(updateData);
  saveToLocalStorage('parkingUpdates', parkingUpdates);

  console.log('Parking spot marked as taken:', updateData);
  console.log('📤 In production, this would update the JSON file on the server');
}

/**
 * Restore form data if user is returning from parking page
 */
function restoreFormData() {
  const tempFormData = getFromLocalStorage('tempFormData', null);
  
  if (tempFormData) {
    // Restore all form fields
    document.getElementById('fullName').value = tempFormData.fullName || '';
    document.getElementById('studentId').value = tempFormData.studentId || '';
    document.getElementById('email').value = tempFormData.email || '';
    document.getElementById('partnerName').value = tempFormData.partnerName || '';
    document.getElementById('partnerId').value = tempFormData.partnerId || '';
    document.getElementById('soloSpotRequest').checked = tempFormData.soloSpot || false;
    
    // Toggle partner fields if solo spot is checked
    if (tempFormData.soloSpot) {
      const partnerNameContainer = document.getElementById('partnerName').parentElement;
      const partnerIdContainer = document.getElementById('partnerId').parentElement;
      partnerNameContainer.style.display = 'none';
      partnerIdContainer.style.display = 'none';
    }
    
    // Clear temporary storage after restoration
    localStorage.removeItem('tempFormData');
  }
}

/**
 * Change parking spot - go back to parking page
 */
function changeSpot() {
  // Save form data temporarily
  const tempFormData = {
    fullName: document.getElementById('fullName').value,
    studentId: document.getElementById('studentId').value,
    email: document.getElementById('email').value,
    partnerName: document.getElementById('partnerName').value,
    partnerId: document.getElementById('partnerId').value,
    soloSpot: document.getElementById('soloSpotRequest').checked,
  };

  // Save to temporary storage
  saveToLocalStorage('tempFormData', tempFormData);

  // Go back to parking page
  window.location.href = 'parking.html';
}

console.log('✓ form.js loaded successfully');

/**
 * ===================================
 * PARKING LOT PAGE SCRIPT (parking.js)
 * ===================================
 * Manages the parking spot selection interface. Handles:
 * - Dynamic parking lot grid generation (CSS Grid)
 * - Parking spot components with clickable areas
 * - Spot status: available, taken, selected
 * - Lot switching (A, B)
 * - Spot selection with visual feedback
 * - Data persistence to localStorage for form.js
 *
 * DATA STRUCTURE: parkingData loaded from JSON with 291 total spots
 * STORAGE: Saves selectedLot, selectedSpot to localStorage
 * UI FEEDBACK: Selection card shows lot name and spot number
 * NEXT: Form.js retrieves selected spot from localStorage
 */

// Current selected spot and lot
let currentSelectedSpot = null;
let currentSelectedLot = null;
let parkingData = {};

// Load parking data from JSON file
async function loadParkingData() {
  try {
    const response = await fetch('public/data/parkingData.json');
    const data = await response.json();
    
    // Convert lot structure to match expected format
    parkingData = {
      A: {
        name: data.parkingLots.A.name,
        totalSpots: data.parkingLots.A.totalSpots,
        spots: data.parkingLots.A.spots
      },
      B: {
        name: data.parkingLots.B.name,
        totalSpots: data.parkingLots.B.totalSpots,
        spots: data.parkingLots.B.spots
      }
    };
    
    console.log('✓ Parking data loaded:', { A: parkingData.A.totalSpots, B: parkingData.B.totalSpots, Total: parkingData.A.totalSpots + parkingData.B.totalSpots });
    initializeParkingPage();
  } catch (error) {
    console.error('Failed to load parking data:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Load parking data first
  loadParkingData();
});

/**
 * Initialize the parking page
 */
function initializeParkingPage() {
  // Set up lot button listeners
  const lotButtons = document.querySelectorAll('.lot-btn');
  lotButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      switchLot(this.dataset.lot);
    });
  });

  // Try to load previous selection, otherwise default to Lot A
  const previousSelection = getFromLocalStorage('selectedParking', null);
  if (previousSelection) {
    loadSelectedParking();
  } else {
    switchLot('A');
  }
}

/**
 * Switch to a different parking lot
 * @param {string} lotId - Lot A or B
 */
function switchLot(lotId) {
  currentSelectedLot = lotId;
  
  // Update button states
  const lotButtons = document.querySelectorAll('.lot-btn');
  lotButtons.forEach((btn) => {
    if (btn.dataset.lot === lotId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update title
  const lotData = parkingData[lotId];
  document.getElementById('currentLot').textContent = lotData.name;

  // Render parking lot grid
  renderParkingLot(lotId);
}

/**
 * Render parking lot grid with spots
 * @param {string} lotId - Lot A or B
 */
function renderParkingLot(lotId) {
  const container = document.getElementById('parkingLotContainer');
  const lotData = parkingData[lotId];

  // Clear existing spots
  container.innerHTML = '';

  // Create parking spot elements
  lotData.spots.forEach((spot) => {
    const spotElement = createParkingSpot(spot);
    container.appendChild(spotElement);
  });
}

/**
 * Create a parking spot element with A/B options
 * @param {object} spot - Spot data from JSON
 * @returns {HTMLElement} - Parking spot element
 */
function createParkingSpot(spot) {
  const spotDiv = document.createElement('div');
  spotDiv.className = `parking-spot ${spot.taken ? 'taken' : 'available'}`;
  spotDiv.dataset.spotId = spot.id;

  spotDiv.innerHTML = `
    <div class="spot-container">
      <div class="spot-header">
        <span class="spot-number">${spot.number}</span>
      </div>
      <div class="spot-options">
        <button class="spot-btn btn-option-a" data-option="A" ${spot.taken ? 'disabled' : ''}>
          A
        </button>
        <button class="spot-btn btn-option-b" data-option="B" ${spot.taken ? 'disabled' : ''}>
          B
        </button>
      </div>
    </div>
  `;
  
  // Add click listeners only if spot is available
  if (!spot.taken) {
    const optionBtns = spotDiv.querySelectorAll('.spot-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const option = this.dataset.option;
        selectSpot(spot.id, spot, option);
      });
    });
  }

  return spotDiv;
}

/**
 * Handle spot selection with option (A, B, or Solo)
 * @param {string} spotId - Spot ID (e.g., 'A-1')
 * @param {object} spotData - Spot data object
 * @param {string} option - Selection option: 'A', 'B', or 'Solo'
 */
function selectSpot(spotId, spotData, option = '') {
  // Remove previous selection
  if (currentSelectedSpot) {
    const previousSpot = document.querySelector(`[data-spot-id="${currentSelectedSpot}"]`);
    if (previousSpot) {
      previousSpot.classList.remove('selected');
    }
  }

  // Apply selection to new spot
  currentSelectedSpot = spotId;
  const spotElement = document.querySelector(`[data-spot-id="${spotId}"]`);
  spotElement.classList.add('selected');
  spotElement.classList.add('taken');

  // Mark spot as taken in parking data
  const spotIndex = parkingData[currentSelectedLot].spots.findIndex(s => s.id === spotId);
  if (spotIndex !== -1) {
    parkingData[currentSelectedLot].spots[spotIndex].taken = true;
  }

  // Show selected spot card with option
  const spotCard = document.getElementById('selectedSpotCard');
  document.getElementById('selectedLot').textContent = parkingData[currentSelectedLot].name;
  document.getElementById('selectedSpot').textContent = spotData.number;
  document.getElementById('selectedOption').textContent = option || 'Solo';
  spotCard.style.display = 'block';

  // Save selected spot to localStorage for use in form
  saveToLocalStorage('selectedLot', parkingData[currentSelectedLot].name);
  saveToLocalStorage('selectedSpot', spotId);
  saveToLocalStorage('selectedOption', option || 'Solo');

  // Save selection to LocalStorage
  saveSelectedParking(currentSelectedLot, spotId, option);

  // Scroll to selection card
  spotCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Save selected parking spot to LocalStorage
 * @param {string} lot - Parking lot (A or B)
 * @param {string} spotId - Spot ID (e.g., 'A-1')
 * @param {string} option - Selection option (A, B, or Solo)
 */
function saveSelectedParking(lot, spotId, option = '') {
  // Save individual keys for form access
  saveToLocalStorage('selectedLot', lot);
  saveToLocalStorage('selectedSpot', spotId);
  saveToLocalStorage('selectedOption', option || 'Solo');
  
  // Also save combined object for reference
  const selectedParking = {
    lot: lot,
    spotId: spotId,
    option: option || 'Solo',
    timestamp: new Date().toISOString()
  };
  saveToLocalStorage('selectedParking', selectedParking);
  console.log('✓ Parking selection saved:', selectedParking);
}

/**
 * Load selected parking from LocalStorage if exists
 */
function loadSelectedParking() {
  const selectedParking = getFromLocalStorage('selectedParking', null);
  if (selectedParking) {
    console.log('✓ Loaded previous parking selection:', selectedParking);
    // Switch to the previously selected lot
    switchLot(selectedParking.lot);
    // Restore the spot selection after a short delay to ensure DOM is ready
    setTimeout(() => {
      const spotElement = document.querySelector(`[data-spot-id="${selectedParking.spotId}"]`);
      if (spotElement && spotElement.classList.contains('available')) {
        spotElement.classList.add('selected');
        currentSelectedSpot = selectedParking.spotId;
        const spotCard = document.getElementById('selectedSpotCard');
        document.getElementById('selectedLot').textContent = parkingData[selectedParking.lot].name;
        
        // Find the spot number
        const spot = parkingData[selectedParking.lot].spots.find(s => s.id === selectedParking.spotId);
        if (spot) {
          document.getElementById('selectedSpot').textContent = spot.number;
        }
        spotCard.style.display = 'block';
      }
    }, 100);
  }
}

console.log('✓ parking.js loaded successfully');
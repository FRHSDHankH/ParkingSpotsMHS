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
    
    console.log('Parking data loaded:', { A: parkingData.A.totalSpots, B: parkingData.B.totalSpots, Total: parkingData.A.totalSpots + parkingData.B.totalSpots });
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
  // Set up lot card listeners (clickable cards)
  const lotCards = document.querySelectorAll('.lot-card');
  lotCards.forEach((card) => {
    card.addEventListener('click', function () {
      switchLot(this.dataset.lot);
    });
  });

  // Try to load previous selection, otherwise default to Lot A (The Hill)
  const previousSelection = getFromLocalStorage('selectedParking', null);
  if (previousSelection) {
    loadSelectedParking();
  } else {
    switchLot('A');
  }

  // Auto-refresh parking lot display every 3 seconds to sync with new submissions
  setInterval(() => {
    if (currentSelectedLot) {
      renderParkingLot(currentSelectedLot);
    }
  }, 3000);
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
  
  // Check if spot has been requested/taken by any student
  const submissions = getFromLocalStorage('submissions', []);
  
  // Log all submissions for debugging
  console.log(`Checking spot ${spot.id} (lot: ${spot.lot}, number: ${spot.number})`);
  console.log('All submissions:', submissions);
  
  // Filter by both lot AND spot number, and only count pending/approved submissions
  const spotSubmissions = submissions.filter(s => {
    const matches = parseInt(s.selectedSpot) === spot.number && 
                    s.selectedLotId === spot.lot &&
                    (s.status === 'pending' || s.status === 'approved');
    console.log(`  Submission check - spot: ${s.selectedSpot} (parsed: ${parseInt(s.selectedSpot)}) vs ${spot.number}, lot: ${s.selectedLotId} vs ${spot.lot}, status: ${s.status} - MATCH: ${matches}`);
    return matches;
  });
  
  const isSoloTaken = spotSubmissions.some(s => s.soloSpot);
  const isPartiallyTaken = spotSubmissions.length > 0 && !spotSubmissions.some(s => s.soloSpot);
  const isTaken = spot.taken || spotSubmissions.length > 0;
  
  // Debug logging
  console.log(`  RESULT for ${spot.id}: isTaken=${isTaken}, spotSubmissions.length=${spotSubmissions.length}, isSolo=${isSoloTaken}, isPartial=${isPartiallyTaken}`);
  
  spotDiv.className = `parking-spot ${isTaken ? 'taken' : 'available'}`;
  spotDiv.dataset.spotId = spot.id;

  // If spot is partially taken (only one half used), show half layout
  if (isPartiallyTaken && spotSubmissions.length === 1) {
    const takenHalf = spotSubmissions[0].selectedOption || 'A';
    const availableHalf = takenHalf === 'A' ? 'B' : 'A';
    
    spotDiv.innerHTML = `
      <div class="spot-container">
        <div class="spot-header">
          <span class="spot-number">${spot.number}</span>
        </div>
        <div class="spot-options" style="display: flex; gap: 0; flex: 1;">
          <div class="spot-half" style="background: linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%); opacity: 0.7; cursor: not-allowed;">
            <span style="font-weight: 700; font-size: 0.75rem;">${takenHalf}</span>
          </div>
          <div class="spot-half" style="background: linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);">
            <button class="spot-btn" data-option="${availableHalf}" style="flex: 1; width: 100%; border: none; margin: 0;">${availableHalf}</button>
          </div>
        </div>
      </div>
    `;
    
    // Add click listener for available half
    const halfBtn = spotDiv.querySelector('.spot-btn');
    halfBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const option = this.dataset.option;
      selectSpot(spot.id, spot, option);
    });
  } else {
    // Full spot or completely taken
    spotDiv.innerHTML = `
      <div class="spot-container">
        <div class="spot-header">
          <span class="spot-number">${spot.number}</span>
        </div>
        <div class="spot-options">
          <button class="spot-btn btn-option-a" data-option="A" ${isTaken ? 'disabled' : ''}>
            A
          </button>
          <button class="spot-btn btn-option-b" data-option="B" ${isTaken ? 'disabled' : ''}>
            B
          </button>
        </div>
      </div>
    `;
    
    // Add click listeners only if spot is available
    if (!isTaken) {
      const optionBtns = spotDiv.querySelectorAll('.spot-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          const option = this.dataset.option;
          selectSpot(spot.id, spot, option);
        });
      });
    }
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

  // Apply selection to new spot (visual highlight only - NOT locked yet)
  currentSelectedSpot = spotId;
  const spotElement = document.querySelector(`[data-spot-id="${spotId}"]`);
  spotElement.classList.add('selected');
  // DO NOT add 'taken' class or mark as taken in data here
  // Spot is only locked after form submission

  // Show selected spot card with option
  const spotCard = document.getElementById('selectedSpotCard');
  document.getElementById('selectedLot').textContent = parkingData[currentSelectedLot].name;
  
  // Get the correct spot number from the data
  const spotIndexForNumber = parkingData[currentSelectedLot].spots.findIndex(s => s.id === spotId);
  let spotNumber = spotId;
  if (spotIndexForNumber !== -1) {
    spotNumber = parkingData[currentSelectedLot].spots[spotIndexForNumber].number;
  }
  
  document.getElementById('selectedSpot').textContent = spotNumber;
  document.getElementById('selectedOption').textContent = option || 'Solo';
  spotCard.style.display = 'block';

  // Save selected spot to localStorage for use in form
  saveToLocalStorage('selectedLot', parkingData[currentSelectedLot].name);
  saveToLocalStorage('selectedSpot', spotNumber);
  saveToLocalStorage('selectedSpotId', spotId);
  saveToLocalStorage('selectedLotId', currentSelectedLot);
  saveToLocalStorage('selectedOption', option || 'Solo');

  console.log('Parking spot saved to localStorage:', {
    lot: parkingData[currentSelectedLot].name,
    spot: spotData.number,
    option: option || 'Solo'
  });

  // Save selection to LocalStorage
  saveSelectedParking(currentSelectedLot, spotId, spotNumber, option);

  // Scroll to selection card
  spotCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Save selected parking spot to LocalStorage
 * @param {string} lot - Parking lot (A or B)
 * @param {string} spotId - Spot ID (e.g., 'A-1')
 * @param {number} spotNumber - Actual spot number (e.g., 1, 133)
 * @param {string} option - Selection option (A, B, or Solo)
 */
function saveSelectedParking(lot, spotId, spotNumber, option = '') {
  // Save combined object for reference (don't overwrite individual values)
  const selectedParking = {
    lot: lot,
    spotId: spotId,
    spotNumber: spotNumber,
    option: option || 'Solo',
    timestamp: new Date().toISOString()
  };
  saveToLocalStorage('selectedParking', selectedParking);
  console.log('Parking selection saved:', selectedParking);
}

/**
 * Load selected parking from LocalStorage if exists
 */
function loadSelectedParking() {
  const selectedParking = getFromLocalStorage('selectedParking', null);
  if (selectedParking) {
    console.log('Loaded previous parking selection:', selectedParking);
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
          // Restore all localStorage values correctly
          saveToLocalStorage('selectedLot', parkingData[selectedParking.lot].name);
          saveToLocalStorage('selectedSpot', spot.number);
          saveToLocalStorage('selectedSpotId', selectedParking.spotId);
          saveToLocalStorage('selectedLotId', selectedParking.lot);
          saveToLocalStorage('selectedOption', selectedParking.option || 'Solo');
        }
        spotCard.style.display = 'block';
      }
    }, 100);
  }
}

console.log('parking.js loaded successfully');
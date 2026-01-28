/**
 * ===================================
 * PARKING PAGE SCRIPT
 * ===================================
 * Handles:
 * - Parking lot grid UI generation
 * - Parking spot components with two halves
 * - Hover effects and color states
 * - Spot selection interactions
 */

// Current selected spot and lot
let currentSelectedSpot = null;
let currentSelectedLot = null;

// Sample parking data structure
const parkingData = {
  A: {
    name: 'Parking Lot A',
    totalSpots: 20,
    spots: [
      { id: 'A1', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A2', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A3', status: 'taken', day1: 'Mon', day2: 'Tue' },
      { id: 'A4', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A5', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A6', status: 'taken', day1: 'Mon', day2: 'Tue' },
      { id: 'A7', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A8', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A9', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A10', status: 'taken', day1: 'Mon', day2: 'Tue' },
      { id: 'A11', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A12', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A13', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A14', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A15', status: 'taken', day1: 'Mon', day2: 'Tue' },
      { id: 'A16', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A17', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A18', status: 'available', day1: 'Mon', day2: 'Tue' },
      { id: 'A19', status: 'taken', day1: 'Mon', day2: 'Tue' },
      { id: 'A20', status: 'available', day1: 'Mon', day2: 'Tue' },
    ]
  },
  B: {
    name: 'Parking Lot B',
    totalSpots: 20,
    spots: [
      { id: 'B1', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B2', status: 'taken', day1: 'Wed', day2: 'Thu' },
      { id: 'B3', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B4', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B5', status: 'taken', day1: 'Wed', day2: 'Thu' },
      { id: 'B6', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B7', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B8', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B9', status: 'taken', day1: 'Wed', day2: 'Thu' },
      { id: 'B10', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B11', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B12', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B13', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B14', status: 'taken', day1: 'Wed', day2: 'Thu' },
      { id: 'B15', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B16', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B17', status: 'taken', day1: 'Wed', day2: 'Thu' },
      { id: 'B18', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B19', status: 'available', day1: 'Wed', day2: 'Thu' },
      { id: 'B20', status: 'available', day1: 'Wed', day2: 'Thu' },
    ]
  },
  C: {
    name: 'Parking Lot C',
    totalSpots: 20,
    spots: [
      { id: 'C1', status: 'taken', day1: 'Fri', day2: 'Sat' },
      { id: 'C2', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C3', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C4', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C5', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C6', status: 'taken', day1: 'Fri', day2: 'Sat' },
      { id: 'C7', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C8', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C9', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C10', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C11', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C12', status: 'taken', day1: 'Fri', day2: 'Sat' },
      { id: 'C13', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C14', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C15', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C16', status: 'taken', day1: 'Fri', day2: 'Sat' },
      { id: 'C17', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C18', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C19', status: 'available', day1: 'Fri', day2: 'Sat' },
      { id: 'C20', status: 'available', day1: 'Fri', day2: 'Sat' },
    ]
  }
};

document.addEventListener('DOMContentLoaded', function () {
  // Initialize parking page
  initializeParkingPage();
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

  // Load first lot by default
  switchLot('A');
}

/**
 * Switch to a different parking lot
 * @param {string} lotId - Lot A, B, or C
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
 * @param {string} lotId - Lot A, B, or C
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
 * Create a parking spot element with two halves
 * @param {object} spot - Spot data
 * @returns {HTMLElement} - Parking spot element
 */
function createParkingSpot(spot) {
  const spotDiv = document.createElement('div');
  spotDiv.className = `parking-spot ${spot.status}`;
  spotDiv.dataset.spotId = spot.id;

  // Create left half (Day 1)
  const leftHalf = document.createElement('div');
  leftHalf.className = 'spot-half';
  leftHalf.innerHTML = `
    <div class="spot-half-content">
      <span class="spot-number">${spot.id}</span>
      <span class="spot-day">${spot.day1}</span>
    </div>
  `;
  
  // Add click listener only if spot is available
  if (spot.status === 'available') {
    leftHalf.addEventListener('click', function () {
      selectSpot(spot.id, spot);
    });
  }

  // Create right half (Day 2)
  const rightHalf = document.createElement('div');
  rightHalf.className = 'spot-half';
  rightHalf.innerHTML = `
    <div class="spot-half-content">
      <span class="spot-number">${spot.id}</span>
      <span class="spot-day">${spot.day2}</span>
    </div>
  `;

  // Add click listener only if spot is available
  if (spot.status === 'available') {
    rightHalf.addEventListener('click', function () {
      selectSpot(spot.id, spot);
    });
  }

  spotDiv.appendChild(leftHalf);
  spotDiv.appendChild(rightHalf);

  return spotDiv;
}

/**
 * Handle spot selection
 * @param {string} spotId - Spot ID (e.g., 'A1')
 * @param {object} spotData - Spot data object
 */
function selectSpot(spotId, spotData) {
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

  // Show selected spot card
  const spotCard = document.getElementById('selectedSpotCard');
  document.getElementById('selectedLot').textContent = parkingData[currentSelectedLot].name;
  document.getElementById('selectedSpot').textContent = spotId;
  spotCard.style.display = 'block';

  // Scroll to selection card
  spotCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

console.log('✓ parking.js loaded successfully');

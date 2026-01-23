/**
 * ===================================
 * PARKING PAGE SCRIPT
 * ===================================
 * Handles parking spot selection UI (will be functional in COMMIT 5)
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Parking page loaded - functionality coming in later commits');
  
  // Setup lot button listeners
  const lotButtons = document.querySelectorAll('.lot-btn');
  lotButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      console.log('Lot button clicked - switching to lot: ' + this.dataset.lot);
    });
  });
});

console.log('✓ parking.js loaded successfully');

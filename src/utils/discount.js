/**
 * Check if current date falls within discount periods
 * March 23-29, 2026 and April 3-5, 2026
 */
export function isDiscountActive() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (2 = March, 3 = April)
  const day = now.getDate();

  // March 23-29, 2026
  if (year === 2026 && month === 2 && day >= 23 && day <= 29) {
    return true;
  }

  // April 3-5, 2026
  if (year === 2026 && month === 3 && day >= 3 && day <= 5) {
    return true;
  }

  return false;
}

/**
 * Calculate discounted price (20% off)
 * Returns original price if discount not active or ticket is Connectors Pass
 */
export function calculateTicketPrice(ticketName, originalPrice) {
  // Connectors Pass excluded from discount
  if (ticketName === 'Connectors Pass') {
    return originalPrice;
  }

  // Apply 20% discount if active
  if (isDiscountActive()) {
    return originalPrice * 0.8; // 20% off
  }

  return originalPrice;
}

/**
 * Get discount percentage for display
 */
export function getDiscountPercentage(ticketName) {
  if (ticketName === 'Connectors Pass') {
    return 0;
  }
  return isDiscountActive() ? 20 : 0;
}
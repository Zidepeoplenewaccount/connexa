/**
 * Get affiliate code from URL or localStorage
 * Priority: URL parameter > localStorage
 */
export function getAffiliateCode() {
  // 1. Check URL first (highest priority)
  const params = new URLSearchParams(window.location.search);
  const urlRef = params.get('ref');
  
  if (urlRef) {
    // Store it for persistence (in case user bookmarks or shares)
    localStorage.setItem('affiliate_code', urlRef);
    return urlRef;
  }
  
  // 2. Fall back to stored code (if they came back later)
  return localStorage.getItem('affiliate_code') || null;
}

/**
 * Clear affiliate code (useful for testing or after purchase)
 */
export function clearAffiliateCode() {
  localStorage.removeItem('affiliate_code');
}
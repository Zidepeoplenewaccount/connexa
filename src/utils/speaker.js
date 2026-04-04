/**
 * Get speaker code from URL or localStorage
 * Priority: URL parameter > localStorage
 */
export function getSpeakerCode() {
  const params = new URLSearchParams(window.location.search);
  const urlCode = params.get('speaker');

  if (urlCode) {
    localStorage.setItem('speaker_code', urlCode);
    return urlCode;
  }

  return localStorage.getItem('speaker_code') || null;
}

/**
 * Clear speaker code
 */
export function clearSpeakerCode() {
  localStorage.removeItem('speaker_code');
}

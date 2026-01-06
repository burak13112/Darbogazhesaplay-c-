export const DAILY_LIMIT = 5;

// Simple hashing function (DJB2 algorithm)
const hashString = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
};

// Generates a unique fingerprint based on browser/device characteristics
// This persists even if cookies/local storage is cleared (the ID stays same, data is re-keyed)
// Note: In a pure frontend app, if they clear LocalStorage, the *count* is lost, 
// but we bind the key to this fingerprint to prevent simple cookie deletion from resetting it if storage remains.
const getDeviceFingerprint = (): string => {
  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    (navigator as any).hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
  ].join('|');

  return hashString(data);
};

const getStorageKey = () => {
  const fingerprint = getDeviceFingerprint();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `bn_limit_${fingerprint}_${today}`;
};

export const getDailyUsage = (): number => {
  try {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const incrementDailyUsage = (): number => {
  try {
    const key = getStorageKey();
    const current = getDailyUsage();
    const newVal = current + 1;
    localStorage.setItem(key, newVal.toString());
    return newVal;
  } catch (e) {
    return DAILY_LIMIT; // Fail safe
  }
};

export const hasRemainingRights = (): boolean => {
  return getDailyUsage() < DAILY_LIMIT;
};
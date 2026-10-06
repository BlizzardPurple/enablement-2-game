/**
 * DATABASE — the "correct" entries the player must match to.
 * Each has an id, display name, and region tag.
 */
export const DATABASE = [
  { id: 'spotify-us', name: 'Spotify US', region: 'US' },
  { id: 'spotify-fr', name: 'Spotify FR', region: 'FR' },
  { id: 'spotify-jp', name: 'Spotify JP', region: 'JP' },
  { id: 'spotify-br', name: 'Spotify BR', region: 'BR' },
  { id: 'facebook-us', name: 'Facebook US', region: 'US' },
  { id: 'facebook-latam', name: 'Facebook LATAM', region: 'LATAM' },
  { id: 'facebook-emea', name: 'Facebook EMEA', region: 'EMEA' },
  { id: 'youtube-global', name: 'YouTube Global', region: 'Global' },
  { id: 'youtube-jp', name: 'YouTube JP', region: 'JP' },
  { id: 'tiktok-us', name: 'TikTok US', region: 'US' },
  { id: 'tiktok-emea', name: 'TikTok EMEA', region: 'EMEA' },
  { id: 'tiktok-apac', name: 'TikTok APAC', region: 'APAC' },
  { id: 'snapchat-us', name: 'Snapchat US', region: 'US' },
  { id: 'snapchat-eu', name: 'Snapchat EU', region: 'EU' },
  { id: 'pinterest-global', name: 'Pinterest Global', region: 'Global' },
  { id: 'twitter-us', name: 'Twitter/X US', region: 'US' },
  { id: 'twitter-emea', name: 'Twitter/X EMEA', region: 'EMEA' },
  { id: 'hulu-us', name: 'Hulu US', region: 'US' },
  { id: 'amazon-us', name: 'Amazon Ads US', region: 'US' },
  { id: 'amazon-eu', name: 'Amazon Ads EU', region: 'EU' },
];

/**
 * BELT ITEMS — messy labels that appear on the conveyor belt.
 * Each maps to one correct DATABASE entry via `answerId`.
 * Labels are deliberately misspelled, wrong case, foreign, abbreviated.
 */
export const BELT_ITEMS = [
  // Spotify
  { label: 'spotfy music (音楽)', answerId: 'spotify-jp', difficulty: 2 },
  { label: 'SPOTIFY UNITED STATES', answerId: 'spotify-us', difficulty: 1 },
  { label: 'Sptify Franc', answerId: 'spotify-fr', difficulty: 2 },
  { label: 'spotify_brasil_ad', answerId: 'spotify-br', difficulty: 1 },
  { label: 'スポティファイ JP', answerId: 'spotify-jp', difficulty: 3 },
  { label: 'spot1fy US region', answerId: 'spotify-us', difficulty: 2 },

  // Facebook
  { label: 'FACE BOOK united states', answerId: 'facebook-us', difficulty: 1 },
  { label: 'fb latam region ads', answerId: 'facebook-latam', difficulty: 2 },
  { label: 'facebook_EMEA_display', answerId: 'facebook-emea', difficulty: 1 },
  { label: 'FaceBook LatAm', answerId: 'facebook-latam', difficulty: 1 },
  { label: 'fcebook us mobile', answerId: 'facebook-us', difficulty: 2 },

  // YouTube
  { label: 'u-tube global', answerId: 'youtube-global', difficulty: 2 },
  { label: 'UTUBE_GLOBAL_PREROLL', answerId: 'youtube-global', difficulty: 2 },
  { label: 'ユーチューブ日本', answerId: 'youtube-jp', difficulty: 3 },
  { label: 'youtube glbal video', answerId: 'youtube-global', difficulty: 1 },
  { label: 'YT japan region', answerId: 'youtube-jp', difficulty: 1 },

  // TikTok
  { label: 'tiktok emea region', answerId: 'tiktok-emea', difficulty: 1 },
  { label: 'TIK TOK US Mobile', answerId: 'tiktok-us', difficulty: 1 },
  { label: 'tik_tok_apac_video', answerId: 'tiktok-apac', difficulty: 1 },
  { label: 'ティックトック APAC', answerId: 'tiktok-apac', difficulty: 3 },
  { label: 'tikktok US display', answerId: 'tiktok-us', difficulty: 2 },

  // Snapchat
  { label: 'SNAP CHAT U.S.', answerId: 'snapchat-us', difficulty: 1 },
  { label: 'snapcht europe', answerId: 'snapchat-eu', difficulty: 2 },
  { label: 'snap_us_stories', answerId: 'snapchat-us', difficulty: 1 },

  // Pinterest
  { label: 'PINTREST global', answerId: 'pinterest-global', difficulty: 2 },
  { label: 'pinterest_glbl_pins', answerId: 'pinterest-global', difficulty: 1 },

  // Twitter/X
  { label: 'X (twitter) US', answerId: 'twitter-us', difficulty: 1 },
  { label: 'twiter EMEA promoted', answerId: 'twitter-emea', difficulty: 2 },
  { label: 'twitter_us_video', answerId: 'twitter-us', difficulty: 1 },

  // Hulu
  { label: 'HULU united states OTT', answerId: 'hulu-us', difficulty: 1 },
  { label: 'hlu US streaming', answerId: 'hulu-us', difficulty: 2 },

  // Amazon
  { label: 'amzn ads US', answerId: 'amazon-us', difficulty: 2 },
  { label: 'AMAZON ADS europe', answerId: 'amazon-eu', difficulty: 1 },
  { label: 'amazn_eu_display', answerId: 'amazon-eu', difficulty: 2 },
];

/**
 * POWERUPS — available during Phase 2.
 */
export const POWERUPS = [
  {
    id: 'freeze',
    name: 'Belt Freeze',
    desc: 'Stops the conveyor for 5 seconds',
    icon: '❄️',
    duration: 5000,
  },
  {
    id: 'autosuggest',
    name: 'Auto-Suggest',
    desc: 'Shows the correct answer after 3 characters',
    icon: '🔍',
    duration: 15000,
  },
  {
    id: 'clear',
    name: 'Clear Belt',
    desc: 'Removes all items from the belt',
    icon: '💨',
    duration: 0,
  },
  {
    id: 'slowmo',
    name: 'Easy Mode',
    desc: 'Belt slows to half speed for 5 seconds',
    icon: '🐢',
    duration: 5000,
  },
];

/**
 * SCORING constants
 */
export const SCORING = {
  CORRECT: 100,
  SPEED_BONUS: 50,         // matched within 3s
  SPEED_THRESHOLD: 3000,   // ms
  STREAK_BONUS: 25,        // per consecutive correct
  WRONG_PENALTY: -50,
  DROP_PENALTY: -75,
  TIME_BONUS_MULTIPLIER: 10, // remaining seconds × this
};

/**
 * PHASE CONFIG
 */
export const PHASES = {
  TUTORIAL: { duration: 15000, beltSpeed: 12, spawnRate: 4000 },
  MANUAL:  { duration: 30000, beltSpeed: 8,  spawnRate: 3000 },
  POWERUP: { duration: 25000, beltSpeed: 6,  spawnRate: 2500 },
  E2:      { duration: 20000, beltSpeed: 5,  spawnRate: 2000 },
};

/** Utility: pick N random items from the belt pool, no immediate repeats */
export function pickBeltItems(count, maxDifficulty = 3) {
  const pool = BELT_ITEMS.filter(i => i.difficulty <= maxDifficulty);
  const result = [];
  let lastId = null;
  for (let i = 0; i < count; i++) {
    const filtered = pool.filter(p => p.answerId !== lastId);
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    result.push({ ...pick, uid: `${Date.now()}-${i}-${Math.random()}` });
    lastId = pick.answerId;
  }
  return result;
}

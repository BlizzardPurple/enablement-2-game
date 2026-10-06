export const DATABASE = [
  { id: 'spotify-us', name: 'Spotify US', region: 'US' },
  { id: 'spotify-fr', name: 'Spotify FR', region: 'FR' },
  { id: 'spotify-jp', name: 'Spotify JP', region: 'JP' },
  { id: 'spotify-br', name: 'Spotify BR', region: 'BR' },
  { id: 'spotify-de', name: 'Spotify DE', region: 'DE' },
  { id: 'facebook-us', name: 'Facebook US', region: 'US' },
  { id: 'facebook-latam', name: 'Facebook LATAM', region: 'LATAM' },
  { id: 'facebook-emea', name: 'Facebook EMEA', region: 'EMEA' },
  { id: 'facebook-apac', name: 'Facebook APAC', region: 'APAC' },
  { id: 'youtube-global', name: 'YouTube Global', region: 'Global' },
  { id: 'youtube-jp', name: 'YouTube JP', region: 'JP' },
  { id: 'youtube-in', name: 'YouTube IN', region: 'IN' },
  { id: 'tiktok-us', name: 'TikTok US', region: 'US' },
  { id: 'tiktok-emea', name: 'TikTok EMEA', region: 'EMEA' },
  { id: 'tiktok-apac', name: 'TikTok APAC', region: 'APAC' },
  { id: 'tiktok-latam', name: 'TikTok LATAM', region: 'LATAM' },
  { id: 'snapchat-us', name: 'Snapchat US', region: 'US' },
  { id: 'snapchat-eu', name: 'Snapchat EU', region: 'EU' },
  { id: 'snapchat-mena', name: 'Snapchat MENA', region: 'MENA' },
  { id: 'pinterest-global', name: 'Pinterest Global', region: 'Global' },
  { id: 'twitter-us', name: 'Twitter/X US', region: 'US' },
  { id: 'twitter-emea', name: 'Twitter/X EMEA', region: 'EMEA' },
  { id: 'twitter-jp', name: 'Twitter/X JP', region: 'JP' },
  { id: 'hulu-us', name: 'Hulu US', region: 'US' },
  { id: 'amazon-us', name: 'Amazon Ads US', region: 'US' },
  { id: 'amazon-eu', name: 'Amazon Ads EU', region: 'EU' },
  { id: 'amazon-jp', name: 'Amazon Ads JP', region: 'JP' },
  { id: 'linkedin-global', name: 'LinkedIn Global', region: 'Global' },
  { id: 'reddit-us', name: 'Reddit US', region: 'US' },
  { id: 'twitch-global', name: 'Twitch Global', region: 'Global' },
  { id: 'roku-us', name: 'Roku US', region: 'US' },
  { id: 'peacock-us', name: 'Peacock US', region: 'US' },
  { id: 'disney-us', name: 'Disney+ US', region: 'US' },
  { id: 'disney-emea', name: 'Disney+ EMEA', region: 'EMEA' },
];
export const DB_LOOKUP = Object.fromEntries(DATABASE.map(d => [d.id, d.name]));

export const BELT_ITEMS = [
  { label:'spotfy music (音楽)', answerId:'spotify-jp', diff:3 },
  { label:'SPOTIFY UNITED STATES', answerId:'spotify-us', diff:1 },
  { label:'Sptify Franc', answerId:'spotify-fr', diff:2 },
  { label:'spotify_brasil_ad', answerId:'spotify-br', diff:1 },
  { label:'スポティファイ JP', answerId:'spotify-jp', diff:3 },
  { label:'spot1fy US region', answerId:'spotify-us', diff:2 },
  { label:'FACE BOOK united states', answerId:'facebook-us', diff:1 },
  { label:'fb latam region ads', answerId:'facebook-latam', diff:2 },
  { label:'facebook_EMEA_display', answerId:'facebook-emea', diff:1 },
  { label:'FaceBook LatAm', answerId:'facebook-latam', diff:1 },
  { label:'fcebook us mobile', answerId:'facebook-us', diff:2 },
  { label:'u-tube global', answerId:'youtube-global', diff:2 },
  { label:'UTUBE_GLOBAL_PREROLL', answerId:'youtube-global', diff:2 },
  { label:'ユーチューブ日本', answerId:'youtube-jp', diff:3 },
  { label:'youtube glbal video', answerId:'youtube-global', diff:1 },
  { label:'YT japan region', answerId:'youtube-jp', diff:1 },
  { label:'tiktok emea region', answerId:'tiktok-emea', diff:1 },
  { label:'TIK TOK US Mobile', answerId:'tiktok-us', diff:1 },
  { label:'tik_tok_apac_video', answerId:'tiktok-apac', diff:1 },
  { label:'ティックトック APAC', answerId:'tiktok-apac', diff:3 },
  { label:'tikktok US display', answerId:'tiktok-us', diff:2 },
  { label:'SNAP CHAT U.S.', answerId:'snapchat-us', diff:1 },
  { label:'snapcht europe', answerId:'snapchat-eu', diff:2 },
  { label:'PINTREST global', answerId:'pinterest-global', diff:2 },
  { label:'X (twitter) US', answerId:'twitter-us', diff:1 },
  { label:'twiter EMEA promoted', answerId:'twitter-emea', diff:2 },
  { label:'HULU united states OTT', answerId:'hulu-us', diff:1 },
  { label:'hlu US streaming', answerId:'hulu-us', diff:2 },
  { label:'amzn ads US', answerId:'amazon-us', diff:2 },
  { label:'AMAZON ADS europe', answerId:'amazon-eu', diff:1 },
  { label:'amazn_eu_display', answerId:'amazon-eu', diff:2 },
  { label:'spotify deutschland', answerId:'spotify-de', diff:2 },
  { label:'FB asia pacific', answerId:'facebook-apac', diff:2 },
  { label:'yt india video', answerId:'youtube-in', diff:1 },
  { label:'TIKTOK latin america', answerId:'tiktok-latam', diff:1 },
  { label:'snpchat middle east', answerId:'snapchat-mena', diff:2 },
  { label:'ツイッター日本', answerId:'twitter-jp', diff:3 },
  { label:'amzn japan ads', answerId:'amazon-jp', diff:2 },
  { label:'LINKEDIN glbl', answerId:'linkedin-global', diff:2 },
  { label:'redddit US ads', answerId:'reddit-us', diff:2 },
  { label:'TWITCH glbal stream', answerId:'twitch-global', diff:1 },
  { label:'roku united states', answerId:'roku-us', diff:1 },
  { label:'PEACOK US streaming', answerId:'peacock-us', diff:2 },
  { label:'disneyplus US ott', answerId:'disney-us', diff:1 },
  { label:'disney+ EMEA region', answerId:'disney-emea', diff:1 },
];

export const POWERUPS = [
  { id:'shield', name:'Shield', iconId:'shield', dur:8000 },
  { id:'time', name:'+5 Seconds', iconId:'time', dur:0 },
  { id:'bonus', name:'+500 Score', iconId:'bonus', dur:0 },
  { id:'slow', name:'Slow Motion', iconId:'slow', dur:5000 },
];

export const SCORE = {
  BASE:100, SPEED:50, SPEED_MS:2500, STREAK:25,
  WRONG:-50, DROP:-75, POWERUP:200, E2_BASE:50,
};
export const POWERUP_CHANCE = 0.3;

export function pickItem(maxDiff=2, elapsed=0, isE2=false) {
  const pool = BELT_ITEMS.filter(i=>i.diff<=maxDiff);
  const pick = pool[Math.floor(Math.random()*pool.length)];
  // No powerups before 10s or during E2
  const canPU = elapsed >= 10000 && !isE2;
  const isPU = canPU && Math.random() < POWERUP_CHANCE;
  const pu = isPU ? POWERUPS[Math.floor(Math.random()*POWERUPS.length)] : null;
  return { ...pick, uid:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`, belt:1, spawnTime:Date.now(), beltEntryTime:Date.now(), status:'active', powerup:pu };
}

// API Configuration for different environments
const DEV_API_URL = 'https://apidigibook.duckdns.org'
const PROD_API_URL = 'https://apidigibook.duckdns.org' // Update this when you have HTTPS in production

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL

// Timeout configurations
export const API_TIMEOUT = 15000 // 15 seconds

// For debugging API calls in development
export const DEBUG_API = __DEV__

// Alternative: If your server supports HTTPS, use this instead
// export const API_BASE_URL = 'https://194.233.67.229:3000'

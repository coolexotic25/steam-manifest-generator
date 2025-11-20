const axios = require('axios');

/**
 * Fetches Steam app details from the Steam Store API
 * @param {number} appId - The Steam App ID
 * @returns {Promise<Object>} - App details object or default data if API fails
 */
async function getSteamAppDetails(appId) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    
    const data = response.data;
    
    if (!data[appId] || !data[appId].success) {
      console.warn(`Steam API returned no data for App ID: ${appId}`);
      return getDefaultAppData(appId);
    }
    
    const appData = data[appId].data;
    
    return {
      appId: appId,
      name: appData.name || `Unknown App ${appId}`,
      type: appData.type || 'game',
      developer: appData.developer ? appData.developer[0] : 'Unknown Developer',
      publisher: appData.publisher ? appData.publisher[0] : 'Unknown Publisher',
      releaseDate: appData.release_date ? appData.release_date.date : 'Unknown Date',
      genres: appData.genres ? appData.genres.map(g => g.description) : [],
      platforms: appData.platforms || { windows: true, mac: false, linux: false },
      categories: appData.categories ? appData.categories.map(c => c.description) : [],
      headerImage: appData.header_image || '',
      background: appData.background || '',
      shortDescription: appData.short_description || '',
      supportedLanguages: appData.supported_languages || 'English',
      isFree: appData.is_free || false,
      priceOverview: appData.price_overview || null,
      requirements: appData.pc_requirements || { minimum: '', recommended: '' }
    };
    
  } catch (error) {
    console.error(`Error fetching Steam app details for App ID ${appId}:`, error.message);
    return getDefaultAppData(appId);
  }
}

/**
 * Returns default app data when API fails
 * @param {number} appId - The Steam App ID
 * @returns {Object} - Default app data structure
 */
function getDefaultAppData(appId) {
  return {
    appId: appId,
    name: `Unknown App ${appId}`,
    type: 'game',
    developer: 'Unknown Developer',
    publisher: 'Unknown Publisher',
    releaseDate: 'Unknown Date',
    genres: [],
    platforms: { windows: true, mac: false, linux: false },
    categories: [],
    headerImage: '',
    background: '',
    shortDescription: '',
    supportedLanguages: 'English',
    isFree: false,
    priceOverview: null,
    requirements: { minimum: '', recommended: '' }
  };
}

/**
 * Validates if a Steam App ID is in the correct format
 * @param {string|number} appId - The App ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateAppId(appId) {
  const id = parseInt(appId);
  return !isNaN(id) && id > 0 && id < 10000000;
}

/**
 * Generates a random manifest ID for Steam manifests
 * @returns {string} - Random manifest ID
 */
function generateManifestId() {
  return Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
}

/**
 * Generates a random build ID for Steam manifests
 * @returns {string} - Random build ID
 */
function generateBuildId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

module.exports = {
  getSteamAppDetails,
  validateAppId,
  generateManifestId,
  generateBuildId
};
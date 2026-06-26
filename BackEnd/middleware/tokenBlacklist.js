const NodeCache = require('node-cache');

// TTL = 30 days (matches JWT expiry so tokens auto-expire from blacklist)
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

const blacklistCache = new NodeCache({ stdTTL: THIRTY_DAYS_IN_SECONDS });

module.exports = blacklistCache;

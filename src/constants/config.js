// Fetch Error
export const FetchException     = 'Failed Fetch'
// Processing
export const processGlobalLevel = 'global'
export const processAllLevel    = 'all'

const config = {
  FetchException,
  processGlobalLevel, processAllLevel,
  mode   : 'Production',
  IP_API : 'http://api.ipify.org',
  UTC_API: 'http://www.timeapi.org/utc/now.json'
}

if (process.env.NODE_ENV === 'development') {
  config.mode = 'Development'
  config.IP_API = 'https://api.ipify.org'
}


export default config;

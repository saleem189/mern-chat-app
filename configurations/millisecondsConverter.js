/**
 * Parses time string to milliseconds.
 * @param {string} timeString - A string representation of time with a unit suffix (e.g. '1s' for one second).
 * @returns {number} The equivalent time value in milliseconds.
 */
const parseTimeToMilliseconds = (timeString)=> {
    // Map of time unit suffixes to conversion factors in milliseconds.
    const timeUnitMap = {
      s: 1000, // seconds
      m: 60000, // minutes (60 seconds)
      d: 86400000, // days (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      y: 31536000000 // years (365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    };
  
    // Extract value and unit from time string.
    const value = parseInt(timeString);
    const unit = timeString.slice(-1); // Get the last character of the string.
  
    // Convert value to milliseconds using the unit conversion factor.
    if (!isNaN(value) && unit in timeUnitMap) {
      const conversionFactor = timeUnitMap[unit];
      return value * conversionFactor;
    }
  
    // Return NaN for invalid time strings.
    return NaN;
  }
  module.exports =  {parseTimeToMilliseconds};
  
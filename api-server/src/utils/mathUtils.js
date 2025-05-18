/**
 * Calculate standard deviation of an array of numbers
 * @param {Array<number>} values - Array of numbers
 * @returns {number} - Standard deviation
 */
const calculateStandardDeviation = (values) => {
  // Check if the array is empty or has only one element
  if (!values || values.length <= 1) {
    return 0;
  }

  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Calculate sum of squared differences from mean
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, val) => sum + val, 0);

  // Calculate variance and standard deviation
  const variance = sumSquaredDiffs / values.length;
  const stdDev = Math.sqrt(variance);

  // Return standard deviation rounded to 2 decimal places
  return parseFloat(stdDev.toFixed(2));
};

module.exports = {
  calculateStandardDeviation
};
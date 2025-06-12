const fs = require('fs');

/**
 * Reads data from a JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @returns {any} The parsed JSON data.
 */
function readData(filePath) {
  const fileContent = fs.readFileSync(filePath);
  return JSON.parse(fileContent);
}

/**
 * Writes data to a JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @param {any} data - The data to write to the file.
 */
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData,
};

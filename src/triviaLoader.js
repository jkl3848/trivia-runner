const Ajv = require("ajv");
const { triviaSchema } = require("./triviaSchema");
const fs = require("fs").promises;
const path = require("path");

const ajv = new Ajv();
const validate = ajv.compile(triviaSchema);

/**
 * Validates trivia data against the schema
 * @param {Object} data - The trivia data to validate
 * @returns {Object} - { valid: boolean, errors: array }
 */
function validateTriviaData(data) {
  const valid = validate(data);
  return {
    valid,
    errors: validate.errors || [],
  };
}

/**
 * Loads and validates a trivia file
 * @param {string} filePath - Path to the trivia JSON file
 * @returns {Promise<Object>} - { success: boolean, data?: object, error?: string }
 */
async function loadTriviaFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const validation = validateTriviaData(data);

    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid trivia file format: ${JSON.stringify(validation.errors)}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load trivia file: ${error.message}`,
    };
  }
}

/**
 * Gets all trivia files from the trivia_configs directory
 * @param {string} baseDir - Base directory of the app
 * @returns {Promise<string[]>} - Array of trivia file paths
 */
async function getTriviaFiles(baseDir) {
  try {
    const triviaDir = path.join(baseDir, "trivia_configs");
    const files = await fs.readdir(triviaDir);

    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.join(triviaDir, file));
  } catch (error) {
    console.error("Error reading trivia directory:", error);
    return [];
  }
}

module.exports = {
  validateTriviaData,
  loadTriviaFile,
  getTriviaFiles,
};

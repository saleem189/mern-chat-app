const Validator = require("validator");
const isEmpty = require("is-empty");

/**
 * Validates registration input data
 * @param {object} data - Registration data to be validated
 * @param {string} data.name - User's name
 * @param {string} data.email - User's email
 * @param {string} data.password - User's password
 * @param {string} data.password2 - Confirmation of user's password
 * @returns {object} Object containing errors and a boolean indicating if the input is valid
 */
module.exports = function validateRegisterInput(data) {
  // Initialize errors object
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.body = !isEmpty(data.name) ? data.name : "";

  // Name checks
  if (Validator.isEmpty(data.body)) {
    errors.name = "Cannot send Empty message please type something you want to send";
  }

  // Return errors object and a boolean indicating if the input is valid
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
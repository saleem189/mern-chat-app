const Validator = require("validator");
const isEmpty = require("is-empty");
/**
 * Validates login input data
 * @param {object} data - The data containing email and password fields to be validated
 * @returns {object} The errors object and a boolean indicating if the data is valid
 */
module.exports = function validateLoginInput(data) {
  // Initialize errors object
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // Return errors object and isValid boolean
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
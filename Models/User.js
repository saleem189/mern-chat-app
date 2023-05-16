const mongoose = require("mongoose");

// Get the Mongoose Schema class
const Schema = mongoose.Schema;

/**
 * Mongoose schema for a user model.
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
    
  }
}, { 
  // Add timestamps to the schema
  timestamps: true
});

// Create a Mongoose model from the schema
const User = mongoose.model("users", UserSchema);

// Export the model for use in other parts of the application
module.exports = User;

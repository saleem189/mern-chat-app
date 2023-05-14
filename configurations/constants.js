/**
 * Constants used in application and getting assigned from environment.
 * and if not present, default values are used.
 */

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME || '1m';
const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '1d';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chat_app';
const REDIS_CLIENT_URL = process.env.REDIS_CLIENT_URL || 'redis://127.0.0.1:6379';
const SERVER_PORT = process.env.SERVER_PORT || 5000;

module.exports = {
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  MONGO_URI, 
  REDIS_CLIENT_URL,
  SERVER_PORT
};
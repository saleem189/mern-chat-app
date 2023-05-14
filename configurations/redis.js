const redis = require('redis');
const {REDIS_CLIENT_URL} = require('../configurations/constants');

// Create Redis client with specified URL
const client = redis.createClient({
  url: REDIS_CLIENT_URL,
});

// Log error if Redis client encounters an error
client.on('error', err => console.log('Redis Client Error', err));

/**
 * Redis client for caching and storing data
 * @typedef {Object} RedisClient
 * @property {function} get - Retrieves the value of a key
 * @property {function} set - Sets the value of a key
 * @property {function} disconnect - Disconnects from the Redis server
 */

/**
 * @type {RedisClient}
 */
module.exports = client;

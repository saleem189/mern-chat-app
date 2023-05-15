const redis = require('redis');
const {REDIS_CLIENT_URL} = require('../configurations/constants');

/**
 * @type {RedisClient}
 */

// Create Redis client with specified URL
const RedisClient = redis.createClient({
  url: REDIS_CLIENT_URL,
});

// Log error if Redis client encounters an error
RedisClient.on('error', err => console.log('Redis Client Error', err));

/**
 * Sets a value to Redis.
 * @param {Object} options - The options object.
 * @param {string} options.key - The Redis key.
 * @param {*} options.value - The value to set.
 * @param {string} options.timeType - The time type.
 * @param {number} options.time - The time value.
 */
const setValueToRedis = async ({ key, value, timeType, time }) => {
  // Set the value to Redis
  await RedisClient.set(key, value, timeType, time);
}

/**
 * Gets the value from Redis for the given key
 *
 * @async
 * @function getValueFromRedis
 * @param {Object} options - The options object
 * @param {string} options.key - The key to get the value for
 * @returns {Promise<string>} - A promise that resolves with the value for the given key
 */
const getValueFromRedis = async ({ key }) => {
  // Call the Redis client's get method with the given key and return the result
  return await RedisClient.get(key);
}



module.exports = {RedisClient, setValueToRedis, getValueFromRedis};

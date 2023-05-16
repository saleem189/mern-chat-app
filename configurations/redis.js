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
RedisClient.on('connect', () => console.log('Redis Connected'));
RedisClient.on('ready', () => console.log('Redis Client connected and ready to use')); 
RedisClient.on('end', () => console.log('Redis Client disconnected from Redis'));  
process.on('SIGINT', () => RedisClient.quit());
/**
 * Sets a value to Redis.
 * @param {Object} options - The options object.
 * @param {string} options.key - The Redis key.
 * @param {*} options.value - The value to set.
 * @param {string} options.timeType - The time type.
 * @param {number} options.time - The time value.
 */
const setValueToRedis = async ({ key, value ,timeType ,time}) => {
  // Set the value to Redis
  return await RedisClient.set(key, value, timeType, time, (err, reply) => {
    if(err) {
      throw err; //reject(res.status(500).json({status:false, message: err.message})) return; only when used in promises
    }else{
      return reply;
    }
  });
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
   const value = await RedisClient.get(key);
   return value;
}

const delValueFromRedis = async ({ key }) => {
  await RedisClient.del(key);
}



module.exports = {RedisClient, setValueToRedis, getValueFromRedis, delValueFromRedis};

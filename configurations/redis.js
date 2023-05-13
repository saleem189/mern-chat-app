const redis = require('redis');
const {REDIS_CLIENT_URL} = require('../configurations/constants');

const client = redis.createClient({
    url: REDIS_CLIENT_URL,
});

client.on('error', err => console.log('Redis Client Error', err));
// client.on('connect', () => console.log('Connected to Redis'));

// await client.connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();
module.exports = client;
/**
 * Constants used in application and getting assigned from environment.
 * and if not present, default values are used.
 */

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME || '5m';
const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '1d';
let MONGO_URI ; // = `${process.env.DATABASE_CONNECTION}://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` || 'mongodb://127.0.0.1:27017/chat_app';
const REDIS_CLIENT_URL = `${process.env.CACHE_DRIVER}://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` || 'redis://127.0.0.1:6379';
const SERVER_PORT = process.env.SERVER_PORT || 5000;


if(process.env.DATABASE_USER ==='' || process.env.DATABASE_PASS ===''){
  MONGO_URI = `${process.env.DATABASE_CONNECTION}://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` || 'mongodb://127.0.0.1:27017/chat_app';
}else{
  MONGO_URI = `${process.env.DATABASE_CONNECTION}://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` || 'mongodb://127.0.0.1:27017/chat_app';
}
module.exports = {
  JWT_SECRET_KEY,
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  MONGO_URI, 
  REDIS_CLIENT_URL,
  SERVER_PORT
};
// mongodb://saleem_chat_app:password@localhost:27017/?authMechanism=DEFAULT&authSource=chat_app
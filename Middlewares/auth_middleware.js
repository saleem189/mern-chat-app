 
const errorLogger = (request, response, next) => {
    (request.header('Content-Type') === "application/json") ? (console.log(request.body), next()) : response.status(400).json({status:false,message:"Content-Type must be application/json Or it is not provided"});
}
module.exports = errorLogger;
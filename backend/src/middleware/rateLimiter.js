import rateLimit from "../config/upstash.js"; // for rate limiting


const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json({ 
                message: "Too many requests, please try again later",

             });
        }
        next();

    } catch (error) {
        console.log("Rate Limiter Error:", error);
        next(error);
    }  
    };

    export default rateLimiter;

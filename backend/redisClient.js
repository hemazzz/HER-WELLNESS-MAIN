import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config(); // load env

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    console.log(`🔁 Redis retry attempt: ${times}`);
    return Math.min(times * 100, 3000); // max 3 sec delay
  },
  maxRetriesPerRequest: 3
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;
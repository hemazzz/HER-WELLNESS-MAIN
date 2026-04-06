import redis from "./redisClient.js";

async function testRedis() {
  try {
    await redis.set("testKey", "hello da");

    const value = await redis.get("testKey");

    console.log("✅ Redis Value:", value);

    process.exit(0);
  } catch (err) {
    console.error("❌ Redis Error:", err);
    process.exit(1);
  }
}

testRedis();
import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL);

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error("Redis error:", err));

export default client;

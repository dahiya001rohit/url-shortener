import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { processClick } from "./analytics.js";

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on("error", (err) => console.error("BullMQ Redis error:", err.message));

export const analyticsQueue = new Queue("analytics", { connection });

const worker = new Worker("analytics", processClick, { connection });
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err.message));

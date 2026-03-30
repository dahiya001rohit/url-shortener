import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { processClick } from "./analytics.js";

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const analyticsQueue = new Queue("analytics", {connection});

new Worker("analytics", processClick, {connection});

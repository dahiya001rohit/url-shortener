import { Queue } from "bullmq";
import client from "./redis.js";

export const analyticsQueue = new Queue("analytics", { connection: client });

// lib/edge-redis.ts
import { Redis } from "@upstash/redis";

const edgeRedis = Redis.fromEnv();

export default edgeRedis;
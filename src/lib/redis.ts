
import Redis from 'ioredis';

const REDIS_CONNECTION_URL = 
  process.env.REDIS_URL || 
  process.env.UPSTASH_REDIS_URL; 

let redis: Redis;

if (REDIS_CONNECTION_URL) {
  redis = new Redis(REDIS_CONNECTION_URL);
  console.log("Redis client initialized using URL.");
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1', 
    port: parseInt(process.env.REDIS_PORT || '6379', 10), 
    password: process.env.REDIS_PASSWORD || undefined, 
  });
  console.log("Redis client initialized using host/port/password fallback.");
}

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

redis.ping().then(() => {
  console.log("Redis connected successfully!");
}).catch((err) => {
  console.warn("Could not connect to Redis:", err.message);
});

export default redis;
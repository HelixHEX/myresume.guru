import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const POLAR_CUSTOMER_ID_KV = {
  generateKey(userId: string) {
    const length = process.env.URL?.split(".").length || 0
    const checkEnv = length > 2 ? process.env.URL?.split(".")[0] : ""
    const env = process.env.URL === 'http://localhost:3000' ? 'dev:' : process.env.URL === 'https://myresume.guru' ? 'main:' : `${checkEnv?.substring(8, checkEnv.length)}:`
    const key = `${env}user:${userId}:polar-customer-id`
    console.log('[POLAR][KV STORE]', key)
    return key
  },
  async get(userId: string) {
    const key = this.generateKey(userId)
    console.log('[POLAR][KV GET]', key)
    console.log('[POLAR][REDIST', await redis.get(key))
    return await redis.get(key)
  },
  async set(userId: string, customerId: string) {
    const key = this.generateKey(userId)
    console.log('[POLAR][KV SET]', key)
    return await redis.set(key, customerId)
  }
}
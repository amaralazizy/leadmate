// Redis-based rate limiting service for WhatsApp messages
// Handles both per-number and global rate limits using Upstash Redis

import { Redis } from "@upstash/redis";

interface RateLimitData {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number;
  reason?: string;
}

// Initialize Redis client (using Upstash Redis for serverless)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

class RedisRateLimiter {
  // Configuration
  private readonly PER_NUMBER_LIMIT = 3;
  private readonly GLOBAL_LIMIT = 20;
  private readonly WINDOW_SECONDS = 60 * 60; // 1 hour

  /**
   * Check if a request should be rate limited using Redis
   * @param targetNumber The WhatsApp number receiving messages (e.g., "+12182503154")
   * @param fromNumber The WhatsApp number sending the message
   * @returns RateLimitResult indicating if request is allowed
   */
  async checkRateLimit(
    targetNumber: string,
    fromNumber: string
  ): Promise<RateLimitResult> {
    try {
      const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
      const window =
        Math.floor(now / this.WINDOW_SECONDS) * this.WINDOW_SECONDS;

      // Redis keys for rate limiting
      const perNumberKey = `rate_limit:${targetNumber}:${fromNumber}:${window}`;
      const globalKey = `rate_limit:${targetNumber}:global:${window}`;
      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline();

      // Get current counts
      pipeline.get(perNumberKey);
      pipeline.get(globalKey);

      const results = await pipeline.exec();
      const perNumberCount = (results[0] as number) || 0;
      const globalCount = (results[1] as number) || 0;

      // Check per-number limit
      if (perNumberCount >= this.PER_NUMBER_LIMIT) {
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: Date.now() + this.WINDOW_SECONDS * 1000 , // Convert back to milliseconds
          reason: `Rate limit exceeded: Maximum ${this.PER_NUMBER_LIMIT} messages per hour from the same number`,
        };
      }

      // Check global limit
      if (globalCount >= this.GLOBAL_LIMIT) {
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: (window + this.WINDOW_SECONDS) * 1000,
          reason: `Rate limit exceeded: Maximum ${this.GLOBAL_LIMIT} messages per hour for this number`,
        };
      }

      // Both checks passed, increment counters atomically
      const incrementPipeline = redis.pipeline();

      // Increment per-number counter
      incrementPipeline.incr(perNumberKey);
      incrementPipeline.expire(perNumberKey, this.WINDOW_SECONDS);

      // Increment global counter
      incrementPipeline.incr(globalKey);
      incrementPipeline.expire(globalKey, this.WINDOW_SECONDS);

      await incrementPipeline.exec();

      return {
        allowed: true,
        remainingRequests: Math.min(
          this.PER_NUMBER_LIMIT - perNumberCount - 1,
          this.GLOBAL_LIMIT - globalCount - 1
        ),
        resetTime: (window + this.WINDOW_SECONDS) * 1000,
      };
    } catch (error) {
      console.error("Redis rate limiting error:", error);
      // Fallback: allow request but log error
      return {
        allowed: true,
        remainingRequests: 0,
        resetTime: Date.now() + this.WINDOW_SECONDS * 1000,
        reason: "Rate limiting service error - request allowed",
      };
    }
  }

  /**
   * Get current rate limit status without consuming a request
   */
  async getRateLimitStatus(
    targetNumber: string,
    fromNumber: string
  ): Promise<RateLimitResult> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const window =
        Math.floor(now / this.WINDOW_SECONDS) * this.WINDOW_SECONDS;

      const perNumberKey = `rate_limit:${targetNumber}:${fromNumber}:${window}`;
      const globalKey = `rate_limit:${targetNumber}:global:${window}`;

      const pipeline = redis.pipeline();
      pipeline.get(perNumberKey);
      pipeline.get(globalKey);

      const results = await pipeline.exec();
      const perNumberCount = (results[0] as number) || 0;
      const globalCount = (results[1] as number) || 0;

      const perNumberRemaining = Math.max(
        0,
        this.PER_NUMBER_LIMIT - perNumberCount
      );
      const globalRemaining = Math.max(0, this.GLOBAL_LIMIT - globalCount);

      const isAllowed = perNumberRemaining > 0 && globalRemaining > 0;

      return {
        allowed: isAllowed,
        remainingRequests: Math.min(perNumberRemaining, globalRemaining),
        resetTime: (window + this.WINDOW_SECONDS) * 1000,
        reason: !isAllowed ? "Rate limit would be exceeded" : undefined,
      };
    } catch (error) {
      console.error("Redis rate limit status error:", error);
      return {
        allowed: true,
        remainingRequests: 0,
        resetTime: Date.now() + this.WINDOW_SECONDS * 1000,
        reason: "Rate limiting service error",
      };
    }
  }

  /**
   * Reset rate limits for a specific target number (admin function)
   */
  async resetLimits(
    targetNumber: string,
    fromNumber?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const window =
        Math.floor(now / this.WINDOW_SECONDS) * this.WINDOW_SECONDS;

      if (fromNumber) {
        // Reset specific sender
        const perNumberKey = `rate_limit:${targetNumber}:${fromNumber}:${window}`;
        await redis.del(perNumberKey);

        return {
          success: true,
          message: `Rate limits reset for ${targetNumber} from sender ${fromNumber}`,
        };
      } else {
        // Reset all limits for target number - need to find all keys
        const pattern = `rate_limit:${targetNumber}:*`;
        const keys = await redis.keys(pattern);

        if (keys.length > 0) {
          await redis.del(...keys);
        }

        return {
          success: true,
          message: `Rate limits reset for ${targetNumber} (all senders) - ${keys.length} keys deleted`,
        };
      }
    } catch (error) {
      console.error("Redis rate limit reset error:", error);
      return {
        success: false,
        message: "Failed to reset rate limits",
      };
    }
  }

  /**
   * Get detailed statistics for monitoring
   */
  async getStatistics(targetNumber: string): Promise<{
    currentWindow: number;
    globalCount: number;
    perNumberCounts: Record<string, number>;
    resetTime: number;
  }> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const window =
        Math.floor(now / this.WINDOW_SECONDS) * this.WINDOW_SECONDS;

      // Get global count
      const globalKey = `rate_limit:${targetNumber}:global:${window}`;
      const globalCount = (await redis.get(globalKey)) || 0;

      // Get all per-number counts for this target
      const pattern = `rate_limit:${targetNumber}:*:${window}`;
      const keys = await redis.keys(pattern);

      const perNumberCounts: Record<string, number> = {};

      if (keys.length > 0) {
        const pipeline = redis.pipeline();
        keys.forEach((key: string) => pipeline.get(key));
        const results = await pipeline.exec();

        keys.forEach((key: string, index: number) => {
          // Extract phone number from key: rate_limit:targetNumber:fromNumber:window
          const parts = key.split(":");
          if (parts.length >= 4 && parts[2] !== "global") {
            const fromNumber = parts[2];
            perNumberCounts[fromNumber] = (results[index] as number) || 0;
          }
        });
      }

      return {
        currentWindow: window,
        globalCount: globalCount as number,
        perNumberCounts,
        resetTime: (window + this.WINDOW_SECONDS) * 1000,
      };
    } catch (error) {
      console.error("Redis statistics error:", error);
      return {
        currentWindow: 0,
        globalCount: 0,
        perNumberCounts: {},
        resetTime: Date.now() + this.WINDOW_SECONDS * 1000,
      };
    }
  }

  /**
   * Test Redis connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testKey = "rate_limit_test";
      const testValue = "hello";

      // Set a test key
      await redis.set(testKey, testValue, { ex: 10 }); // Expire in 10 seconds

      // Get the test key back
      const result = await redis.get(testKey);

      if (result === testValue) {
        // Clean up
        await redis.del(testKey);

        return {
          success: true,
          message: "Redis connection successful",
        };
      } else {
        return {
          success: false,
          message: "Redis connection failed - value mismatch",
        };
      }
    } catch (error) {
      console.error("Redis connection test error:", error);
      return {
        success: false,
        message: `Redis connection failed: ${error}`,
      };
    }
  }
}

// Create singleton instance
const redisRateLimiter = new RedisRateLimiter();

/**
 * Server action to check rate limits for WhatsApp messages using Redis
 * @param targetNumber The WhatsApp number receiving messages
 * @param fromNumber The WhatsApp number sending the message
 * @returns Promise<RateLimitResult>
 */
export async function checkWhatsAppRateLimit(
  targetNumber: string,
  fromNumber: string
): Promise<RateLimitResult> {
  try {
    // Normalize phone numbers (remove any prefixes like "whatsapp:")
    const cleanTargetNumber = targetNumber.replace(/^whatsapp:/, "");
    const cleanFromNumber = fromNumber.replace(/^whatsapp:/, "");

    return await redisRateLimiter.checkRateLimit(
      cleanTargetNumber,
      cleanFromNumber
    );
  } catch (error) {
    console.error("Rate limiting error:", error);
    // In case of error, allow the request but log the issue
    return {
      allowed: true,
      remainingRequests: 0,
      resetTime: Date.now() + 60 * 60 * 1000, // 1 hour from now
      reason: "Rate limiting service error - request allowed",
    };
  }
}

/**
 * Get current rate limit status without consuming a request
 * @param targetNumber The WhatsApp number receiving messages
 * @param fromNumber The WhatsApp number sending the message
 * @returns Promise<RateLimitResult>
 */
export async function getWhatsAppRateLimitStatus(
  targetNumber: string,
  fromNumber: string
): Promise<RateLimitResult> {
  try {
    const cleanTargetNumber = targetNumber.replace(/^whatsapp:/, "");
    const cleanFromNumber = fromNumber.replace(/^whatsapp:/, "");

    return await redisRateLimiter.getRateLimitStatus(
      cleanTargetNumber,
      cleanFromNumber
    );
  } catch (error) {
    console.error("Rate limiting status error:", error);
    return {
      allowed: true,
      remainingRequests: 0,
      resetTime: Date.now() + 60 * 60 * 1000,
      reason: "Rate limiting service error",
    };
  }
}

/**
 * Admin function to reset rate limits
 * @param targetNumber The WhatsApp number to reset limits for
 * @param fromNumber Optional specific sender to reset (if not provided, resets all)
 */
export async function resetWhatsAppRateLimit(
  targetNumber: string,
  fromNumber?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanTargetNumber = targetNumber.replace(/^whatsapp:/, "");
    const cleanFromNumber = fromNumber?.replace(/^whatsapp:/, "");

    return await redisRateLimiter.resetLimits(
      cleanTargetNumber,
      cleanFromNumber
    );
  } catch (error) {
    console.error("Rate limit reset error:", error);
    return {
      success: false,
      message: "Failed to reset rate limits",
    };
  }
}

/**
 * Get detailed rate limiting statistics
 * @param targetNumber The WhatsApp number to get stats for
 */
export async function getWhatsAppRateLimitStatistics(targetNumber: string) {
  try {
    const cleanTargetNumber = targetNumber.replace(/^whatsapp:/, "");
    return await redisRateLimiter.getStatistics(cleanTargetNumber);
  } catch (error) {
    console.error("Rate limit statistics error:", error);
    return {
      currentWindow: 0,
      globalCount: 0,
      perNumberCounts: {},
      resetTime: Date.now() + 60 * 60 * 1000,
    };
  }
}

/**
 * Test Redis connection
 */
export async function testRedisConnection() {
  return await redisRateLimiter.testConnection();
}

export { redisRateLimiter };

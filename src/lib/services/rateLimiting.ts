// Rate limiting service for WhatsApp messages
// Handles both per-number and global rate limits

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

class RateLimiter {
  private perNumberLimits: Map<string, RateLimitData> = new Map();
  private globalLimits: Map<string, RateLimitData> = new Map();

  // Configuration
  private readonly PER_NUMBER_LIMIT = 3;
  private readonly GLOBAL_LIMIT = 20;
  private readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Check if a request should be rate limited
   * @param targetNumber The WhatsApp number receiving messages (e.g., "+12182503154")
   * @param fromNumber The WhatsApp number sending the message
   * @returns RateLimitResult indicating if request is allowed
   */
  checkRateLimit(targetNumber: string, fromNumber: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    // Clean up expired entries first
    this.cleanupExpiredEntries(now);

    // Check per-number rate limit
    const perNumberKey = `${targetNumber}:${fromNumber}`;
    const perNumberResult = this.checkLimit(
      this.perNumberLimits,
      perNumberKey,
      this.PER_NUMBER_LIMIT,
      now,
      windowStart
    );

    if (!perNumberResult.allowed) {
      return {
        ...perNumberResult,
        reason: `Rate limit exceeded: Maximum ${this.PER_NUMBER_LIMIT} messages per hour from the same number`,
      };
    }

    // Check global rate limit for the target number
    const globalKey = targetNumber;
    const globalResult = this.checkLimit(
      this.globalLimits,
      globalKey,
      this.GLOBAL_LIMIT,
      now,
      windowStart
    );

    if (!globalResult.allowed) {
      return {
        ...globalResult,
        reason: `Rate limit exceeded: Maximum ${this.GLOBAL_LIMIT} messages per hour for this number`,
      };
    }

    // Both checks passed, increment counters
    this.incrementCounter(this.perNumberLimits, perNumberKey, now);
    this.incrementCounter(this.globalLimits, globalKey, now);

    return {
      allowed: true,
      remainingRequests: Math.min(
        this.PER_NUMBER_LIMIT -
          (this.perNumberLimits.get(perNumberKey)?.count || 0),
        this.GLOBAL_LIMIT - (this.globalLimits.get(globalKey)?.count || 0)
      ),
      resetTime: now + this.WINDOW_MS,
    };
  }

  /**
   * Check rate limit for a specific key and limit
   */
  private checkLimit(
    limitMap: Map<string, RateLimitData>,
    key: string,
    limit: number,
    now: number,
    windowStart: number
  ): RateLimitResult {
    const existing = limitMap.get(key);

    if (!existing) {
      // No existing data, request is allowed
      return {
        allowed: true,
        remainingRequests: limit - 1,
        resetTime: now + this.WINDOW_MS,
      };
    }

    // Check if the window has expired
    if (existing.resetTime <= now) {
      // Window expired, reset and allow
      return {
        allowed: true,
        remainingRequests: limit - 1,
        resetTime: now + this.WINDOW_MS,
      };
    }

    // Check if limit is exceeded
    if (existing.count >= limit) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: existing.resetTime,
      };
    }

    // Request is allowed
    return {
      allowed: true,
      remainingRequests: limit - existing.count - 1,
      resetTime: existing.resetTime,
    };
  }

  /**
   * Increment counter for a specific key
   */
  private incrementCounter(
    limitMap: Map<string, RateLimitData>,
    key: string,
    now: number
  ) {
    const existing = limitMap.get(key);

    if (!existing || existing.resetTime <= now) {
      // Create new or reset expired entry
      limitMap.set(key, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
    } else {
      // Increment existing counter
      limitMap.set(key, {
        count: existing.count + 1,
        resetTime: existing.resetTime,
      });
    }
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanupExpiredEntries(now: number) {
    // Clean per-number limits
    for (const [key, data] of this.perNumberLimits.entries()) {
      if (data.resetTime <= now) {
        this.perNumberLimits.delete(key);
      }
    }

    // Clean global limits
    for (const [key, data] of this.globalLimits.entries()) {
      if (data.resetTime <= now) {
        this.globalLimits.delete(key);
      }
    }
  }

  /**
   * Get current rate limit status without incrementing counters
   */
  getRateLimitStatus(
    targetNumber: string,
    fromNumber: string
  ): RateLimitResult {
    const now = Date.now();
    this.cleanupExpiredEntries(now);

    const perNumberKey = `${targetNumber}:${fromNumber}`;
    const globalKey = targetNumber;

    const perNumberData = this.perNumberLimits.get(perNumberKey);
    const globalData = this.globalLimits.get(globalKey);

    const perNumberRemaining = perNumberData
      ? Math.max(0, this.PER_NUMBER_LIMIT - perNumberData.count)
      : this.PER_NUMBER_LIMIT;

    const globalRemaining = globalData
      ? Math.max(0, this.GLOBAL_LIMIT - globalData.count)
      : this.GLOBAL_LIMIT;

    const isAllowed = perNumberRemaining > 0 && globalRemaining > 0;
    const nextResetTime = Math.max(
      perNumberData?.resetTime || now,
      globalData?.resetTime || now
    );

    return {
      allowed: isAllowed,
      remainingRequests: Math.min(perNumberRemaining, globalRemaining),
      resetTime: nextResetTime,
      reason: !isAllowed ? "Rate limit would be exceeded" : undefined,
    };
  }

  /**
   * Reset rate limits for a specific target number (admin function)
   */
  resetLimits(targetNumber: string, fromNumber?: string) {
    if (fromNumber) {
      // Reset specific sender
      const perNumberKey = `${targetNumber}:${fromNumber}`;
      this.perNumberLimits.delete(perNumberKey);
    } else {
      // Reset all limits for target number
      const globalKey = targetNumber;
      this.globalLimits.delete(globalKey);

      // Reset all per-number limits for this target
      for (const key of this.perNumberLimits.keys()) {
        if (key.startsWith(`${targetNumber}:`)) {
          this.perNumberLimits.delete(key);
        }
      }
    }
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

/**
 * Server action to check rate limits for WhatsApp messages
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

    return rateLimiter.checkRateLimit(cleanTargetNumber, cleanFromNumber);
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

    return rateLimiter.getRateLimitStatus(cleanTargetNumber, cleanFromNumber);
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

    rateLimiter.resetLimits(cleanTargetNumber, cleanFromNumber);

    const resetScope = fromNumber
      ? `for sender ${cleanFromNumber}`
      : "for all senders";

    return {
      success: true,
      message: `Rate limits reset for ${cleanTargetNumber} ${resetScope}`,
    };
  } catch (error) {
    console.error("Rate limit reset error:", error);
    return {
      success: false,
      message: "Failed to reset rate limits",
    };
  }
}

export { rateLimiter };

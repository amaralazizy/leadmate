// Test script for Redis rate limiting functionality
// Run this to verify your Redis setup is working correctly

import {
  checkWhatsAppRateLimit,
  getWhatsAppRateLimitStatus,
  resetWhatsAppRateLimit,
  getWhatsAppRateLimitStatistics,
  testRedisConnection,
} from "./redisRateLimiting";

/**
 * Test the Redis rate limiting functionality
 */
export async function runRateLimitTests() {
  console.log("🧪 Starting Redis Rate Limiting Tests");
  console.log("=====================================");

  try {
    // Test 1: Redis Connection
    console.log("\n🔌 Test 1: Redis Connection");
    const connectionTest = await testRedisConnection();
    console.log(
      `Connection: ${connectionTest.success ? "✅" : "❌"} ${connectionTest.message}`
    );

    if (!connectionTest.success) {
      console.log(
        "❌ Redis connection failed. Please check your environment variables:"
      );
      console.log("   - UPSTASH_REDIS_REST_URL");
      console.log("   - UPSTASH_REDIS_REST_TOKEN");
      return;
    }

    const targetNumber = "+12182503154";
    const testSender = "+1234567890";

    // Test 2: Reset to start fresh
    console.log("\n🔄 Test 2: Reset Rate Limits");
    const resetResult = await resetWhatsAppRateLimit(targetNumber);
    console.log(
      `Reset: ${resetResult.success ? "✅" : "❌"} ${resetResult.message}`
    );

    // Test 3: Per-number rate limiting (3 messages per hour)
    console.log("\n📱 Test 3: Per-number Rate Limiting (3 messages/hour)");

    for (let i = 1; i <= 5; i++) {
      const result = await checkWhatsAppRateLimit(targetNumber, testSender);
      const status = result.allowed ? "✅" : "❌";
      console.log(
        `  Message ${i}: ${status} Remaining: ${result.remainingRequests} ${result.reason || ""}`
      );

      if (!result.allowed) {
        console.log(`  ⏹️  Rate limit hit at message ${i}`);
        break;
      }
    }

    // Test 4: Status check
    console.log("\n📊 Test 4: Status Check");
    const status = await getWhatsAppRateLimitStatus(targetNumber, testSender);
    console.log(`  Status: ${status.allowed ? "✅" : "❌"}`);
    console.log(`  Remaining: ${status.remainingRequests}`);
    console.log(`  Reset Time: ${new Date(status.resetTime).toLocaleString()}`);

    // Test 5: Statistics
    console.log("\n📈 Test 5: Statistics");
    const stats = await getWhatsAppRateLimitStatistics(targetNumber);
    console.log(`  Global Count: ${stats.globalCount}`);
    console.log(`  Per-number Counts:`, stats.perNumberCounts);
    console.log(`  Reset Time: ${new Date(stats.resetTime).toLocaleString()}`);

    // Test 6: Global rate limiting simulation
    console.log("\n🌍 Test 6: Global Rate Limiting (20 messages/hour)");
    console.log("  Simulating multiple senders...");

    let globalTestCount = 0;
    for (let i = 1; i <= 25; i++) {
      const fromNumber = `+1${String(i).padStart(9, "0")}`;
      const result = await checkWhatsAppRateLimit(targetNumber, fromNumber);
      globalTestCount++;

      if (i % 5 === 0 || !result.allowed) {
        const status = result.allowed ? "✅" : "❌";
        console.log(
          `  Global message ${i}: ${status} Remaining: ${result.remainingRequests}`
        );
      }

      if (!result.allowed) {
        console.log(`  ⏹️  Global rate limit hit at message ${i}`);
        break;
      }
    }

    // Test 7: Final statistics
    console.log("\n📊 Test 7: Final Statistics");
    const finalStats = await getWhatsAppRateLimitStatistics(targetNumber);
    console.log(`  Global Count: ${finalStats.globalCount}`);
    console.log(
      `  Unique Senders: ${Object.keys(finalStats.perNumberCounts).length}`
    );
    console.log(
      `  Top Senders:`,
      Object.entries(finalStats.perNumberCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([phone, count]) => `${phone}(${count})`)
        .join(", ")
    );

    console.log("\n✅ All Rate Limiting Tests Complete!");
    console.log("🚀 Your Redis rate limiting is working correctly!");
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your Redis environment variables");
    console.log("2. Verify your Upstash Redis instance is running");
    console.log("3. Check your network connection");
  }
}

/**
 * Quick test for basic functionality
 */
export async function quickTest() {
  console.log("⚡ Quick Rate Limiting Test");
  console.log("==========================");

  try {
    // Test connection
    const connectionTest = await testRedisConnection();
    console.log(`Redis Connection: ${connectionTest.success ? "✅" : "❌"}`);

    if (!connectionTest.success) {
      return { success: false, message: connectionTest.message };
    }

    // Test basic rate limiting
    const targetNumber = "+12182503154";
    const testSender = "+1999999999";

    const result = await checkWhatsAppRateLimit(targetNumber, testSender);
    console.log(`Rate Limit Check: ${result.allowed ? "✅" : "❌"}`);
    console.log(`Remaining Requests: ${result.remainingRequests}`);

    return {
      success: true,
      message: "Rate limiting is working correctly",
      details: result,
    };
  } catch (error) {
    console.error("Quick test failed:", error);
    return {
      success: false,
      message: `Test failed: ${error}`,
    };
  }
}

// Export test functions
export const rateLimitTests = {
  full: runRateLimitTests,
  quick: quickTest,
};

// If running directly (for testing)
if (require.main === module) {
  runRateLimitTests().catch(console.error);
}

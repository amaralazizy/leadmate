# 🚀 Redis Rate Limiting Setup Guide

The rate limiting system uses **Upstash Redis** for serverless-friendly rate limiting that works properly on Vercel and other serverless platforms.

## 🎯 Why Redis Rate Limiting?

### **❌ Problems with In-Memory Rate Limiting:**

- **Serverless Functions**: Each request may hit a different function instance
- **Memory Loss**: Data is lost when functions go cold
- **No Persistence**: Restarts clear all rate limiting data
- **Scaling Issues**: Multiple instances don't share state

### **✅ Benefits of Redis Rate Limiting:**

- **Persistent Storage**: Data survives function restarts
- **Shared State**: All instances use the same Redis database
- **Atomic Operations**: Thread-safe increment operations
- **Automatic Expiry**: Keys expire automatically after the time window
- **High Performance**: Sub-millisecond response times

## 📋 Setup Instructions

### **1. Install Dependencies**

First, make sure you have the Redis client installed:

```bash
npm install @upstash/redis
```

### **2. Create Upstash Redis Database**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up/login with your account
3. Click "Create Database"
4. Choose:
   - **Name**: `reply-pro-rate-limiting`
   - **Region**: Choose closest to your users
   - **Type**: Pay as you go (free tier available)
5. Click "Create"

### **2. Get Connection Details**

After creating the database:

1. Go to your database dashboard
2. Copy the **REST URL** and **REST TOKEN**
3. These will look like:
   ```
   REST URL: https://us1-xxx-xxx.upstash.io
   REST TOKEN: AXXXxxx...
   ```

### **3. Add Environment Variables**

Add these to your `.env.local` file:

```env
# Redis Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://us1-xxx-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
```

### **4. Add to Vercel Environment Variables**

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add both variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Deploy your project

### **5. Install Dependencies**

The Redis client is already included in the project. If you need to install it manually:

```bash
npm install @upstash/redis
```

## 🔧 Configuration

### **Rate Limiting Rules** (Configurable in `redisRateLimiting.ts`):

```typescript
// Current configuration
private readonly PER_NUMBER_LIMIT = 3;        // 3 messages per hour per sender
private readonly GLOBAL_LIMIT = 20;           // 20 messages per hour total
private readonly WINDOW_SECONDS = 60 * 60;    // 1 hour window
```

### **Target Numbers**

Currently configured for: `+12182503154`

You can modify the webhook to apply rate limiting to other numbers by updating the condition in `webhooks/whatsapp/route.ts`:

```typescript
// Apply rate limiting to multiple numbers
const rateLimitedNumbers = ["+12182503154", "+1234567890"];
if (rateLimitedNumbers.includes(businessPhone)) {
  // Rate limiting logic
}
```

## 📊 Monitoring & Management

### **Check Rate Limit Status**

```bash
# Test Redis connection
GET /api/admin/rate-limits?action=test

# Check specific sender status
GET /api/admin/rate-limits?targetNumber=+12182503154&fromNumber=+1234567890

# Get overall statistics
GET /api/admin/rate-limits?targetNumber=+12182503154&action=stats
```

### **Reset Rate Limits**

```bash
# Reset specific sender
POST /api/admin/rate-limits
{
  "targetNumber": "+12182503154",
  "fromNumber": "+1234567890"
}

# Reset all senders
DELETE /api/admin/rate-limits?targetNumber=+12182503154
```

### **Example API Responses**

**Status Check:**

```json
{
  "success": true,
  "data": {
    "targetNumber": "+12182503154",
    "fromNumber": "+1234567890",
    "allowed": true,
    "remainingRequests": 2,
    "resetTime": 1703123456000,
    "resetTimeFormatted": "2023-12-20T15:30:56.000Z"
  }
}
```

**Statistics:**

```json
{
  "success": true,
  "data": {
    "targetNumber": "+12182503154",
    "currentWindow": 1703120000,
    "globalCount": 15,
    "perNumberCounts": {
      "+1234567890": 3,
      "+1987654321": 2,
      "+1555123456": 1
    },
    "resetTime": 1703123600000,
    "resetTimeFormatted": "2023-12-20T16:00:00.000Z"
  }
}
```

## 🔍 How It Works

### **Redis Key Structure**

```
rate_limit:{targetNumber}:{fromNumber}:{window}     # Per-number counter
rate_limit:{targetNumber}:global:{window}          # Global counter
```

### **Time Windows**

- Uses **fixed time windows** (hourly)
- Window calculated as: `Math.floor(timestamp / 3600) * 3600`
- Keys automatically expire after the window ends

### **Atomic Operations**

1. **Check**: Get current counts for both per-number and global limits
2. **Validate**: Ensure neither limit is exceeded
3. **Increment**: Atomically increment both counters using Redis pipeline
4. **Expire**: Set TTL on keys to auto-cleanup

## 🚨 Troubleshooting

### **Rate Limiting Not Working**

1. ✅ Check environment variables are set correctly
2. ✅ Verify Redis connection in Upstash dashboard
3. ✅ Check Vercel deployment logs for Redis errors
4. ✅ Test API endpoints directly

### **Redis Connection Errors**

```bash
# Test Redis connection
curl -X GET "https://your-app.vercel.app/api/admin/rate-limits?targetNumber=+12182503154&action=stats"
```

### **High Redis Usage**

- Each message creates 2 Redis operations (per-number + global)
- Keys auto-expire after 1 hour
- Monitor usage in Upstash dashboard
- Consider upgrading plan if needed

## 💰 Pricing

### **Upstash Redis Pricing** (as of 2024):

- **Free Tier**: 10,000 requests/day
- **Pay-as-you-go**: $0.2 per 100K requests
- **Pro Plans**: Starting at $10/month

### **Estimated Usage**:

- **Per Message**: 4 Redis operations (2 read + 2 write)
- **100 messages/day**: ~400 Redis operations
- **Monthly**: ~12,000 operations (well within free tier)

## 🔐 Security

- ✅ **Environment Variables**: Credentials stored securely
- ✅ **HTTPS Only**: All Redis communication encrypted
- ✅ **Access Control**: Only your application can access Redis
- ✅ **Key Expiry**: Automatic cleanup prevents data accumulation
- ✅ **Error Handling**: Graceful fallbacks if Redis is unavailable

## 📈 Scaling

The Redis rate limiting system scales automatically:

- **Serverless**: Works with unlimited function instances
- **Global**: Single source of truth across all regions
- **Fast**: Sub-millisecond response times
- **Reliable**: 99.99% uptime SLA from Upstash

Your rate limiting will now work perfectly in production! 🚀

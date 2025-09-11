# 🚀 Vercel Free Tier Setup Guide

## Overview

Optimized setup for Vercel Free Tier limitations:

- **10-second function timeout**
- **No built-in cron jobs**
- **Limited concurrent executions**

## 🔧 Vercel-Optimized Changes

### **Small Batch Processing**

- Processes **3-5 conversations max** per function call
- Stays well under 10-second timeout
- Returns `hasMore: true` when more conversations need processing

### **Multiple Trigger Options**

Choose the approach that works best for you:

## 🎯 **Option 1: External Cron Service (Recommended)**

### **Free External Cron Services:**

1. **cron-job.org** (free, reliable)
2. **EasyCron** (free tier: 20 jobs)
3. **GitHub Actions** (if you have a repo)

### **Setup Example (cron-job.org):**

```bash
URL: https://yourapp.vercel.app/api/leads/batch-process
Method: POST
Headers: Authorization: Bearer YOUR_TOKEN
Interval: Every 10 minutes
```

### **Handling Multiple Batches:**

The external cron can call multiple times if `hasMore: true`:

```javascript
// Example GitHub Action workflow
async function processBatches() {
  let hasMore = true;
  let totalProcessed = 0;

  while (hasMore) {
    const response = await fetch("/api/leads/batch-process");
    const result = await response.json();

    totalProcessed += result.processed;
    hasMore = result.hasMore;

    if (hasMore) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s between batches
    }
  }

  console.log(`Total processed: ${totalProcessed}`);
}
```

## 🎯 **Option 2: GitHub Actions (Free)**

Create `.github/workflows/lead-extraction.yml`:

```yaml
name: Lead Extraction
on:
  schedule:
    - cron: "*/10 * * * *" # Every 10 minutes

jobs:
  extract-leads:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Batch Processing
        run: |
          RESPONSE=$(curl -s -X POST "https://yourapp.vercel.app/api/leads/batch-process" \
            -H "Authorization: Bearer ${{ secrets.BATCH_TOKEN }}" \
            -H "Content-Type: application/json")

          echo "Response: $RESPONSE"

          # Check if more batches needed
          HAS_MORE=$(echo $RESPONSE | jq -r '.hasMore')

          while [ "$HAS_MORE" = "true" ]; do
            sleep 5
            RESPONSE=$(curl -s -X POST "https://yourapp.vercel.app/api/leads/batch-process" \
              -H "Authorization: Bearer ${{ secrets.BATCH_TOKEN }}")
            HAS_MORE=$(echo $RESPONSE | jq -r '.hasMore')
            echo "Batch response: $RESPONSE"
          done
```

## 🎯 **Option 3: Hybrid Approach**

For critical conversations, add **smart real-time extraction**:

```typescript
// In webhook - only for high-value patterns
const isHighValue =
  messageBody.length > 100 ||
  messageBody.includes("$") ||
  /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(messageBody);

if (isHighValue) {
  // Quick extraction for obvious leads
  await processLeadExtraction(conversationId, userId, true);
}
```

## ⚡ **API Response Format**

Your batch endpoint now returns:

```json
{
  "success": true,
  "processed": 3,
  "hasMore": true,
  "message": "Processed 3 conversations (more pending)",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 🔍 **Monitoring**

### **Function Duration Tracking**

```typescript
// Already built into scheduledLeadProcessing()
const duration = Date.now() - startTime;
console.log(`📊 Batch processed in ${duration}ms`);
```

### **Health Check**

```bash
GET https://yourapp.vercel.app/api/leads/batch-process

# Should respond quickly (< 100ms)
{
  "status": "ok",
  "service": "Lead Batch Processing",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 📊 **Vercel Free Tier Limits**

| Resource                  | Limit       | Our Usage       |
| ------------------------- | ----------- | --------------- |
| **Function Timeout**      | 10 seconds  | ~2-3 seconds ✅ |
| **Bandwidth**             | 100GB/month | Minimal ✅      |
| **Function Invocations**  | 1000/day    | ~144/day ✅     |
| **Concurrent Executions** | Limited     | 1 at a time ✅  |

## 🚨 **Troubleshooting**

### **Timeout Issues**

If still getting timeouts:

1. Reduce batch size to 1-2 conversations
2. Check your LLM API response times
3. Consider simpler extraction prompts

### **Missing Conversations**

If conversations aren't being processed:

1. Check `hasMore: true` responses
2. Verify external cron is calling multiple times
3. Monitor conversation `metadata->extractionCompleted`

### **Rate Limiting**

If hitting API limits:

1. Increase delay between batch calls
2. Reduce batch frequency (every 15 minutes)
3. Optimize LLM calls

## 💡 **Cost Optimization**

With Vercel Free + our system:

- **Vercel**: Free
- **External Cron**: Free (cron-job.org)
- **LLM Calls**: ~$1-3/month
- **Total**: **~$1-3/month** 🎉

Your time-based extraction is perfect for Vercel Free - just needs small batches and external scheduling!

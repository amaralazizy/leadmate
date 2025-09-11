# ⏱️ Time-Based Lead Extraction System

## Overview

Simple, language-agnostic lead extraction that processes conversations based on timing rules instead of complex pattern matching.

## 🎯 How It Works

### **Time-Based Rules**

Lead extraction happens when:

1. **10 minutes of inactivity** - conversation likely ended
2. **30 minutes from first message** - safety timeout for long conversations
3. **Only once per conversation** - no duplicate processing

### **Benefits**

✅ **Language-agnostic** - works in Arabic, English, any language
✅ **Cost-efficient** - ~1 extraction per conversation
✅ **Simpler** - just timestamps, no pattern matching
✅ **More reliable** - comprehensive conversation analysis

## 💰 Cost Comparison

| Approach              | LLM Calls            | Monthly Cost (1000 msgs) |
| --------------------- | -------------------- | ------------------------ |
| **Old Pattern-Based** | ~0.6 per message     | ~600 calls ($6-12)       |
| **New Time-Based**    | ~1 per conversation  | ~150 calls ($1-3)        |
| **Savings**           | **75-80% reduction** | **$5-10 savings**        |

## 🔄 Process Flow

```
Customer sends message 1 → Create basic lead + start timer
Customer sends message 2,3,4... → Just respond, no extraction
⏱️  10 minutes pass with no reply → Extract complete lead info
OR
⏱️  30 minutes since start → Extract complete lead info (safety net)
```

## 🚀 Setup

### 1. Cron Job (Required)

Set up to run every 5-10 minutes:

```bash
# Example cron job (every 10 minutes)
*/10 * * * * curl -X POST "https://yourapp.com/api/leads/batch-process" -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Environment Variables

```bash
BATCH_PROCESSING_TOKEN=your_secure_token_here
```

### 3. Monitor Logs

Watch for:

- `🔄 Starting time-based lead processing`
- `✅ Time-based extraction completed for conversation X (inactivity/timeout)`
- `🎯 Time-based extraction complete: X processed, Y errors`

## 📊 Database Changes

Uses existing schema, just adds metadata tracking:

```json
// conversations.metadata
{
  "extractionCompleted": true,
  "extractionAt": "2025-01-15T10:30:00Z"
}
```

## 🛠️ API Endpoints

### Batch Processing

```bash
POST /api/leads/batch-process
Authorization: Bearer YOUR_TOKEN

# Response
{
  "success": true,
  "message": "Batch processing completed",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Health Check

```bash
GET /api/leads/batch-process

# Response
{
  "status": "ok",
  "service": "Lead Batch Processing",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 🔧 Configuration

### Timing Adjustments

Edit `/lib/services/leads/triggers.ts`:

```typescript
// Rule 1: Inactivity threshold (default: 10 minutes)
if (timeSinceLastMessage >= 10) {
  // Change to 5, 15, or whatever works for your business
}

// Rule 2: Conversation timeout (default: 30 minutes)
if (timeSinceFirstMessage >= 30) {
  // Change to 15, 60, or whatever works for your business
}
```

## 📈 Expected Results

- **Fewer LLM calls**: ~75-80% reduction
- **Better quality**: Full conversation context analysis
- **Language support**: Works in any language
- **Simplified codebase**: No complex pattern matching
- **Reliable extraction**: Time-based triggers are predictable

## 🐛 Troubleshooting

### No Extractions Happening

1. Check cron job is running
2. Verify batch processing endpoint works: `GET /api/leads/batch-process`
3. Check for active conversations in database
4. Look for extraction logs

### Extractions Too Frequent/Infrequent

1. Adjust timing thresholds in `triggers.ts`
2. Check conversation `updated_at` timestamps
3. Verify extraction metadata is being saved

### Missing Lead Data

1. Time-based extraction gets full conversation context
2. Check if conversations are being marked as completed
3. Review extraction confidence thresholds

## 🎯 Migration Notes

If upgrading from pattern-based system:

1. Old extraction metadata will be ignored
2. Active conversations will be picked up by time-based rules
3. No data loss - just different trigger mechanism
4. Much simpler codebase maintenance

## 💡 Best Practices

1. **Run batch processing every 5-10 minutes** (not too frequent, not too slow)
2. **Monitor extraction rates** to tune timing thresholds
3. **Keep conversations active** until extraction is complete
4. **Use health check endpoint** to verify system is working
5. **Set up alerting** on batch processing failures

The time-based approach is much simpler, more reliable, and works across all languages while dramatically reducing costs.

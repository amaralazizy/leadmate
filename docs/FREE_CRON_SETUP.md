# 🕒 Free Cron Setup for Lead Extraction

## Overview

Step-by-step guide to set up **FREE** external cron jobs for your Vercel-hosted lead extraction system.

## 🎯 **Option 1: cron-job.org (Recommended)**

### **Why cron-job.org?**

- ✅ **Completely free**
- ✅ **No registration required for basic use**
- ✅ **Reliable uptime (99.9%+)**
- ✅ **Simple web interface**
- ✅ **Email notifications on failures**

### **Step-by-Step Setup:**

#### **1. Go to cron-job.org**

Visit: https://cron-job.org/en/

#### **2. Create Account (Optional but Recommended)**

- Click "Sign Up" in top right
- Use email/password or Google login
- Free account gives you better monitoring

#### **3. Create New Cron Job**

- Click **"Create cronjob"**
- Fill in the form:

```
Title: LeadMate Lead Extraction
URL: https://your-app-name.vercel.app/api/leads/batch-process
Schedule: */10 * * * * (Every 10 minutes)
```

#### **4. Advanced Settings**

Click "Advanced" and configure:

```
Request Method: POST
Request Headers:
  Authorization: Bearer your_secure_token_here
  Content-Type: application/json

Request Body: (leave empty)

Expected Status Code: 200
Timeout: 30 seconds
```

#### **5. Enable Notifications**

```
✅ Enable failure notifications
📧 Your email address
📱 Optional: SMS notifications (premium)
```

#### **6. Save & Activate**

- Click **"Create cronjob"**
- Toggle it **ON** in your dashboard

### **Your cron-job.org Dashboard:**

```
┌─────────────────────────────────────────────────────────┐
│ LeadMate Lead Extraction                      [ON] [EDIT]│
│ https://your-app.vercel.app/api/leads/batch-process     │
│ Every 10 minutes                                        │
│ Last run: 2 minutes ago ✅                             │
│ Next run: in 8 minutes                                 │
│ Success rate: 98.2% (last 24h)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 **Option 2: EasyCron (Alternative)**

### **Features:**

- ✅ **20 free cron jobs**
- ✅ **Web interface**
- ✅ **Email notifications**
- ✅ **Execution history**

### **Setup Steps:**

#### **1. Sign Up**

Visit: https://www.easycron.com/

- Click "Sign Up Free"
- Verify email

#### **2. Create Cron Job**

- Click **"+ Cron Job"**
- Configure:

```
URL: https://your-app.vercel.app/api/leads/batch-process
Cron Expression: */10 * * * *
HTTP Method: POST
HTTP Headers: Authorization: Bearer your_token_here
```

#### **3. Test & Enable**

- Click "Test" to verify it works
- Click "Enable" to start scheduling

---

## 🎯 **Option 3: GitHub Actions (For Developers)**

### **Requirements:**

- GitHub repository (free)
- Basic knowledge of Git

### **Setup Steps:**

#### **1. Create Workflow File**

In your repo, create `.github/workflows/lead-extraction.yml`:

```yaml
name: Lead Extraction Scheduler

on:
  schedule:
    # Every 10 minutes
    - cron: "*/10 * * * *"

  # Allow manual triggering
  workflow_dispatch:

jobs:
  extract-leads:
    runs-on: ubuntu-latest

    steps:
      - name: Call Lead Extraction API
        run: |
          echo "🔄 Starting lead extraction..."

          # Call your API
          RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            "https://your-app.vercel.app/api/leads/batch-process" \
            -H "Authorization: Bearer ${{ secrets.BATCH_TOKEN }}" \
            -H "Content-Type: application/json")

          # Extract HTTP status code
          HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
          BODY=$(echo "$RESPONSE" | head -n -1)

          echo "📊 Response: $BODY"
          echo "🔢 HTTP Code: $HTTP_CODE"

          # Check for success
          if [ "$HTTP_CODE" -eq 200 ]; then
            echo "✅ Lead extraction successful"
            
            # Check if more batches needed
            HAS_MORE=$(echo "$BODY" | jq -r '.hasMore // false')
            
            # Process additional batches if needed
            while [ "$HAS_MORE" = "true" ]; do
              echo "🔄 Processing additional batch..."
              sleep 5
              
              RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
                "https://your-app.vercel.app/api/leads/batch-process" \
                -H "Authorization: Bearer ${{ secrets.BATCH_TOKEN }}")
              
              HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
              BODY=$(echo "$RESPONSE" | head -n -1)
              
              if [ "$HTTP_CODE" -eq 200 ]; then
                HAS_MORE=$(echo "$BODY" | jq -r '.hasMore // false')
                echo "📊 Batch response: $BODY"
              else
                echo "❌ Batch failed with code: $HTTP_CODE"
                break
              fi
            done
            
          else
            echo "❌ Lead extraction failed with code: $HTTP_CODE"
            echo "📄 Response: $BODY"
            exit 1
          fi
```

#### **2. Add Secret**

In GitHub repo:

- Go to **Settings** → **Secrets and variables** → **Actions**
- Click **"New repository secret"**
- Name: `BATCH_TOKEN`
- Value: `your_secure_token_here`

#### **3. Test Workflow**

- Go to **Actions** tab
- Click **"Lead Extraction Scheduler"**
- Click **"Run workflow"** → **"Run workflow"** button
- Watch the logs to ensure it works

---

## 🔧 **Environment Setup**

### **1. Generate Secure Token**

```bash
# Generate a random token (Linux/Mac)
openssl rand -hex 32

# Or use online generator
# https://www.uuidgenerator.net/
```

### **2. Add to Your .env**

```bash
BATCH_PROCESSING_TOKEN=your_generated_token_here
```

### **3. Deploy to Vercel**

```bash
# Add environment variable in Vercel dashboard
# Project Settings → Environment Variables
# Or via CLI:
vercel env add BATCH_PROCESSING_TOKEN
```

---

## 📊 **Monitoring Your Cron Jobs**

### **Check Execution Status**

Your API returns useful info:

```json
{
  "success": true,
  "processed": 3,
  "hasMore": false,
  "message": "Processed 3 conversations"
}
```

### **Monitor in Vercel**

- Go to **Functions** tab in Vercel dashboard
- Check **batch-process** function logs
- Look for successful 200 responses

### **Email Alerts**

Most cron services send alerts on failures:

- ❌ HTTP errors (500, 404, timeout)
- ❌ Consecutive failures
- ✅ Service restored notifications

---

## 🚨 **Troubleshooting**

### **Cron Job Not Working**

1. **Check URL**: Ensure it's your exact Vercel domain
2. **Verify Token**: Copy-paste from your .env file
3. **Test Manually**: Use curl or Postman
4. **Check Logs**: Look in Vercel function logs

### **API Returning Errors**

```bash
# Test your endpoint manually
curl -X POST "https://your-app.vercel.app/api/leads/batch-process" \
     -H "Authorization: Bearer your_token" \
     -H "Content-Type: application/json"

# Should return:
{
  "success": true,
  "processed": 0,
  "hasMore": false,
  "message": "Processed 0 conversations"
}
```

### **High Failure Rate**

- **Vercel timeout**: Reduce batch size to 1-2 conversations
- **Database errors**: Check Supabase connection
- **LLM API issues**: Verify OpenRouter API key

---

## 💰 **Cost Summary**

| Service              | Cost   | Features                     |
| -------------------- | ------ | ---------------------------- |
| **cron-job.org**     | FREE   | Unlimited jobs, email alerts |
| **EasyCron**         | FREE   | 20 jobs, web interface       |
| **GitHub Actions**   | FREE   | 2000 minutes/month           |
| **Vercel Functions** | FREE   | 1000 invocations/day         |
| **Total**            | **$0** | Complete automation!         |

---

## ⚡ **Quick Start Checklist**

- [ ] 1. Choose cron service (recommend cron-job.org)
- [ ] 2. Generate secure token
- [ ] 3. Add token to Vercel environment variables
- [ ] 4. Create cron job pointing to your API
- [ ] 5. Test with manual trigger
- [ ] 6. Monitor for 24 hours
- [ ] 7. Set up failure notifications

**Total setup time: ~10 minutes**

Your lead extraction will now run automatically every 10 minutes, processing conversations that are ready based on timing rules - completely free!

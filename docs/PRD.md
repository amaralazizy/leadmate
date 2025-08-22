# 🔥 PRD — AI WhatsApp Bot SaaS (MVP)

**Goal:** Businesses connect their WhatsApp → customers chat with an **AI bot** trained on the business's menu/FAQ. The bot answers in natural language, captures leads, and forwards them to Google Sheets/email.

---

## 🎯 Core Objectives

1. **AI-Powered Chatbot**

   - Use **LLM (OpenAI GPT-4 or Claude)** with RAG (Retrieval-Augmented Generation)
   - Business FAQ/Menu uploaded → stored as embeddings → retrieved on every query
   - Natural conversation flow with intelligent lead capture

2. **Lead Capture & CRM Sync**

   - AI recognizes customer intent (order, booking, inquiry) naturally
   - Extracts structured lead info (name, phone, request details)
   - Auto-export to Google Sheets + email digest

3. **Plug-and-Play Onboarding**
   - <10 min to connect WhatsApp + upload FAQ/Menu

---

## 🛠 Technical Architecture

### **Tech Stack**

- **Frontend & Backend:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL + Vector embeddings)
- **Authentication:** Supabase Auth
- **AI Service:** OpenAI GPT-4 or Anthropic Claude
- **WhatsApp:** Twilio WhatsApp Business API
- **Payments:** Stripe
- **Deployment:** Vercel

### **Database Schema**

```sql
- users: Business accounts with subscription info
- knowledge_base: FAQ/Menu content with vector embeddings
- conversations: Chat sessions with customers
- messages: Individual messages within conversations
- leads: Captured customer inquiries with structured data
- integrations: Google Sheets/email connection configs
- system_logs: For debugging and monitoring
```

### **Core API Endpoints**

- `POST /api/webhook/whatsapp` - Receive WhatsApp messages
- `POST /api/knowledge` - Upload and process FAQ/menu
- `GET /api/conversations` - Fetch chat history
- `POST /api/chat/test` - Test bot responses
- `GET/POST /api/leads` - Manage captured leads
- `POST /api/integrations/google-sheets` - Sync lead data

---

## 🎨 Features

### **Frontend (Next.js + Tailwind)**

- **Authentication** (Supabase Auth - email/password signup)
- **Onboarding Wizard**

  - Step 1: Enter business details (name, type, WhatsApp number)
  - Step 2: Upload FAQ/Menu (text file or copy-paste)
  - Step 3: Test bot with sample questions

- **Dashboard**
  - Live chat preview (see how bot responds)
  - FAQ/Menu editor (CRUD operations)
  - Leads table with export to CSV
  - Google Sheets integration setup
  - Usage tracking (messages used/quota)
  - Subscription management (Stripe)

### **Backend (Next.js API Routes + Supabase)**

#### **AI Engine Implementation**

1. **Knowledge Processing:**

   ```typescript
   // Upload FAQ/Menu → Generate embeddings → Store in Supabase
   const embedding = await openai.embeddings.create({
     model: "text-embedding-3-small",
     input: content,
   });
   ```

2. **RAG Pipeline:**

   ```typescript
   // For each customer message:
   // 1. Generate query embedding
   // 2. Vector similarity search in knowledge_base
   // 3. Build context-aware prompt
   // 4. Call AI API with retrieved context
   ```

3. **System Prompt Template:**

   ```
   You are a helpful assistant for {business_name}.

   When customers want to order/book:
   1. Help them naturally using this info: {retrieved_context}
   2. Ask for name and phone when they're ready
   3. Confirm details clearly
   4. End with: [LEAD: {type: "order/booking/inquiry", details: "...", customer: {name, phone}}]

   Keep responses under 160 characters when possible.
   If unsure, say "Let me connect you with someone who can help."
   ```

#### **Lead Capture Engine**

- **AI-Native Detection:** No keyword rules, AI handles intent recognition
- **Structured Extraction:** Parse AI responses for lead markers
- **Auto-Processing:** Save to database → sync to Google Sheets → send email

#### **WhatsApp Integration (Twilio)**

- **Webhook Handler:** `POST /api/webhook/whatsapp`
- **Message Flow:** Receive → AI Processing → Reply
- **Error Handling:** AI fails → fallback message
- **Rate Limiting:** Prevent spam and quota abuse

#### **Usage Tracking & Billing**

- **Quota Management:** Track conversations per month
- **Stripe Integration:** $49/month for 500 conversations
- **Overage Handling:** Disable bot when quota exceeded
- **Billing Cycle:** Auto-reset monthly quotas

---

## 🔒 Security & Performance

### **Security Requirements**

- **Authentication:** JWT tokens via Supabase Auth
- **Data Isolation:** Row Level Security (RLS) policies
- **API Security:** Webhook signature verification
- **Rate Limiting:** 10 requests/minute per user

### **Performance Targets**

- **AI Response Time:** <3 seconds end-to-end
- **Vector Search:** <500ms for context retrieval
- **Concurrent Users:** Support 100 simultaneous conversations
- **Database:** Optimized indexes for user queries

### **Error Handling Strategy**

```typescript
// Core error scenarios:
- AI API timeout → Send fallback response
- WhatsApp webhook failure → Log and retry
- Database connection error → Queue for retry
- Quota exceeded → Disable bot + notify user
```

---

## 📋 User Flows

### **Business Owner Onboarding**

1. Sign up with email/password
2. Enter business name, type, WhatsApp number
3. Upload FAQ/menu text file or paste content
4. AI processes and creates embeddings
5. Test bot with sample questions
6. Connect WhatsApp number via Twilio
7. Bot goes live - ready to receive customer messages

### **Customer Interaction Flow**

```
Customer sends WhatsApp message
    ↓
Webhook receives message
    ↓
Generate embedding for query
    ↓
Vector search in knowledge base
    ↓
Build prompt with retrieved context
    ↓
Call AI API (GPT-4/Claude)
    ↓
Parse response for lead markers
    ↓
Send reply to customer via WhatsApp
    ↓
If lead detected: Save to DB + sync to sheets
```

### **Lead Management Flow**

1. AI detects order/booking intent in conversation
2. Extracts structured data (name, phone, details)
3. Creates lead record in database
4. Syncs to Google Sheets automatically
5. Sends email notification to business owner
6. Business owner follows up manually

---

## ⏰ Implementation Timeline (2 Weeks)

### **Week 1: Core Infrastructure**

**Day 1-2:** Project Setup

- Next.js project with Supabase integration
- Database schema deployment
- Supabase Auth configuration
- Stripe test environment setup

**Day 3-4:** WhatsApp & AI Integration

- Twilio WhatsApp sandbox setup
- Webhook endpoint implementation
- OpenAI API integration
- Basic AI prompt and response handling

**Day 5-6:** Knowledge Base & RAG

- File upload functionality
- Text processing and embedding generation
- Vector similarity search implementation
- Context retrieval and prompt building

**Day 7:** Testing & Debugging

- End-to-end message flow testing
- AI response quality validation
- Error handling implementation

### **Week 2: Features & Polish**

**Day 8-9:** Lead Capture System

- AI response parsing for lead markers
- Structured data extraction
- Database storage and lead management

**Day 10-11:** Dashboard Development

- User authentication flows
- Chat history display
- Knowledge base editor
- Leads table with filtering

**Day 12-13:** Integrations & Billing

- Google Sheets API integration
- Email notifications setup
- Stripe subscription implementation
- Usage quota tracking

**Day 14:** Production Deployment

- Environment setup (production)
- Domain configuration and SSL
- Final testing with real WhatsApp numbers
- Go-live preparation

---

## 🚀 MVP Deliverables (End of Week 2)

### **Functional Requirements**

✅ Business can sign up and authenticate securely  
✅ Upload FAQ/menu content via simple interface  
✅ AI bot answers customer questions using business knowledge  
✅ Automatic lead detection for orders/bookings/inquiries  
✅ Structured lead data captured (name, phone, details)  
✅ Google Sheets sync for lead management  
✅ Email notifications for new leads  
✅ Usage tracking and quota management  
✅ Stripe subscription billing ($49/month)  
✅ WhatsApp integration working with real phone numbers

### **Admin Capabilities**

- View all registered businesses
- Monitor system health and logs
- Track usage across all accounts
- Handle billing and subscription issues

---

## 📊 Success Metrics & Validation

### **Key Performance Indicators**

- **Conversation Completion Rate:** >80% of customer queries answered satisfactorily
- **Lead Capture Rate:** >60% of order/booking intents properly detected
- **Response Time:** <3 seconds average AI response time
- **User Retention:** >70% of trial users convert to paid subscription
- **Customer Satisfaction:** Positive feedback from end customers

### **Testing Strategy**

- **Unit Tests:** API endpoints and core functions
- **Integration Tests:** WhatsApp webhook → AI → response flow
- **Load Testing:** 50 concurrent conversations
- **User Acceptance Testing:** Test with 3 real businesses

---

## 🔄 Post-MVP Roadmap (Future Iterations)

### **Phase 2 Features (Weeks 3-4)**

- **Multi-language Support:** Detect customer language and respond accordingly
- **Voice Message Handling:** Transcribe voice notes and respond
- **Advanced Analytics:** Dashboard with conversation insights
- **Custom Branding:** White-label solution for agencies

### **Phase 3 Features (Month 2)**

- **Human Handoff:** Transfer complex queries to human agents
- **Appointment Booking:** Calendar integration for real-time scheduling
- **Order Management:** Integration with POS systems
- **Mobile App:** Native iOS/Android apps for business owners

### **Scaling Considerations**

- **Multi-tenant Architecture:** Already implemented with RLS
- **Caching Strategy:** Redis for frequently accessed knowledge
- **CDN Integration:** CloudFlare for global performance
- **Monitoring:** Comprehensive logging and alerting system

---

## 🎯 Target Market & Positioning

### **Primary Target Customers**

- **Small Restaurants:** Menu-based ordering and reservations
- **Service Businesses:** Gyms, salons, clinics with appointment booking
- **Local Retailers:** Product inquiries and order processing
- **Consultants:** Lead qualification and appointment scheduling

### **Value Proposition**

- **10x Faster Setup:** vs building custom chatbot solution
- **24/7 Customer Service:** Never miss a customer inquiry
- **Automatic Lead Capture:** Turn conversations into business opportunities
- **Pay-Per-Use Model:** Affordable for small businesses

---

## 📝 Environment Variables Required

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Service
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_claude_key

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Sheets API
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password

# Application
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## ⚡ Key Success Factors

1. **AI Quality:** Responses must feel natural and helpful
2. **Speed:** Sub-3-second response time is critical for WhatsApp
3. **Reliability:** 99.9% uptime for message processing
4. **Ease of Use:** Non-technical users can set up in <10 minutes
5. **Lead Quality:** Accurate extraction of customer contact info

This PRD provides everything needed to build a production-ready AI WhatsApp bot in 2 weeks, with clear technical specifications, user flows, and success metrics.

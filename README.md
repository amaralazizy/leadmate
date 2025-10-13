# 🤖 AI WhatsApp Bot SaaS

A complete SaaS platform that enables businesses to create AI-powered WhatsApp chatbots for customer service, lead capture, and automated responses.

## ✨ Features

- **AI-Powered Conversations**: GPT-4 powered chatbot with custom knowledge base
- **WhatsApp Integration**: Direct integration with Twilio WhatsApp Business API
- **Lead Capture**: Automatic lead detection and extraction from conversations
- **Knowledge Management**: Upload and manage FAQ/menu content with vector search
- **Real-time Dashboard**: Monitor conversations, leads, and usage
- **Multi-tenant**: Secure, isolated data for each business
- **Subscription Billing**: Stripe integration for recurring payments
- **Admin Dashboard**: App-wide and per-tenant controls (webhook, LLM, rate limits, scheduling)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Twilio account with WhatsApp Business API
- Stripe account (for billing)

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-whatsapp-chatbot
npm install
```

### 2. Environment Setup

Create a `.env.local` file with the following variables:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Service
OPENAI_API_KEY=your_openai_key

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google Sheets API (optional)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password

# Application
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Admin
ADMIN_EMAILS=you@example.com,other@example.com
BATCH_PROCESSING_TOKEN=your_secure_token
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 3. Database Setup

1. Create a new Supabase project
2. Enable the vector extension in your Supabase SQL editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Run the schema from `supabase-schema.sql` in your Supabase SQL editor
4. Enable Row Level Security (RLS) for all tables

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### For Business Owners

1. **Sign Up**: Create an account with your business details
2. **Upload Knowledge**: Add your FAQ, menu, or business information
3. **Connect WhatsApp**: Configure your Twilio WhatsApp number
4. **Test Bot**: Use the built-in chat interface to test responses
5. **Go Live**: Start receiving and responding to customer messages

### For Customers

1. Send a WhatsApp message to the business number
2. Chat naturally with the AI assistant
3. Get instant responses based on business knowledge
4. Provide contact details when ready to order/book

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL with vector extension)
- **AI**: OpenAI GPT-4 and text-embedding-3-small
- **WhatsApp**: Twilio WhatsApp Business API
- **Payments**: Stripe
- **Authentication**: Supabase Auth

### Key Components

- **AI Engine**: RAG pipeline with vector similarity search
- **Webhook Handler**: Processes incoming WhatsApp messages
- **Lead Capture**: Automatically extracts customer information
- **Knowledge Base**: Vector embeddings for context retrieval
- **Dashboard**: Real-time monitoring and management interface

## 🔗 API Endpoints

- `POST /api/webhook/whatsapp` - Receive WhatsApp messages
- `POST /api/knowledge` - Upload and process FAQ/menu
- `GET /api/conversations` - Fetch chat history
- `POST /api/chat/test` - Test bot responses
- `GET/POST /api/leads` - Manage captured leads

## 🔒 Security

- Row Level Security (RLS) for multi-tenant data isolation
- JWT authentication via Supabase
- Webhook signature verification
- Rate limiting and input validation
- Environment variable protection

## 📊 Monitoring

- Usage tracking and quota management
- Conversation analytics
- Lead conversion tracking
- System health monitoring

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx) for domain
4. Set up SSL certificate

## 📈 Scaling

- Uses Supabase for automatic database scaling
- Stateless architecture for horizontal scaling
- Vector similarity search with pgvector
- CDN-ready static assets

## 🛠️ Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── page.tsx        # Landing page
├── lib/                # Utility libraries
│   ├── supabase.ts     # Database client
│   └── openai.ts       # AI client
└── components/         # Reusable components
```

### Adding Features

1. Create new API routes in `src/app/api/`
2. Add database migrations to `supabase-schema.sql`
3. Update TypeScript types in `src/lib/supabase.ts`
4. Build UI components with Tailwind CSS

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub or contact our support team.

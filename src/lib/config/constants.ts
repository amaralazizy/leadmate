// Application constants
export const APP_CONFIG = {
  name: 'Leadmate',
  version: '1.0.0',
  description: 'Leadmate is an AI-powered WhatsApp chatbot for businesses',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
  },
  billing: {
    subscriptions: '/api/billing/subscriptions',
    usage: '/api/billing/usage',
    paymentMethods: '/api/billing/payment-methods',
  },
  chat: {
    conversations: '/api/chat/conversations',
    messages: '/api/chat/messages',
    test: '/api/chat/test',
  },
  knowledge: {
    upload: '/api/knowledge',
    search: '/api/knowledge/search',
  },
} as const;

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'price_starter',
    name: 'Starter',
    price: 19,
    currency: 'usd',
    interval: 'month',
    usage_limit: 1000,
    features: ['WhatsApp AI Bot', 'Lead Capture', 'Basic Analytics'],
  },
  PRO: {
    id: 'price_pro',
    name: 'Pro',
    price: 49,
    currency: 'usd',
    interval: 'month',
    usage_limit: 5000,
    features: ['Everything in Starter', 'Google Sheets Sync', 'Advanced Analytics', 'Priority Support'],
  },
  ENTERPRISE: {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'usd',
    interval: 'month',
    usage_limit: 20000,
    features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'SLA'],
  },
} as const;

// Feature flags
export const FEATURES = {
  BILLING_ENABLED: true,
  GOOGLE_SHEETS_SYNC: true,
  ADVANCED_ANALYTICS: true,
  MULTI_LANGUAGE: false,
} as const;

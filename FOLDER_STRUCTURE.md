# 📁 Folder Structure Documentation

## Overview
This document describes the clean, organized folder structure for the AI WhatsApp Chatbot project.

## Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (dashboard)/              # Dashboard group routes
│   │   ├── dashboard/
│   │   │   ├── billing/
│   │   │   ├── chats/
│   │   │   ├── knowledge/
│   │   │   └── settings/
│   │   └── onboarding/
│   ├── (marketing)/              # Marketing group routes
│   │   ├── waitlist/
│   │   └── whatsapp/
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication APIs
│   │   ├── billing/              # Billing & subscription APIs
│   │   ├── chat/                  # Chat & conversation APIs
│   │   ├── knowledge/            # Knowledge base APIs
│   │   ├── twilio/               # Twilio integration APIs
│   │   ├── webhooks/             # Webhook handlers
│   │   └── marketing/            # Marketing APIs (contact, waitlist)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── layout/                   # Layout components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard-specific components
│   ├── marketing/                # Marketing components
│   └── shared/                   # Shared components across features
├── lib/                          # Library & utilities
│   ├── config/                   # Configuration files
│   ├── services/                 # External service integrations
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── contexts/                     # React contexts
└── styles/                       # Global styles
```

## Key Principles

1. **Feature-based Organization**: Components and logic are organized by feature (auth, billing, chat, etc.)
2. **Clear Separation**: UI components, business logic, and utilities are clearly separated
3. **Scalability**: Structure supports easy addition of new features
4. **Maintainability**: Related files are grouped together for easy maintenance

## Naming Conventions

- **Components**: PascalCase (e.g., `BillingSummary.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useBilling.ts`)
- **Utilities**: camelCase (e.g., `billingUtils.ts`)
- **Types**: PascalCase (e.g., `BillingTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SUBSCRIPTION_PLANS`)

## File Organization Rules

1. **Components**: One component per file, named after the component
2. **Hooks**: One hook per file, named after the hook
3. **Types**: Grouped by feature, exported from index files
4. **Utilities**: Grouped by functionality, with clear naming
5. **Services**: One service per file, named after the service

## Migration Notes

- All existing functionality has been preserved
- Import paths have been updated to reflect new structure
- Type definitions are now centralized and organized
- Configuration is separated from business logic

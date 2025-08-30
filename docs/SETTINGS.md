# Settings Management

This document describes the settings management functionality for the AI WhatsApp Chatbot application.

## Overview

The settings system allows users to manage their business profile, WhatsApp configuration, and account information through a user-friendly interface.

## Features

### Business Information

- **Business Name** (required): The name of the user's business
- **Business Type**: Category of business (e.g., Restaurant, Retail, Service)
- **Industry**: Specific industry sector
- **Logo URL**: URL to the business logo image
- **WhatsApp Number**: Contact number for WhatsApp communications

### Account Status (Read-only)

- **Subscription Status**: Current subscription plan (trial, active, cancelled)
- **Usage**: Current usage count vs. limit
- **Email**: User's email address

### WhatsApp Configuration (Read-only)

- **WhatsApp Status**: Current WhatsApp Business API status
- **Twilio Phone Number**: Associated Twilio phone number

## API Endpoints

### GET /api/settings

Retrieves the current user's settings.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "business_name": "My Business",
    "business_type": "Restaurant",
    "whatsapp_number": "+1234567890",
    "business_industry": "Food & Beverage",
    "business_logo_url": "https://example.com/logo.png",
    "subscription_status": "trial",
    "usage_count": 0,
    "usage_limit": 500,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /api/settings

Updates the user's settings.

**Request Body:**

```json
{
  "business_name": "Updated Business Name",
  "business_type": "Retail",
  "whatsapp_number": "+1234567890",
  "business_industry": "Technology",
  "business_logo_url": "https://example.com/new-logo.png"
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "business_name": "Updated Business Name",
    "business_type": "Retail",
    "whatsapp_number": "+1234567890",
    "business_industry": "Technology",
    "business_logo_url": "https://example.com/new-logo.png",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "Settings updated successfully"
}
```

## Database Schema

The settings are stored in the `users` table with the following relevant fields:

```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  whatsapp_number TEXT,
  business_industry TEXT,
  business_logo_url TEXT,
  subscription_status TEXT DEFAULT 'trial',
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Components

### SettingsForm

The main settings form component located at `src/components/dashboard/settings/SettingsForm.tsx`.

**Features:**

- Form validation
- Loading states
- Error handling
- Success notifications
- Responsive design

### useSettings Hook

Custom hook for managing settings state and API calls located at `src/hooks/useSettings.ts`.

**Functions:**

- `fetchSettings()`: Loads user settings
- `updateSettings(updates)`: Updates user settings
- State management for loading, error, and saving states

## Usage

1. Navigate to `/dashboard/settings`
2. Update the desired fields
3. Click "Save Changes"
4. View success/error notifications
5. Settings are automatically saved to the database

## Security

- All API endpoints require authentication
- Users can only update their own settings
- Input validation on both client and server side
- SQL injection protection through Supabase ORM

## Error Handling

The system handles various error scenarios:

- Network errors
- Validation errors
- Authentication errors
- Database errors

Users receive clear error messages and can retry failed operations.

## Future Enhancements

Potential improvements for the settings system:

- File upload for business logos
- Business hours configuration
- Multiple WhatsApp numbers
- Advanced business profile fields
- Settings import/export functionality

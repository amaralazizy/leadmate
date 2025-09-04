# Database Transaction Implementation

## Overview

This document outlines the implementation of atomic database transactions for creating leads and conversations together, ensuring data consistency across the application.

## Problem Statement

Previously, lead and conversation creation was handled separately across multiple API endpoints, which could result in:

- Orphaned conversations without corresponding leads
- Inconsistent data if one operation failed while the other succeeded
- Race conditions in concurrent scenarios

## Solution

### 1. PostgreSQL RPC Function

Created a PostgreSQL RPC (Remote Procedure Call) function `create_lead_with_conversation` that handles both operations atomically:

```sql
CREATE OR REPLACE FUNCTION create_lead_with_conversation(
  p_user_id UUID,
  p_customer_phone TEXT,
  p_customer_name TEXT,
  p_lead_type TEXT,
  p_details TEXT DEFAULT NULL,
  p_conversation_status TEXT DEFAULT 'active',
  p_lead_status TEXT DEFAULT 'new'
)
RETURNS JSON
```

**Benefits:**

- **Atomicity**: Both conversation and lead are created in a single transaction
- **Consistency**: Either both records are created or neither is created
- **Error Handling**: Automatic rollback on any failure
- **Performance**: Single database round-trip for both operations

### 2. Simplified API Architecture

#### Core Endpoints

- `POST /api/leads` - **Simplified**: Always uses atomic creation for lead+conversation pairs
- `POST /api/webhooks/whatsapp` - Uses atomic creation for new customers from WhatsApp
- `POST /api/whatsapp` - Manual message sending with optional lead creation

#### Removed Endpoints

- ❌ `/api/conversation` - No longer needed (conversations are created with leads)
- ❌ `/api/leads/create-with-conversation` - Merged into main `/api/leads` endpoint

### 3. Usage Patterns

#### Creating Leads (Always Atomic)

```javascript
// Simplified: Always creates both lead and conversation atomically
const response = await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customer_phone: "+1234567890",
    customer_name: "John Doe",
    type: "order",
    details: "Customer wants to place an order",
  }),
});

// Returns: { lead_id: '...', conversation_id: '...' }
```

#### Manual WhatsApp Messages (Optional Lead Creation)

```javascript
// Send message only (no lead creation)
const response = await fetch("/api/whatsapp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "+1234567890",
    message: "Hello! How can we help you?",
    createLead: false, // Default: no lead creation
  }),
});

// Send message AND create lead atomically
const response = await fetch("/api/whatsapp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "+1234567890",
    message: "Hello John! How can we help you?",
    createLead: true,
    customerName: "John Doe", // Required when createLead: true
  }),
});
```

## Error Handling and Rollback

### Automatic Rollback Scenarios

1. **Schema Validation Failures**: Invalid phone format, lead type, etc.
2. **Database Constraint Violations**: Foreign key violations, check constraints
3. **Database Connection Issues**: Network timeouts, connection drops
4. **Business Logic Errors**: Custom validation failures

### Example Rollback Test

```sql
-- This will fail and rollback due to invalid lead type
SELECT create_lead_with_conversation(
  'user-id',
  '+1234567890',
  'John Doe',
  'invalid_type', -- Violates CHECK constraint
  'Test details'
);

-- Result: {"success": false, "error": "..."}
-- No orphaned records created
```

## Testing Transaction Integrity

Run the provided test script (`test-transaction.js`) to verify:

1. Successful atomic creation
2. Proper rollback on validation failures
3. No orphaned records after failed transactions

## Best Practices

### When Atomic Creation Is Used

- ✅ **Always** when creating leads via `/api/leads` endpoint
- ✅ New customer conversations from WhatsApp webhooks
- ✅ Manual WhatsApp sends when `createLead: true` is specified
- ✅ Bulk import operations
- ✅ Any scenario where both lead and conversation records are needed

### When Only Conversations Are Created

- ✅ Manual WhatsApp sends with `createLead: false` (default)
- ✅ Testing message delivery without lead tracking
- ✅ Administrative or support messages

### Schema Validation

Always validate data using Zod schemas before calling the RPC function:

```javascript
const leadData = leadSchema
  .omit({ id: true, created_at: true, user_id: true, conversation_id: true })
  .parse(inputData);

const conversationData = conversationSchema
  .omit({ id: true, created_at: true, updated_at: true, user_id: true })
  .parse(inputData);
```

## Monitoring and Debugging

### Error Logging

- RPC function errors are automatically logged in the function return value
- Application-level errors are caught and logged in API endpoints
- Failed transactions are tracked with full error context

### Performance Monitoring

- Single database round-trip reduces latency
- Transaction locks are minimal and short-lived
- Monitor for deadlocks in high-concurrency scenarios

## Migration Notes

### Existing Code Compatibility

- Existing endpoints maintain backward compatibility
- Gradual migration path for existing integrations
- No breaking changes to current API contracts

### Database Migration

Apply the RPC function to your database:

```bash
# Apply to your Supabase instance
supabase db push
```

## Future Enhancements

1. **Batch Operations**: Extend RPC for multiple leads/conversations
2. **Soft Deletes**: Add transaction support for deletion operations
3. **Audit Trails**: Include transaction logging for compliance
4. **Performance**: Add indexes for common transaction queries

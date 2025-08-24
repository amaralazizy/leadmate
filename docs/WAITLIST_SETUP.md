# Waitlist Setup Guide

This guide explains how to set up and use the waitlist functionality for your AI WhatsApp Bot landing page.

## Features

The waitlist page includes:

- **Neobrutalism Design**: Bold, modern UI with thick borders and shadows
- **Email Collection**: Simple email signup form with validation
- **Social Proof**: Visual indicators of existing waitlist members
- **Responsive Design**: Works on all device sizes
- **API Integration**: Backend storage with Supabase

## Setup Instructions

### 1. Database Setup

Run the following SQL in your Supabase SQL editor to create the waitlist table:

```sql
-- Waitlist table
CREATE TABLE public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'notified', 'converted'))
);

-- Indexes for performance
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_status ON public.waitlist(status);
```

### 2. Access the Waitlist Page

The waitlist page is available at `/waitlist` and includes:

- Navigation link in the main header
- CTA button on the main landing page
- Direct URL access

### 3. API Endpoints

#### POST `/api/waitlist`

- **Purpose**: Add email to waitlist
- **Body**: `{ "email": "user@example.com" }`
- **Response**: Success message or error details

#### GET `/api/waitlist`

- **Purpose**: Get total waitlist count
- **Response**: `{ "count": 123 }`

### 4. Customization

#### Colors

The design uses a color scheme inspired by the Lovable project:

- Primary: Blue gradients (`from-blue-500 to-purple-600`)
- Accent: Yellow (`bg-yellow-400`)
- Background: Soft gradients (`from-slate-50 via-blue-50 to-indigo-100`)

#### Neobrutalism Elements

- Thick black borders (`border-4 border-black`)
- Bold shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`)
- Rounded corners (`rounded-2xl`)
- Hover animations with shadow and position changes

#### Content

- Update the main headline and description
- Modify feature cards and descriptions
- Customize the CTA section
- Update navigation links

### 5. Email Integration

To send notifications when you're ready to launch:

1. **Export emails**: Query the waitlist table
2. **Email service**: Use services like SendGrid, Mailchimp, or Resend
3. **Update status**: Mark emails as 'notified' after sending

Example query to get all active waitlist emails:

```sql
SELECT email FROM public.waitlist WHERE status = 'active';
```

### 6. Analytics

Track waitlist performance:

- Total signups
- Conversion rates
- Email validation success/failure
- Geographic distribution (if collecting location)

### 7. Security Considerations

- Email validation on both frontend and backend
- Rate limiting for API endpoints
- Input sanitization
- CORS configuration if needed

## File Structure

```
src/app/
├── waitlist/
│   └── page.tsx          # Main waitlist page
├── api/
│   └── waitlist/
│       └── route.ts      # API endpoints
└── components/
    └── Header.tsx        # Updated with waitlist link
```

## Styling Classes

Key Tailwind classes used:

- **Borders**: `border-4 border-black`
- **Shadows**: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- **Gradients**: `bg-gradient-to-r from-blue-600 to-purple-600`
- **Hover effects**: `hover:-translate-x-1 hover:-translate-y-1`
- **Transitions**: `transition-all`

## Browser Support

The waitlist page uses modern CSS features:

- CSS Grid and Flexbox
- CSS Custom Properties
- Modern CSS transforms and shadows
- Backdrop filters (with fallbacks)

## Performance

- Optimized images and icons
- Minimal JavaScript bundle
- Efficient CSS with Tailwind
- Lazy loading for non-critical elements

## Troubleshooting

### Common Issues

1. **Emails not saving**: Check Supabase connection and table permissions
2. **Styling issues**: Ensure Tailwind CSS is properly configured
3. **API errors**: Check browser console and server logs
4. **Mobile responsiveness**: Test on various screen sizes

### Debug Mode

Enable debug logging by adding console.log statements in the API route:

```typescript
console.log("Received email:", email);
console.log("Database response:", result);
```

## Next Steps

After setup:

1. Test the signup flow end-to-end
2. Customize the design to match your brand
3. Set up email notifications
4. Add analytics tracking
5. Plan your launch strategy

## Support

For issues or questions:

1. Check the browser console for errors
2. Verify database connections
3. Review API endpoint responses
4. Test with different email formats

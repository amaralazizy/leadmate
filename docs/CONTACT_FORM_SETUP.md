# Contact Form Setup

This document explains how the contact form works and how to configure it.

## 🚀 **Features**

- **Contact Form**: Name, email, and message fields
- **Smooth Scrolling**: Click "Contact Us" button to scroll to the form
- **Email Notifications**: Sends submissions to two email addresses
- **Form Validation**: Client and server-side validation
- **Success/Error Handling**: User feedback for form submissions
- **Responsive Design**: Works on all devices

## 📧 **Email Configuration**

### **Environment Variables**

Add these to your `.env.local` file:

```bash
# Contact form email addresses
CONTACT_EMAIL_1=amarelazizy@gmail.com
CONTACT_EMAIL_2=sherifelamir2003@gmail.com

# Resend API key (for sending emails)
RESEND_API_KEY=your_resend_api_key_here
```

### **Default Emails**

If environment variables are not set, the form will use these default addresses:

- `amarelazizy@gmail.com`
- `sherifelamir2003@gmail.com`

## 🔧 **How It Works**

### **1. User Interaction**

- User clicks "Contact Us" button in the hero section
- Page smoothly scrolls to the contact form
- User fills out name, email, and message fields

### **2. Form Submission**

- Form validates input on client-side
- Data is sent to `/api/contact` endpoint
- Server validates data and sends emails

### **3. Email Delivery**

- Two emails are sent simultaneously:
  - One to `CONTACT_EMAIL_1`
  - One to `CONTACT_EMAIL_2`
- Both emails include the form data
- Reply-to is set to the user's email

### **4. User Feedback**

- Success message appears on successful submission
- Error message appears if something goes wrong
- Form resets after successful submission

## 📁 **File Structure**

```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # API endpoint for form submission
│   ├── components/
│   │   ├── ContactForm.tsx       # Contact form component
│   │   └── WaitlistHero.tsx      # Hero section with Contact Us button
│   └── waitlist/
│       └── page.tsx              # Main page with contact form
└── lib/
    └── utils/
        └── smoothScroll.ts        # Smooth scrolling utilities
```

## 🎨 **Styling**

The contact form uses your project's color scheme:

- **Background**: Dark card (`bg-dark-card`)
- **Form Fields**: Dark background with green borders
- **Accent Color**: Green (`#39ff14`) for highlights
- **Text**: White and light gray for readability

## 🔒 **Security Features**

- **Input Validation**: Server-side validation of all fields
- **Email Format**: Validates email format before sending
- **Rate Limiting**: Can be added via middleware if needed
- **CSRF Protection**: Built into Next.js forms

## 📱 **Responsive Design**

- **Mobile First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Large buttons and input fields
- **Accessibility**: Proper labels and ARIA attributes

## 🚀 **Deployment**

### **1. Environment Variables**

Make sure to set the environment variables in your production environment.

### **2. Resend Configuration**

Ensure your Resend API key is configured and the domain is verified.

### **3. Testing**

Test the form submission in development before deploying.

## 🐛 **Troubleshooting**

### **Form Not Submitting**

- Check browser console for errors
- Verify API route is accessible
- Check Resend API key configuration

### **Emails Not Receiving**

- Verify Resend domain verification
- Check spam/junk folders
- Review Resend dashboard for delivery status

### **Smooth Scrolling Not Working**

- Ensure the contact section has `id="contact"`
- Check if JavaScript is enabled
- Verify smooth scroll utility is imported

## 📞 **Support**

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variable configuration
3. Test the Resend API connection
4. Review the API route logs

## 🔄 **Customization**

### **Adding More Fields**

1. Update the `ContactForm.tsx` component
2. Add validation in the API route
3. Update the email template

### **Changing Email Template**

Modify the `htmlContent` in `route.ts` to customize the email appearance.

### **Adding Form Analytics**

Integrate with services like Google Analytics or Mixpanel to track form submissions.

import { Phone, Globe, Upload, MessageSquare } from "lucide-react";

export const ONBOARDING_STEPS = [
  { number: 1, title: "Business Info", icon: Phone },
  { number: 2, title: "Pick WhatsApp Number", icon: Globe },
  { number: 3, title: "Activate", icon: Upload },
  { number: 4, title: "Done", icon: MessageSquare },
];

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "EG", label: "Egypt" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "SA", label: "Saudi Arabia" },
];

export const INDUSTRIES = [
  { value: "", label: "Select your industry" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "service", label: "Service" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export const INITIAL_ONBOARDING_DATA = {
  businessName: "",
  businessType: "",
  logoUrl: "",
  selectedCountry: "US",
  selectedNumber: "",
  senderSid: "",
  activationStatus: "PENDING",
};

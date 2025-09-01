import Link from "next/link";
import { MessageSquare, Zap, Shield, BarChart3 } from "lucide-react";
import LandingHeader from "@/components/layout/LandingHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LandingHeader />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI-Powered WhatsApp</span>
            <span className="block text-blue-600">Customer Service Bot</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your WhatsApp into an intelligent customer service
            assistant. Capture leads, answer questions, and never miss a
            customer inquiry.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Live Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Instant Setup
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Connect your WhatsApp in under 10 minutes. No technical skills
                required.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Smart AI Responses
              </h3>
              <p className="mt-2 text-base text-gray-500">
                AI trained on your business knowledge to provide accurate
                answers.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Lead Capture
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Automatically capture customer details and sync to Google
                Sheets.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Secure & Reliable
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Enterprise-grade security with 99.9% uptime guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-blue-600 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">
                Ready to transform your customer service?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join hundreds of businesses using AI to provide 24/7 customer
                support.
              </p>
              <div className="mt-8">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

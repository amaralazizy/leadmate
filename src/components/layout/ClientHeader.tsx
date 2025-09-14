"use client";

import { MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function ClientHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Redirect first, then sign out
    router.push("/");
    const supabase = await createClient();
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                AI WhatsApp Bot
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              AI WhatsApp Bot
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user.business_name || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm text-gray-700 transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <span className="text-sm text-gray-500">Not authenticated</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

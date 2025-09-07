"use client";

import { useRouter } from "next/navigation";

import {
  MessageSquare,
  Users,
  TrendingUp,
  Settings,
  Upload,
  Phone,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import ClientHeader from "@/components/ClientHeader";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    // <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <ClientHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Conversations
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.usage_count || 0} / {user?.usage_limit || 500}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Leads Captured
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Subscription
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 capitalize">
                        {user?.subscription_status}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        WhatsApp
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.whatsapp_number || "Not Connected"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <button
              onClick={() => router.push("/dashboard/knowledge")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload Knowledge
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add your FAQ or menu content
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/chat")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Test Bot
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try out your AI assistant
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/settings")}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Settings
                  </h3>
                  <p className="text-sm text-gray-500">Configure your bot</p>
                </div>
              </div>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Latest conversations and interactions
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No recent activity. Start by uploading your knowledge base!
              </div>
            </div>
          </div>
        </main>
      </div>
    // </ProtectedRoute>
  );
}

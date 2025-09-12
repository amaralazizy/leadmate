"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

export default function SettingsForm() {
  const { settings, error, saving, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    whatsapp_number: "",
    business_industry: "",
    business_logo_url: "",
  });

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || "",
        business_type: settings.business_type || "",
        whatsapp_number: settings.whatsapp_number || "",
        business_industry: settings.business_industry || "",
        business_logo_url: settings.business_logo_url || "",
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.business_name.trim()) {
      toast.error("Business name is required");
      return;
    }

    const result = await updateSettings(formData);

    if (result.success) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">Error loading settings: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="neutral"
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business profile and WhatsApp configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Update your business details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) =>
                    handleInputChange("business_name", e.target.value)
                  }
                  placeholder="Your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Input
                  id="business_type"
                  value={formData.business_type}
                  onChange={(e) =>
                    handleInputChange("business_type", e.target.value)
                  }
                  placeholder="e.g., Restaurant, Retail, Service"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_industry">Industry</Label>
                <Input
                  id="business_industry"
                  value={formData.business_industry}
                  onChange={(e) =>
                    handleInputChange("business_industry", e.target.value)
                  }
                  placeholder="e.g., Food & Beverage, Technology"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_logo_url">Logo URL</Label>
                <Input
                  id="business_logo_url"
                  value={formData.business_logo_url}
                  onChange={(e) =>
                    handleInputChange("business_logo_url", e.target.value)
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  handleInputChange("whatsapp_number", e.target.value)
                }
                placeholder="+1 555 0123"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              Your current subscription and usage information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subscription Status</Label>
                <div>
                  <Badge
                    variant={
                      settings?.subscription_status === "active"
                        ? "default"
                        : "neutral"
                    }
                  >
                    {settings?.subscription_status || "trial"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Usage</Label>
                <div className="text-sm text-muted-foreground">
                  {settings?.usage_count || 0} / {settings?.usage_limit || 500}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="text-sm text-muted-foreground">
                  {settings?.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Configuration</CardTitle>
            <CardDescription>
              Your Twilio WhatsApp Business API settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>WhatsApp Status</Label>
                <div>
                  <Badge
                    variant={settings?.whatsapp_status ? "default" : "neutral"}
                  >
                    {settings?.whatsapp_status || "Not configured"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Twilio Phone Number</Label>
                <div className="text-sm text-muted-foreground">
                  {settings?.twilio_phone_number || "Not set"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={saving} className="min-w-[120px]">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

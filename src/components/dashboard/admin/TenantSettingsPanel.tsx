"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Config = {
  webhook?: { enabled?: boolean };
  llm?: {
    provider?: "openai";
    model?: string;
    temperature?: number;
    promptTemplateKey?: "auto" | "default" | "clinic" | "gym" | "custom";
    customPrompt?: string;
  };
  rateLimit?: {
    perNumberLimit?: number;
    globalLimit?: number;
    windowSeconds?: number;
  };
  scheduling?: { enabled?: boolean; intervalMinutes?: number };
};

type TenantSummary = {
  id: string;
  email: string;
  business_name: string | null;
  whatsapp_number: string | null;
};

export default function TenantSettingsPanel() {
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<TenantSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const url = new URL(
        window.location.origin + "/api/admin/tenant-settings"
      );
      if (search) url.searchParams.set("q", search);
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed");
      setTenants(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConfig = async (tenantId: string) => {
    setConfig({});
    if (!tenantId) return;
    try {
      const url = new URL(
        window.location.origin + "/api/admin/tenant-settings"
      );
      url.searchParams.set("tenantId", tenantId);
      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed");
      setConfig(json.data || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load config");
    }
  };

  const save = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tenant-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: selectedId, config }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search email, business name, or WhatsApp number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={loadTenants} disabled={loading}>
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
          {tenants.map((t) => (
            <button
              key={t.id}
              className={`text-left p-2 border rounded ${selectedId === t.id ? "bg-gray-100" : ""}`}
              onClick={() => {
                setSelectedId(t.id);
                loadConfig(t.id);
              }}
            >
              <div className="font-medium">{t.business_name || t.email}</div>
              <div className="text-sm text-gray-600">{t.email}</div>
              {t.whatsapp_number && (
                <div className="text-xs text-gray-500">{t.whatsapp_number}</div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {selectedId && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prompt Template</Label>
              <Select
                value={config.llm?.promptTemplateKey ?? "auto"}
                onValueChange={(value) =>
                  setConfig((c) => ({
                    ...c,
                    llm: {
                      ...(c.llm || {}),
                      promptTemplateKey: value as any,
                    },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.llm?.promptTemplateKey === "custom" && (
              <div className="space-y-2 col-span-1">
                <Label>Custom Prompt</Label>
                <textarea
                  className="border p-2 rounded w-full h-40"
                  value={config.llm?.customPrompt ?? ""}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      llm: { ...(c.llm || {}), customPrompt: e.target.value },
                    }))
                  }
                  placeholder="Enter a custom system prompt"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Webhook Enabled</Label>
            <select
              className="border p-2 rounded"
              value={config.webhook?.enabled ? "true" : "false"}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  webhook: { enabled: e.target.value === "true" },
                }))
              }
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>LLM Model</Label>
            <Input
              value={config.llm?.model ?? ""}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  llm: { ...(c.llm || {}), model: e.target.value },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Per-number</Label>
              <Input
                type="number"
                value={config.rateLimit?.perNumberLimit ?? 5}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    rateLimit: {
                      ...(c.rateLimit || {}),
                      perNumberLimit: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label>Global</Label>
              <Input
                type="number"
                value={config.rateLimit?.globalLimit ?? 30}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    rateLimit: {
                      ...(c.rateLimit || {}),
                      globalLimit: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label>Window</Label>
              <Input
                type="number"
                value={config.rateLimit?.windowSeconds ?? 3600}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    rateLimit: {
                      ...(c.rateLimit || {}),
                      windowSeconds: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>
              Save
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

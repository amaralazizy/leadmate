"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

export default function GlobalSettingsForm() {
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/app-settings");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load");
        setConfig(json.data || {});
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/admin/app-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading…</div>;
  return (
    <Card className="p-4 space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex items-center gap-2 py-2 ">
        <Label>Webhook Enabled</Label>
        <Select
          value={config.webhook?.enabled ? "true" : "false"}
          onValueChange={(value) =>
            setConfig((c) => ({
              ...c,
              webhook: { enabled: value === "true" },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="true">Enabled</SelectItem>
            <SelectItem value="false">Disabled</SelectItem>
          </SelectContent>
        </Select>
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
          placeholder="gpt-4o-mini"
        />
      </div>

      <div className="space-y-2">
        <Label>LLM Temperature</Label>
        <Input
          type="number"
          step="0.1"
          value={config.llm?.temperature ?? 0.3}
          onChange={(e) =>
            setConfig((c) => ({
              ...c,
              llm: { ...(c.llm || {}), temperature: Number(e.target.value) },
            }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label>Default Prompt Template</Label>
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
            <SelectContent className="bg-background">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="gym">Gym</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {config.llm?.promptTemplateKey === "custom" && (
          <div className="space-y-2">
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Rate per-number</Label>
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
          <Label>Rate global</Label>
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
          <Label>Window seconds</Label>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 ">
          <Label>Scheduling Enabled</Label>
          <Select
            value={config.scheduling?.enabled ? "true" : "false"}
            onValueChange={(value) =>
              setConfig((c) => ({
                ...c,
                scheduling: {
                  ...(c.scheduling || {}),
                  enabled: value === "true",
                },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Interval (minutes)</Label>
          <Input
            type="number"
            value={config.scheduling?.intervalMinutes ?? 10}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                scheduling: {
                  ...(c.scheduling || {}),
                  intervalMinutes: Number(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}

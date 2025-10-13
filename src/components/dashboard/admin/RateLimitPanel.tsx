"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RateLimitPanel() {
  const [targetNumber, setTargetNumber] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: "status" | "stats" | "test") => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/admin/rate-limits", window.location.origin);
      if (action !== "test") url.searchParams.set("targetNumber", targetNumber);
      if (action === "status") url.searchParams.set("fromNumber", fromNumber);
      url.searchParams.set("action", action);
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = async (scope: "one" | "all") => {
    setLoading(true);
    setError(null);
    try {
      if (scope === "one") {
        const res = await fetch("/api/admin/rate-limits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetNumber, fromNumber }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed");
        setResult(json);
      } else {
        const url = new URL("/api/admin/rate-limits", window.location.origin);
        url.searchParams.set("targetNumber", targetNumber);
        const res = await fetch(url.toString(), { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed");
        setResult(json);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Target WhatsApp Number</Label>
          <Input
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
          />
        </div>
        <div>
          <Label>From Number (for status)</Label>
          <Input
            value={fromNumber}
            onChange={(e) => setFromNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => run("test")} disabled={loading}>
          Test Redis
        </Button>
        <Button onClick={() => run("status")} disabled={loading}>
          Check Status
        </Button>
        <Button onClick={() => run("stats")} disabled={loading}>
          Get Stats
        </Button>
        <Button onClick={() => reset("one")} disabled={loading}>
          Reset Sender
        </Button>
        <Button onClick={() => reset("all")} disabled={loading}>
          Reset All
        </Button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {result && (
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-80">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </Card>
  );
}

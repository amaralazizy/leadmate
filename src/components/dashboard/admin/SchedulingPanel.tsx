"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SchedulingPanel() {
  const [cronUrl, setCronUrl] = useState("");
  const [authHeaderExample, setAuthHeaderExample] = useState<string | null>(
    null
  );
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/cron-info");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed");
        setCronUrl(json.data.cronUrl);
        setAuthHeaderExample(json.data.authHeaderExample);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  const urlWithTenant = tenantId
    ? `${cronUrl}?tenantId=${encodeURIComponent(tenantId)}`
    : cronUrl;

  return (
    <Card className="p-4 space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="space-y-2">
        <Label>Base Cron URL</Label>
        <Input value={cronUrl} readOnly />
      </div>
      <div className="space-y-2">
        <Label>Optional Tenant ID</Label>
        <Input
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          placeholder="uuid"
        />
      </div>
      <div className="space-y-2">
        <Label>Final URL</Label>
        <Input value={urlWithTenant} readOnly />
      </div>
      <div className="space-y-2">
        <Label>Auth Header (example)</Label>
        <Input
          value={authHeaderExample ?? "(set BATCH_PROCESSING_TOKEN)"}
          readOnly
        />
      </div>
      <div className="text-sm text-gray-600">
        Use with cron-job.org or GitHub Actions. Method: POST; Headers include
        Authorization.
      </div>
    </Card>
  );
}

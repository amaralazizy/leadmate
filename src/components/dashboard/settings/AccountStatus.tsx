import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TgetSettings } from "@/app/dashboard/settings/schema";

export default function AccountStatus({ settings }: { settings: TgetSettings }) {
  return (
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
              {settings.usage_count} / {settings.usage_limit}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="text-sm text-muted-foreground">
              {settings.email}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
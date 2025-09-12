import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TgetSettings } from "@/app/dashboard/settings/schema";

export default function TwilioInfo({ settings }: { settings: TgetSettings }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Configuration</CardTitle>
        <CardDescription>
          Your Twilio WhatsApp Business API data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Twilio Phone Number</Label>
            <div className="text-sm text-muted-foreground">
              {settings.whatsapp_number}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
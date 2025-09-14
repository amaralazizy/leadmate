import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TgetSettings } from "@/app/dashboard/settings/schema";

export default function BusinessInfo({ settings }: { settings: TgetSettings }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Your business details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <div id="business_name" className="text-sm text-muted-foreground">
              {settings.business_name}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            <div className="text-sm text-muted-foreground">
              {settings.business_type}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <div className="text-sm text-muted-foreground">
              {settings.whatsapp_number}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
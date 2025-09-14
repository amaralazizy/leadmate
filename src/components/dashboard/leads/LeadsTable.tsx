"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  type: "order" | "booking" | "inquiry";
  status: "new" | "contacted" | "converted";
  details: string | null;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // Filter leads based on selected filters
  const filteredLeads = leads.filter((lead) => {
    const statusMatch = statusFilter === "all" || lead.status === statusFilter;
    const typeMatch = typeFilter === "all" || lead.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      const response = await fetch(`/api/leads/export?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Leads exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      contacted:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      converted:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return variants[status as keyof typeof variants] || variants.new;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      order:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      booking:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      inquiry: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return variants[type as keyof typeof variants] || variants.inquiry;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
          <div className="flex items-center gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-main border-main">
                  <SelectItem
                    value="all"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    All Status
                  </SelectItem>
                  <SelectItem
                    value="new"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    New
                  </SelectItem>
                  <SelectItem
                    value="contacted"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    Contacted
                  </SelectItem>
                  <SelectItem
                    value="converted"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    Converted
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-main border-main">
                  <SelectItem
                    value="all"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="order"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    Order
                  </SelectItem>
                  <SelectItem
                    value="booking"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    Booking
                  </SelectItem>
                  <SelectItem
                    value="inquiry"
                    className="text-black hover:bg-main/80 focus:bg-main/80"
                  >
                    Inquiry
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting || filteredLeads.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export to CSV"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {leads.length === 0
                ? "No leads captured yet. Start conversations to generate leads!"
                : "No leads match the current filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Customer</th>
                  <th className="text-left p-2 font-semibold">Phone</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Status</th>
                  <th className="text-left p-2 font-semibold">Details</th>
                  <th className="text-left p-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{lead.customer_name}</td>
                    <td className="p-2 text-sm">{lead.customer_phone}</td>
                    <td className="p-2">
                      <Badge className={getTypeBadge(lead.type)}>
                        {lead.type}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusBadge(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm max-w-xs truncate">
                      {lead.details || "No details"}
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

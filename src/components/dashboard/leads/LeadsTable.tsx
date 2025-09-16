"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Filter,
  Phone,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">
            Leads ({filteredLeads.length})
          </CardTitle>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
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
                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
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
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "Export to CSV"}
              </span>
              <span className="sm:hidden">
                {isExporting ? "Exporting..." : "Export"}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-secondary-background border-2 border-dashed border-border flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-foreground/40" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {leads.length === 0
                ? "No leads captured yet. Start conversations to generate leads!"
                : "No leads match the current filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold text-sm">
                      Customer
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Phone
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Type
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Details
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{lead.customer_name}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {lead.customer_phone}
                      </td>
                      <td className="p-3">
                        <Badge className={getTypeBadge(lead.type)}>
                          {lead.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadge(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm max-w-xs truncate">
                        {lead.details || "No details"}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="bg-secondary-background/50 border-border/50 hover:bg-secondary-background hover:border-border transition-all duration-200"
                >
                  <CardContent className="p-4">
                    {/* Header with name and badges */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-main flex-shrink-0" />
                          <h3 className="font-semibold text-foreground truncate">
                            {lead.customer_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {lead.customer_phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-3">
                        <Badge
                          className={cn("text-xs", getTypeBadge(lead.type))}
                        >
                          {lead.type}
                        </Badge>
                        <Badge
                          className={cn("text-xs", getStatusBadge(lead.status))}
                        >
                          {lead.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    {lead.details && (
                      <div className="flex items-start gap-2 mb-3">
                        <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lead.details}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

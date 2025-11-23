import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";
import { getLogs, generateMockLogs } from "@/lib/auditLogger";
import { AuditLog, AuditAction, AuditCategory } from "@/types/auditLog";
import { format } from "date-fns";

interface AdminAuditTrailProps {
  onNavigateToReport?: (reportId: string) => void;
}

const AdminAuditTrail = ({ onNavigateToReport }: AdminAuditTrailProps) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    generateMockLogs(); // Generate mock data on first load
    setLogs(getLogs());
  }, []);

  const getActionBadgeColor = (action: AuditAction) => {
    switch (action) {
      case "REPORTED":
      case "LOGIN":
        return "bg-success/10 text-success border-success/20";
      case "STATUS_CHANGE":
      case "EDITED_REPORT":
        return "bg-warning/10 text-warning border-warning/20";
      case "DELETED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "SYSTEM_REPORT":
      case "LOGOUT":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Actor type filter
      if (actorFilter !== "all") {
        if (actorFilter === "citizen" && !log.actor.toLowerCase().includes("citizen")) return false;
        if (actorFilter === "admin" && !log.actor.toLowerCase().includes("admin")) return false;
        if (actorFilter === "system" && !log.actor.toLowerCase().includes("system")) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && log.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.details.toLowerCase().includes(query) ||
          log.targetTitle.toLowerCase().includes(query) ||
          log.actor.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [logs, actorFilter, categoryFilter, searchQuery]);

  const handleReportClick = (reportId: string) => {
    if (onNavigateToReport) {
      onNavigateToReport(reportId);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">Complete activity log for security and accountability</p>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Actor Filter */}
          <Select value={actorFilter} onValueChange={setActorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actors</SelectItem>
              <SelectItem value="citizen">Citizens</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="USER_SUBMISSION">User Submission</SelectItem>
              <SelectItem value="ADMIN_ACTION">Admin Action</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
              <SelectItem value="SECURITY_ALERT">Security Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 py-2 bg-muted/30 border-b border-border">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} log entries
        </p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Report ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No logs found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.logId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <div className="text-foreground font-medium">
                          {format(new Date(log.timestamp), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.timestamp), "HH:mm:ss")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                          {log.action.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-medium text-foreground">{log.actor}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-foreground">{log.details}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Target: {log.targetTitle}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleReportClick(log.targetId)}
                          className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                        >
                          {log.targetId.slice(0, 8)}...
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuditTrail;

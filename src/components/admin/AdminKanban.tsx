import { useState } from "react";
import { motion } from "framer-motion";
import { useReports } from "@/contexts/ReportContext";
import { Report, ReportStatus } from "@/types/report";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle2, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminKanban = () => {
  const { reports, updateReport, deleteReport } = useReports();
  const { toast } = useToast();

  const columns: { status: ReportStatus; title: string; icon: any; color: string }[] = [
    { status: "Pending", title: "Pending Review", icon: AlertCircle, color: "text-destructive" },
    { status: "In Progress", title: "Dispatched", icon: Clock, color: "text-warning" },
    { status: "Resolved", title: "Resolved", icon: CheckCircle2, color: "text-success" },
  ];

  const getAIInsight = (report: Report) => {
    // Mock AI insights based on keywords
    const desc = report.description.toLowerCase();
    if (desc.includes("safety") || desc.includes("danger") || report.priority === "High") {
      return { tag: "🔥 High Urgency", color: "bg-destructive/10 text-destructive" };
    }
    if (desc.includes("water") || desc.includes("leak")) {
      return { tag: "⚠️ Safety Risk", color: "bg-warning/10 text-warning" };
    }
    return { tag: "ℹ️ Standard", color: "bg-muted text-muted-foreground" };
  };

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    updateReport(reportId, { status: newStatus });
    toast({
      title: "Status updated",
      description: `Report moved to ${newStatus}`,
    });
  };

  const handleDelete = (reportId: string) => {
    deleteReport(reportId);
    toast({
      title: "Report deleted",
      description: "The report has been removed",
      variant: "destructive",
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-3xl font-bold">Workflow Board</h1>
        <p className="text-muted-foreground">Drag & drop issue management</p>
      </div>

      {/* Kanban Board */}
      <div className="h-[calc(100vh-113px)] overflow-x-auto">
        <div className="flex h-full gap-6 p-6">
          {columns.map((column) => {
            const columnReports = reports.filter((r) => r.status === column.status);
            const Icon = column.icon;

            return (
              <div key={column.status} className="flex w-96 flex-shrink-0 flex-col">
                {/* Column Header */}
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Icon className={`h-5 w-5 ${column.color}`} />
                  <h3 className="flex-1 font-semibold">{column.title}</h3>
                  <Badge variant="secondary">{columnReports.length}</Badge>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-muted/30 p-3">
                  {columnReports.map((report) => {
                    const insight = getAIInsight(report);
                    return (
                      <motion.div
                        key={report.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="p-4 transition-shadow hover:shadow-md">
                          {/* AI Insight */}
                          <div className="mb-3">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${insight.color}`}>
                              {insight.tag}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="mb-2 font-semibold">{report.title}</h4>

                          {/* Meta */}
                          <div className="mb-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {report.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                report.priority === "High"
                                  ? "border-destructive text-destructive"
                                  : report.priority === "Medium"
                                  ? "border-warning text-warning"
                                  : ""
                              }`}
                            >
                              {report.priority}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                            {report.description}
                          </p>

                          {/* Image */}
                          {report.imageUrl && (
                            <img
                              src={report.imageUrl}
                              alt="Report"
                              className="mb-3 h-24 w-full rounded-lg object-cover"
                            />
                          )}

                          {/* Footer */}
                          <div className="mb-3 text-xs text-muted-foreground">
                            {format(new Date(report.timestamp), "MMM d, h:mm a")}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {column.status === "Pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(report.id, "In Progress")}
                                className="flex-1"
                              >
                                Dispatch
                              </Button>
                            )}
                            {column.status === "In Progress" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(report.id, "Resolved")}
                                className="flex-1 bg-success hover:bg-success/90"
                              >
                                Resolve
                              </Button>
                            )}
                            {column.status === "Resolved" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(report.id, "Pending")}
                                variant="outline"
                                className="flex-1"
                              >
                                Reopen
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(report.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminKanban;

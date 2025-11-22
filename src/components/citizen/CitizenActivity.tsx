import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, AlertCircle, User, MapPin } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Report } from "@/types/report";

interface ReportWithAuthor extends Report {
  authorName?: string;
}

const CitizenActivity = () => {
  const { reports } = useReports();
  const { user } = useAuth();
  const [reportsWithAuthors, setReportsWithAuthors] = useState<ReportWithAuthor[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const userIds = [...new Set(reports.map(r => r.userId))];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      
      const reportsWithNames = reports.map(report => ({
        ...report,
        authorName: profileMap.get(report.userId) || "Anonymous User"
      }));
      
      setReportsWithAuthors(reportsWithNames);
    };

    fetchAuthors();
  }, [reports]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-warning" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { label: "Sent", completed: true },
      { label: "Received", completed: status !== "Pending" },
      { label: "Crew Dispatched", completed: status === "In Progress" || status === "Resolved" },
      { label: "Resolved", completed: status === "Resolved" }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-background p-6 md:ml-64">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-2 text-3xl font-bold">My Activity</h1>
          <p className="mb-8 text-muted-foreground">
            Track the status of your reports
          </p>
        </motion.div>

        <div className="space-y-6">
          {reportsWithAuthors.map((report, index) => {
            const steps = getStatusSteps(report.status);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                {/* Report Header */}
                <div className="mb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{report.authorName}</span>
                      <span>•</span>
                      <span>{format(new Date(report.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {report.description}
                    </p>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {report.category}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.priority === "High"
                          ? "bg-destructive/10 text-destructive"
                          : report.priority === "Medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {report.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Location: {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex flex-1 flex-col items-center">
                        {/* Step Circle */}
                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                            step.completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted bg-background text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        {/* Step Label */}
                        <span className={`mt-2 text-xs font-medium ${
                          step.completed ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.label}
                        </span>
                        
                        {/* Connecting Line */}
                        {stepIndex < steps.length - 1 && (
                          <div
                            className={`absolute top-5 h-0.5 transition-colors ${
                              step.completed && steps[stepIndex + 1].completed
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                            style={{
                              left: `calc(${(stepIndex * 100) / (steps.length - 1)}% + ${50 / (steps.length - 1)}%)`,
                              right: `calc(${100 - ((stepIndex + 1) * 100) / (steps.length - 1)}% + ${50 / (steps.length - 1)}%)`
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CitizenActivity;

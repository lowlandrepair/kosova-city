import { motion } from "framer-motion";
import { TrendingUp, MapPin, Clock, CheckCircle2, User } from "lucide-react";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Report } from "@/types/report";
import CitizenMap from "./CitizenMap";

interface ReportWithAuthor extends Report {
  authorName?: string;
}

const CitizenHome = () => {
  const { reports, getTotalResolved, upvoteReport, userUpvotedReports } = useReports();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reportsWithAuthors, setReportsWithAuthors] = useState<ReportWithAuthor[]>([]);
  const totalResolved = getTotalResolved();

  useEffect(() => {
    const fetchAuthors = async () => {
      const recentReports = reports.slice(0, 5);
      const userIds = [...new Set(recentReports.map(r => r.userId))];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      
      const reportsWithNames = recentReports.map(report => ({
        ...report,
        authorName: profileMap.get(report.userId) || t("citizen.anonymousUser")
      }));
      
      setReportsWithAuthors(reportsWithNames);
    };

    fetchAuthors();
  }, [reports]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero px-6 py-12 text-white md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            {t("citizen.heroTitle")}
          </h1>
          <p className="mb-8 text-lg opacity-90 md:text-xl">
            {t("citizen.heroSubtitle")}
          </p>
          
          {/* Community Impact Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-3 backdrop-blur-sm"
          >
            <TrendingUp className="h-6 w-6" />
            <div className="text-left">
              <p className="text-sm opacity-90">{t("citizen.communityImpactScore")}</p>
              <p className="text-2xl font-bold">{totalResolved} {t("citizen.issuesResolved")}</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-sm text-muted-foreground">{t("citizen.totalReports")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.status === "In Progress").length}
                </p>
                <p className="text-sm text-muted-foreground">{t("citizen.inProgress")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalResolved}</p>
                <p className="text-sm text-muted-foreground">{t("citizen.resolved")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Map Section */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="mb-2 text-2xl font-bold">{t("citizen.liveCommunityMap")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("citizen.liveMapDescription")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CitizenMap />
          </motion.div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold">{t("citizen.recentCommunityReports")}</h2>
          <div className="space-y-4">
            {reportsWithAuthors.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{report.authorName}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(report.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.priority === "High"
                          ? "bg-destructive/10 text-destructive"
                          : report.priority === "Medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {t(`report.priority.${report.priority.toLowerCase()}`)} {t("citizen.priority")}
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {t(`report.categories.${report.category.toLowerCase().replace(/\s+/g, "")}`)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        report.status === "Resolved"
                          ? "bg-success/10 text-success"
                          : report.status === "In Progress"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {t(`report.status.${report.status.toLowerCase().replace(/\s+/g, "")}`)}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{report.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{t("citizen.location")}: {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        if (!userUpvotedReports.has(report.id)) {
                          upvoteReport(report.id);
                        }
                      }}
                      disabled={userUpvotedReports.has(report.id)}
                      className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                        userUpvotedReports.has(report.id)
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-primary/10 active:scale-95"
                      }`}
                    >
                      <TrendingUp className={`h-5 w-5 text-primary ${userUpvotedReports.has(report.id) ? "fill-primary" : ""}`} />
                      <span className="text-sm font-semibold text-primary">{report.upvotes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CitizenHome;

import { useState } from "react";
import { LayoutDashboard, Map, ListTodo, BarChart3, Home, ScrollText, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminMap from "@/components/admin/AdminMap";
import AdminKanban from "@/components/admin/AdminKanban";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminAuditTrail from "@/components/admin/AdminAuditTrail";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

type AdminTab = "overview" | "map" | "kanban" | "analytics" | "audit" | "users";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigateToReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveTab("kanban");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "map":
        return <AdminMap />;
      case "kanban":
        return <AdminKanban highlightedReportId={selectedReportId} />;
      case "analytics":
        return <AdminAnalytics />;
      case "audit":
        return <AdminAuditTrail onNavigateToReport={handleNavigateToReport} />;
      case "users":
        return <AdminUserManagement />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      {/* Sidebar (hidden on small screens; Header provides mobile nav) */}
      <aside className="hidden md:fixed md:block left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-sidebar-border p-6">
            <h1 className="text-2xl font-bold text-sidebar-primary">{t("admin.title")}</h1>
            <p className="text-sm text-sidebar-foreground/70">{t("admin.subtitle")}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <button
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">{t("common.home")}</span>
            </button>

            <div className="border-t border-sidebar-border my-2" />

            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "overview"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">{t("admin.overview")}</span>
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "map"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Map className="h-5 w-5" />
              <span className="font-medium">{t("admin.liveMap")}</span>
            </button>

            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "kanban"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <ListTodo className="h-5 w-5" />
              <span className="font-medium">{t("admin.kanbanBoard")}</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "analytics"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">{t("admin.analytics")}</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "audit"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <ScrollText className="h-5 w-5" />
              <span className="font-medium">{t("admin.auditTrail")}</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                activeTab === "users"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">{t("admin.userManagement")}</span>
            </button>
          </nav>

          {/* Profile Dropdown at bottom of sidebar */}
          <div className="border-t border-sidebar-border p-4">
            <ProfileDropdown />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-0 md:ml-64 flex-1 pt-16 md:pt-0 min-w-0">
        {/* Mobile tab bar: visible on small screens to switch admin sections */}
        <div className="md:hidden sticky top-16 z-30 bg-background/60 backdrop-blur-sm border-b border-border">
          <div className="px-4 py-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm"
                  aria-label="Open admin sections"
                >
                  <span className="flex items-center gap-2">
                    {activeTab === "overview" && <LayoutDashboard className="h-4 w-4" />}
                    {activeTab === "map" && <Map className="h-4 w-4" />}
                    {activeTab === "kanban" && <ListTodo className="h-4 w-4" />}
                    {activeTab === "analytics" && <BarChart3 className="h-4 w-4" />}
                    {activeTab === "audit" && <ScrollText className="h-4 w-4" />}
                    {activeTab === "users" && <Users className="h-4 w-4" />}
                    <span className="font-medium text-sm">
                      {activeTab === "overview" && t("admin.overview")}
                      {activeTab === "map" && t("admin.liveMap")}
                      {activeTab === "kanban" && t("admin.kanbanBoard")}
                      {activeTab === "analytics" && t("admin.analytics")}
                      {activeTab === "audit" && t("admin.auditTrail")}
                      {activeTab === "users" && t("admin.users")}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </SheetTrigger>

              <SheetContent side="bottom" className="p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>{t("admin.title")}</SheetTitle>
                  <SheetDescription>{t("admin.subtitle")}</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col divide-y">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="flex-1">{t("admin.overview")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>

                  <button
                    onClick={() => setActiveTab("map")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <Map className="h-5 w-5" />
                    <span className="flex-1">{t("admin.liveMap")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>

                  <button
                    onClick={() => setActiveTab("kanban")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <ListTodo className="h-5 w-5" />
                    <span className="flex-1">{t("admin.kanbanBoard")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>

                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="flex-1">{t("admin.analytics")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>

                  <button
                    onClick={() => setActiveTab("audit")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <ScrollText className="h-5 w-5" />
                    <span className="flex-1">{t("admin.auditTrail")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"
                  >
                    <Users className="h-5 w-5" />
                    <span className="flex-1">{t("admin.userManagement")}</span>
                    <SheetClose asChild>
                      <span role="button" tabIndex={0} className="text-muted-foreground">Select</span>
                    </SheetClose>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-full min-w-0 overflow-x-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Admin;

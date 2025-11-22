import { useState } from "react";
import { LayoutDashboard, Map, ListTodo, BarChart3, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminMap from "@/components/admin/AdminMap";
import AdminKanban from "@/components/admin/AdminKanban";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { ProfileDropdown } from "@/components/ProfileDropdown";

type AdminTab = "overview" | "map" | "kanban" | "analytics";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "map":
        return <AdminMap />;
      case "kanban":
        return <AdminKanban />;
      case "analytics":
        return <AdminAnalytics />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
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
          </nav>

          {/* Profile Dropdown at bottom of sidebar */}
          <div className="border-t border-sidebar-border p-4">
            <ProfileDropdown />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;

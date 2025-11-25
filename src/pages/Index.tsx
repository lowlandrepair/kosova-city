import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Users, Shield, TrendingUp, MapPin, ArrowRight, LogIn, Globe, Sun, Moon,
  Zap, Clock, CheckCircle, BarChart3, Bell, Camera, MessageSquare, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReports } from "@/contexts/ReportContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
// ProfileDropdown intentionally omitted on the home page (kept for admin/citizen portals)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { getTotalResolved, reports } = useReports();
  const { user, isAdmin } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const totalResolved = getTotalResolved();

  const handlePortalNavigation = (portal: "citizen" | "admin") => {
    if (!user) {
      navigate("/auth");
    } else if (portal === "admin" && !isAdmin) {
      navigate("/citizen");
    } else {
      navigate(`/${portal}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Top Controls */}
      <div className="fixed top-4 right-4 z-[2100] flex items-center gap-2">
        {/* Profile Dropdown removed from home screen (kept on admin and citizen pages) */}
        
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-32">
            <div className="p-2 space-y-1">
              {(
                [
                  { code: "en", label: "English" },
                  { code: "sq", label: "Shqip" },
                  { code: "es", label: "Español" },
                  { code: "fr", label: "Français" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 z-10"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl text-center"
          >
            {/* Logo and Auth Button */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-6 py-3"
              >
                {/* Logo image served from public/trileqe.jpg. Place the file in the project's `public/` folder. */}
                <img src="/trileqe.jpg" alt="CityCare logo" className="h-8 w-8 rounded-full object-cover" />
                <span className="text-2xl font-bold text-primary">CityCare</span>
              </motion.div>
              
              {!user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="outline"
                    className="gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("landing.signIn")}
                  </Button>
                </motion.div>
              )}
            </div>

            <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              {t("landing.smartCity")} <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {t("landing.smarterSolutions")}
              </span>
            </h1>

            <p className="mb-8 text-lg sm:text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
              {t("landing.aiPowered")}
            </p>

            {/* Feature Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12 flex flex-wrap justify-center gap-3"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="mr-2 h-4 w-4" />
                {t("landing.aiPoweredBadge")}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                {t("landing.gpsTracking")}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Bell className="mr-2 h-4 w-4" />
                {t("landing.realTimeUpdates")}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Camera className="mr-2 h-4 w-4" />
                {t("landing.photoUpload")}
              </Badge>
            </motion.div>

            {/* Community Impact */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-16 inline-flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 shadow-lg"
            >
              <TrendingUp className="h-6 w-6 text-success" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">{t("landing.communityImpact")}</p>
                <p className="text-2xl font-bold text-success">{totalResolved} {t("landing.issuesResolved")}</p>
              </div>
            </motion.div>

            {/* Portal Selection */}
            <div className={`grid gap-8 ${user && isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl mx-auto'}`}>
              {/* Citizen Portal */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold">{t("citizen.subtitle")}</h2>
                  <p className="mb-6 text-muted-foreground">
                    {t("citizen.citizenPortalDescription")}
                  </p>
                  <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t("landing.interactiveMap")}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t("landing.aiEnhanced")}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t("landing.statusTracking")}
                    </li>
                  </ul>
                  <Button
                    onClick={() => handlePortalNavigation("citizen")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-responsive"
                    size="lg"
                  >
                    {user ? t("landing.openCitizen") : t("landing.signIn")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>

              {/* Admin Portal - Only visible to admins */}
              {user && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-xl"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-3xl" />
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold">{t("admin.subtitle")}</h2>
                    <p className="mb-6 text-muted-foreground">
                      {t("landing.tacticalDashboard")}
                    </p>
                    <ul className="mb-6 space-y-2 text-left text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {t("landing.liveMapPins")}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {t("landing.kanbanWorkflow")}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {t("landing.analyticsInsights")}
                      </li>
                    </ul>
                    <Button
                        onClick={() => handlePortalNavigation("admin")}
                        variant="outline"
                        className="w-full btn-responsive"
                        size="lg"
                      >
                      {t("landing.openAdmin")}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-card/50 px-6 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="mb-2 text-5xl font-bold text-primary">{reports.length}</p>
              <p className="text-muted-foreground">{t("landing.totalReports")}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="mb-2 text-5xl font-bold text-warning">
                {reports.filter(r => r.status === "In Progress").length}
              </p>
              <p className="text-muted-foreground">{t("landing.activeCases")}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <p className="mb-2 text-5xl font-bold text-success">{totalResolved}</p>
              <p className="text-muted-foreground">{t("landing.resolvedIssues")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t("landing.howItWorks")}</h2>
            <p className="text-xl text-muted-foreground">
              {t("landing.howItWorksSubtitle")}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="relative"
            >
              <Card className="p-8 text-center h-full border-2 hover:border-primary transition-colors">
                <div className="mb-6 relative">
                  <div className="inline-flex rounded-full bg-primary text-primary-foreground p-6 shadow-lg">
                    <MapPin className="h-10 w-10" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center text-lg">
                    1
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t("landing.step1Title")}</h3>
                <p className="text-muted-foreground">
                  {t("landing.step1Description")}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="relative"
            >
              <Card className="p-8 text-center h-full border-2 hover:border-primary transition-colors">
                <div className="mb-6 relative">
                  <div className="inline-flex rounded-full bg-primary text-primary-foreground p-6 shadow-lg">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center text-lg">
                    2
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t("landing.step2Title")}</h3>
                <p className="text-muted-foreground">
                  {t("landing.step2Description")}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="relative"
            >
              <Card className="p-8 text-center h-full border-2 hover:border-primary transition-colors">
                <div className="mb-6 relative">
                  <div className="inline-flex rounded-full bg-primary text-primary-foreground p-6 shadow-lg">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 flex items-center justify-center text-lg">
                    3
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold mb-4">{t("landing.step3Title")}</h3>
                <p className="text-muted-foreground">
                  {t("landing.step3Description")}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('citizen.powerfulFeatures')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('citizen.featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MapPin, title: t('citizen.interactiveMaps'), desc: t('citizen.clickToReport') },
              { icon: Zap, title: t('citizen.aiEnhancement'), desc: t('citizen.autoImprove') },
              { icon: Bell, title: t('citizen.smartNotifications'), desc: t('citizen.stayUpdated') },
              { icon: BarChart3, title: t('citizen.analyticsDashboard'), desc: t('citizen.trackTrends') },
              { icon: Shield, title: t('citizen.securePlatform'), desc: t('citizen.enterpriseSecurity') },
              { icon: Award, title: t('citizen.communityImpact'), desc: t('citizen.gamifiedEngagement') }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + idx * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-6 py-20 relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-2">
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">{t('citizen.makingImpact')}</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('citizen.joinCommunity')}
              </p>
              <div className="grid gap-8 md:grid-cols-3 mt-12">
                <div>
                  <p className="text-5xl font-bold text-primary mb-2">{reports.length}+</p>
                  <p className="text-muted-foreground">{t('citizen.issuesReported')}</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-warning mb-2">
                    {Math.round((totalResolved / (reports.length || 1)) * 100)}%
                  </p>
                  <p className="text-muted-foreground">{t('citizen.resolutionRate')}</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-success mb-2">&lt; 48h</p>
                  <p className="text-muted-foreground">{t('citizen.avgResponseTime')}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-20 relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-3xl" />
            <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-12 border-2 border-primary/20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('citizen.readyToMakeDifference')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('citizen.joinThousand')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => !user ? navigate("/auth") : navigate("/citizen")}
                  size="lg"
                  className="text-lg px-6 py-4 sm:px-8 sm:py-6 group btn-responsive"
                >
                  {user ? "Go to Portal" : "Get Started Today"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                {!user && (
                  <Button
                    onClick={() => navigate("/auth")}
                    size="lg"
                    variant="outline"
                    className="text-lg px-6 py-4 sm:px-8 sm:py-6 btn-responsive"
                  >
                    Learn More
                  </Button>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 bg-card/30">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/trileqe.jpg" alt="CityCare logo" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-2xl font-bold">CityCare</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Empowering communities through technology
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 CityCare. Built with ❤️ for better cities.
          </p>
          <div className="mt-4">
            <a href="/contact" className="text-sm underline hover:text-primary">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

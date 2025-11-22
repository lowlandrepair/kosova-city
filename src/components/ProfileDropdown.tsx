import { useState, useEffect } from "react";
import { User, Settings, FileText, LogOut, Edit2, Check, X, Globe, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReports } from "@/contexts/ReportContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ProfileDropdown = () => {
  const { user, signOut, profile, updateProfile } = useAuth();
  const { reports } = useReports();
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMyReports, setShowMyReports] = useState(false);

  useEffect(() => {
    if (profile?.display_name) {
      setEditValue(profile.display_name);
    }
  }, [profile]);

  const handleUpdateName = async () => {
    if (!user || !editValue.trim()) return;
    
    setIsLoading(true);
    try {
      await updateProfile(editValue.trim());
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your name has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const myReports = reports.filter((r) => r.userId === user?.id);
  const displayName = profile?.display_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-success/10 text-success border-success/20";
      case "In Progress":
        return "bg-warning/10 text-warning border-warning/20";
      case "Pending":
        return "bg-muted/50 text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2 p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={handleUpdateName}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4 text-success" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => {
                          setIsEditing(false);
                          setEditValue(displayName);
                        }}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{displayName || "User"}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  {myReports.length} Report{myReports.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                  {myReports.filter((r) => r.status === "Resolved").length} Resolved
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowMyReports(true)} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>{t("profile.myReports")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <Globe className="h-3 w-3" />
              {t("common.language")}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { code: "en", label: "EN" },
                { code: "sq", label: "SQ" },
                { code: "es", label: "ES" },
                { code: "fr", label: "FR" },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  size="sm"
                  variant={language === lang.code ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => setLanguage(lang.code as any)}
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
            {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>{isDarkMode ? t("common.lightMode") : t("common.darkMode")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("common.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showMyReports} onOpenChange={setShowMyReports}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("profile.myReports")} ({myReports.length})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {myReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t("profile.noReports")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold truncate">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)} variant="outline">
                              {t(`report.status.${report.status.toLowerCase().replace(" ", "")}`)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-primary">{t(`report.categories.${report.category.toLowerCase()}`)}</span>
                            <span>•</span>
                            <span>{t(`report.priority.${report.priority.toLowerCase()}`)}</span>
                            <span>•</span>
                            <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {report.imageUrl && (
                          <img
                            src={report.imageUrl}
                            alt={report.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

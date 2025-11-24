import * as React from "react";
import { Menu, X, Home, Users, Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Header: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="w-full z-40 top-0 left-0">
      <div className="site-container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="inline-flex items-center gap-2">
            <img src="/trileqe.jpg" alt="CityCare" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-lg font-semibold">CityCare</span>
          </NavLink>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">
            <Home className="inline mr-2 h-4 w-4" /> {t("common.home")}
          </NavLink>
          <NavLink to="/citizen" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">
            <Users className="inline mr-2 h-4 w-4" /> {t("common.citizen")}
          </NavLink>
          <NavLink to="/contact" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">
            {t("common.contact")}
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">
              <Shield className="inline mr-2 h-4 w-4" /> {t("common.admin")}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="p-6">
                <SheetTitle className="sr-only">{t("common.menu")}</SheetTitle>
                <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2">
                    <img src="/trileqe.jpg" alt="CityCare" className="h-8 w-8 rounded-full object-cover" />
                    <span className="text-lg font-semibold">CityCare</span>
                  </div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </div>

                <nav className="flex flex-col gap-3">
                  <NavLink to="/" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">{t("common.home")}</NavLink>
                  <NavLink to="/citizen" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">{t("common.citizen")}</NavLink>
                  {isAdmin && <NavLink to="/admin" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">{t("common.admin")}</NavLink>}
                  {!user && <NavLink to="/auth" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">{t("common.signIn")}</NavLink>}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

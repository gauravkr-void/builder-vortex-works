import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogIn, LogOut, Shield, Map } from "lucide-react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Header({ onLoginClick, onSos }: { onLoginClick?: () => void; onSos?: () => void }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Map className="text-primary" />
            <span>Transit Lite</span>
          </Link>
          <span className="hidden sm:inline-block text-muted-foreground">{t("brand")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSos}>
            <Shield className="mr-1" /> {t("sos")}
          </Button>
          <Select value={lang} onValueChange={(v) => setLang(v as any)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          {!isAuthenticated ? (
            <Button onClick={onLoginClick}>
              <LogIn /> {t("login")}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-muted-foreground">{user?.email}</span>
              {location.pathname !== "/dashboard" && (
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>{t("dashboard")}</Button>
              )}
              <Button variant="outline" onClick={logout}>
                <LogOut /> {t("logout")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

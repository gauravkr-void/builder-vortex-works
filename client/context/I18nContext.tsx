import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "hi";

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    brand: "Smart Transport for Small Cities",
    tagline: "Real-time bus and auto tracking for Tier-2 cities",
    login: "Login",
    signup: "Sign up",
    email: "Email",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verify: "Verify",
    logout: "Logout",
    dashboard: "Dashboard",
    searchRoutesStops: "Search routes or stops",
    notify5: "Notify me when bus is 5 mins away",
    sos: "Safety / SOS",
    light: "Light",
    dark: "Dark",
    mapEta: "ETA",
    driver: "Driver",
    route: "Route",
    language: "Language",
  },
  hi: {
    brand: "छोटे शहरों के लिए स्मार्ट परिवहन",
    tagline: "टिय��-2 शहरों के लिए रीयल-टाइम बस और ऑटो ट्रैकिंग",
    login: "लॉगिन",
    signup: "साइन अप",
    email: "ईमेल",
    sendOtp: "ओटीपी भेजें",
    enterOtp: "ओटीपी दर्ज करें",
    verify: "सत्यापित करें",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    searchRoutesStops: "रूट या स्टॉप खोजें",
    notify5: "बस 5 मिनट दूर हो तो सूचित करें",
    sos: "सुरक्षा / एसओएस",
    light: "लाइट",
    dark: "डार्क",
    mapEta: "अनुमानित समय",
    driver: "ड्राइवर",
    route: "रूट",
    language: "भाषा",
  },
};

interface I18nValue {
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
}

const I18nContext = createContext<I18nValue | undefined>(undefined);
const STORAGE_KEY = "smart-transport-lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "hi") setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const t = (key: string) => STRINGS[lang][key] ?? key;

  const value = useMemo(() => ({ lang, t, setLang }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface User {
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  startLogin: (email: string) => void;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
  pendingEmail: string | null;
  otpSentAt: number | null;
  otp: string | null; // exposed only for mock UX display
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "smart-transport-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const startLogin = (email: string) => {
    setPendingEmail(email);
    // Generate a 6-digit OTP and "send" it
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setOtp(generated);
    setOtpSentAt(Date.now());
    toast.success("OTP sent", { description: `Use code ${generated} (mock)` });
  };

  const verifyOtp = (code: string) => {
    if (code === otp && pendingEmail) {
      const newUser = { email: pendingEmail };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setPendingEmail(null);
      setOtp(null);
      setOtpSentAt(null);
      toast.success("Logged in");
      return true;
    }
    toast.error("Invalid OTP");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    startLogin,
    verifyOtp,
    logout,
    pendingEmail,
    otpSentAt,
    otp,
  }), [user, pendingEmail, otpSentAt, otp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

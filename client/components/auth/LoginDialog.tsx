import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { startLogin, verifyOtp, pendingEmail, otp } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "otp">("email");

  const handleSend = () => {
    if (!email) return;
    startLogin(email);
    setStage("otp");
  };

  const handleVerify = () => {
    if (verifyOtp(code)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {stage === "email" ? t("login") : t("enterOtp")}
          </DialogTitle>
          <DialogDescription>
            {stage === "email" ? t("email") : t("enterOtp")}{" "}
            {stage === "otp" && otp ? `(mock: ${otp})` : ""}
          </DialogDescription>
        </DialogHeader>
        {stage === "email" ? (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleSend}>
              {t("sendOtp")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              placeholder={t("enterOtp")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button className="w-full" onClick={handleVerify}>
              {t("verify")}
            </Button>
            <p className="text-xs text-muted-foreground">{pendingEmail}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

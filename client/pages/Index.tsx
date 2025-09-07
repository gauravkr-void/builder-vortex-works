import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setLoginOpen(true)} onSos={() => alert("SOS triggered. Stay safe!")} />
      <main className="container mx-auto px-4 py-12 flex-1 grid items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Smart Transport for Small Cities
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Real-time public transport tracking for Tier-2 cities. Lightweight, fast, and commuter-focused.
            </p>
            <div className="flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <Button size="lg" onClick={() => setLoginOpen(true)}>Login / Signup</Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/dashboard")}>Open Dashboard</Button>
              )}
              <Button variant="outline" size="lg" onClick={() => alert("SOS triggered. Stay safe!")}>Safety / SOS</Button>
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li>• Live bus/auto locations</li>
              <li>• ETA calculations</li>
              <li>• Route/stop search</li>
              <li>• Alerts when 5 mins away</li>
              <li>• Dark/Light mode</li>
              <li>• English + Hindi</li>
            </ul>
          </div>
          <Card>
            <CardContent className="p-0">
              <img src="/placeholder.svg" alt="Map preview" className="w-full h-auto rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Transit Lite</footer>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}

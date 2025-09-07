import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@shared/routes";
import { TransportMap } from "@/components/map/TransportMap";
import { RouteSearch } from "@/components/search/RouteSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ETAInfo } from "@shared/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [notify, setNotify] = useState<{ busId: string } | null>(null);
  const [latestEta, setLatestEta] = useState<ETAInfo | null>(null);

  useEffect(() => {
    if (latestEta && latestEta.minutes <= 5) {
      toast.success(`Bus ${latestEta.busId} ~${latestEta.minutes.toFixed(0)} min away`);
    }
  }, [latestEta]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSos={() => alert("SOS triggered. Local authorities will be notified in a real app.")} />
      <main className="container mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TransportMap routes={ROUTES} onEta={setLatestEta} onNotify={(id) => setNotify({ busId: id })} notifyTarget={notify} />
          <Card>
            <CardHeader>
              <CardTitle>ETA</CardTitle>
            </CardHeader>
            <CardContent>
              {latestEta ? (
                <div className="text-lg">Bus {latestEta.busId} • ~{latestEta.minutes.toFixed(0)} min • {(latestEta.distanceMeters/1000).toFixed(1)} km</div>
              ) : (
                <div className="text-muted-foreground">Select a bus marker to view ETA</div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteSearch />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => setNotify(latestEta ? { busId: latestEta.busId } : null)} disabled={!latestEta}>
                Notify me when bus is 5 mins away
              </Button>
              <Button variant="outline" className="w-full" onClick={() => alert("SOS triggered. Stay safe!")}>Safety / SOS</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

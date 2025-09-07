import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@shared/routes";
import type { RouteInfo, Stop } from "@shared/api";

export function RouteSearch({
  onSelectStop,
}: {
  onSelectStop?: (stop: Stop) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q)
      return [] as Array<{ type: "route" | "stop"; data: RouteInfo | Stop }>;
    const arr: Array<{ type: "route" | "stop"; data: RouteInfo | Stop }> = [];
    for (const r of ROUTES) {
      if (
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q)
      ) {
        arr.push({ type: "route", data: r });
      }
      for (const s of r.stops) {
        if (s.name.toLowerCase().includes(q))
          arr.push({ type: "stop", data: s });
      }
    }
    return arr.slice(0, 8);
  }, [query]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search routes or stops"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <Card>
          <CardContent className="p-2 divide-y">
            {results.map((r, i) => (
              <div
                key={i}
                className="p-2 hover:bg-accent cursor-pointer text-sm"
                onClick={() => {
                  if (r.type === "stop" && onSelectStop)
                    onSelectStop(r.data as Stop);
                }}
              >
                {r.type === "route"
                  ? `Route: ${(r.data as RouteInfo).name}`
                  : `Stop: ${(r.data as Stop).name}`}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

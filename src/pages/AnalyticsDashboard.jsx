import React, { useEffect, useState } from "react";
import { BarChart3, LockKeyhole } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { listAnalyticsEvents } from "@/lib/backend";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") listAnalyticsEvents().then(setEvents);
  }, [user]);

  if (user?.role !== "admin") {
    return <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center"><LockKeyhole className="h-10 w-10 text-muted-foreground" /><h1 className="mt-4 font-display text-2xl font-bold">Admin access required</h1></div>;
  }

  const counts = events.reduce((result, event) => ({ ...result, [event.event_name || event.eventName || "unknown"]: (result[event.event_name || event.eventName || "unknown"] || 0) + 1 }), {});
  return (
    <div className="min-h-screen py-12"><div className="mx-auto max-w-5xl px-5 lg:px-8">
      <div className="flex items-center gap-3"><BarChart3 className="h-7 w-7 text-primary" /><div><p className="text-xs uppercase tracking-[0.2em] text-primary">Admin</p><h1 className="font-display text-4xl font-bold">Engagement analytics</h1></div></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(counts).map(([name, count]) => <div key={name} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{name.replaceAll("_", " ")}</p><p className="mt-2 font-display text-3xl font-bold text-primary">{count}</p></div>)}</div>
      {!events.length && <p className="mt-12 text-center text-muted-foreground">No analytics records are available yet.</p>}
    </div></div>
  );
}
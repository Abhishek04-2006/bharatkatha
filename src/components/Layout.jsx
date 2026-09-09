import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Flame } from "lucide-react";
import { getPoints, getRank } from "@/lib/gamification";

const NAV = [
  { label: "Home", path: "/" },
  { label: "Explore India", path: "/explore" },
  { label: "AI Characters", path: "/characters" },
  { label: "Create Katha", path: "/create" },
  { label: "My Roots", path: "/roots" },
  { label: "Community", path: "/community" },
  { label: "Profile", path: "/profile" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [points, setPoints] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPoints(getPoints());
    setOpen(false);
  }, [location.pathname]);

  const { current } = getRank(points);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-2xl shadow-black/40" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-900/40">
              <Flame className="h-5 w-5 text-background" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-tight text-gradient-gold">
                BharatKatha
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
                Step Inside History
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:border-primary/50 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground">{points}</span>
              <span className="text-muted-foreground hidden md:inline">{current.name}</span>
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg border border-border text-foreground"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden glass-strong border-t border-border">
            <nav className="px-5 py-4 flex flex-col gap-1">
              {NAV.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-card"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600">
                <Flame className="h-4 w-4 text-background" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-bold text-gradient-gold">BharatKatha</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              History is not just something we read. It is something we can experience, create and preserve.
              An interactive AI-powered platform to step inside India's living heritage.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground font-semibold mb-3">Journey</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {NAV.slice(0, 4).map((n) => (
                <li key={n.path}>
                  <Link to={n.path} className="hover:text-primary transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground font-semibold mb-3">More</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {NAV.slice(4).map((n) => (
                <li key={n.path}>
                  <Link to={n.path} className="hover:text-primary transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Discover. Experience. Create. Preserve.
            </p>
            <p className="text-xs text-muted-foreground">
              Educational prototype · AI-generated reconstructions, not primary sources.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
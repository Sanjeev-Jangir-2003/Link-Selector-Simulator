import { Link, useLocation } from "wouter";
import { LayoutDashboard, Settings2, BarChart3, Activity, Satellite } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulation", label: "Simulation", icon: Activity },
  { href: "/results", label: "Results", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 h-screen bg-card/40 backdrop-blur-md border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Satellite className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none tracking-tight">QoS Link</h1>
          <span className="text-xs text-muted-foreground">Selector v1.0</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={clsx(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive && "animate-pulse"
                  )}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass p-4 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono text-green-400">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

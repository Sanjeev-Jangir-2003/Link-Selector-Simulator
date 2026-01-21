import { useSimulationStore } from "@/lib/simulation-store";
import { Card } from "@/components/ui/card-hover";
import { NetworkViz } from "@/components/dashboard/NetworkViz";
import { Activity, ArrowRightLeft, Clock, Signal, Play, Pause, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { clsx } from "clsx";

export default function Dashboard() {
  const { currentMetrics, isRunning, startSimulation, pauseSimulation, resetSimulation, tick } = useSimulationStore();

  // Simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const stats = [
    { label: "Throughput", value: `${currentMetrics.throughput} Mbps`, icon: Activity, color: "text-emerald-400" },
    { label: "E2E Delay", value: `${currentMetrics.delay} ms`, icon: Clock, color: "text-amber-400" },
    { label: "Packet Loss", value: `${currentMetrics.packetLoss}%`, icon: Signal, color: "text-rose-400" },
    { label: "QoS Score", value: currentMetrics.score.toFixed(1), icon: ArrowRightLeft, color: "text-primary" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Mission Control</h2>
          <p className="text-muted-foreground">Live telemetry from simulated UAV uplink</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-white/10">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className={clsx(
              "px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all",
              isRunning ? "opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            )}
          >
            <Play className="w-4 h-4" /> Start
          </button>
          <button
            onClick={pauseSimulation}
            disabled={!isRunning}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white/5 transition-all disabled:opacity-50"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-white/5 transition-all text-muted-foreground hover:text-white"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="flex flex-col justify-between" glow>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={clsx("w-5 h-5", stat.color)} />
            </div>
            <div className="mt-4">
              <span className={clsx("text-3xl font-mono font-bold tracking-tight", stat.color)}>
                {stat.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Visualization & Path Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Network Topology" className="h-full">
            <NetworkViz />
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card title="Path Selector" className="h-full">
            <div className="space-y-4">
              {['Path-1', 'Path-2', 'Path-3'].map((path) => {
                const isActive = currentMetrics.activePath === path;
                return (
                  <div
                    key={path}
                    className={clsx(
                      "p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden",
                      isActive 
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                        : "border-white/5 bg-white/5 opacity-60"
                    )}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className={clsx("font-bold font-mono", isActive ? "text-primary" : "text-muted-foreground")}>
                        {path}
                      </span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_cyan]" />}
                    </div>
                    {isActive && (
                      <div className="mt-2 text-xs text-primary/80 font-mono">
                         Active Route via {path === 'Path-1' ? 'Satellite' : path === 'Path-2' ? 'Ground' : 'Relay'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Algorithm Log</h4>
              <div className="font-mono text-xs space-y-2 h-32 overflow-y-auto text-white/60">
                 <p>[{new Date().toLocaleTimeString()}] System initialized.</p>
                 {isRunning && <p className="text-primary">[{new Date().toLocaleTimeString()}] Optimizing route...</p>}
                 {isRunning && currentMetrics.activePath && (
                   <p className="text-emerald-400">
                     [{new Date().toLocaleTimeString()}] Selected {currentMetrics.activePath} (Score: {currentMetrics.score})
                   </p>
                 )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

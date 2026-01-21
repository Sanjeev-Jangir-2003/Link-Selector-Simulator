import { motion } from "framer-motion";
import { Satellite, Router, Wifi } from "lucide-react";
import { useSimulationStore } from "@/lib/simulation-store";
import { clsx } from "clsx";

export function NetworkViz() {
  const activePath = useSimulationStore((state) => state.currentMetrics.activePath);
  const isRunning = useSimulationStore((state) => state.isRunning);

  // Path configurations
  const isPath1 = activePath === "Path-1"; // UAV -> Sat
  const isPath2 = activePath === "Path-2"; // UAV -> Ground
  const isPath3 = activePath === "Path-3"; // UAV -> Relay

  return (
    <div className="w-full h-[400px] relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Planet Earth Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/20 to-transparent blur-2xl" />

      {/* Connection Lines (SVGs) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="gradientFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="cyan" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Path 1: UAV -> Sat -> Server */}
        <motion.path
          d="M 150 200 L 400 80 L 650 200"
          fill="none"
          stroke={isPath1 ? "cyan" : "rgba(255,255,255,0.1)"}
          strokeWidth={isPath1 ? 3 : 1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: isPath1 && isRunning ? Infinity : 0, ease: "linear" }}
        />
        
        {/* Path 2: UAV -> Ground -> Server */}
        <motion.path
          d="M 150 200 L 400 320 L 650 200"
          fill="none"
          stroke={isPath2 ? "magenta" : "rgba(255,255,255,0.1)"}
          strokeWidth={isPath2 ? 3 : 1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: isPath2 && isRunning ? Infinity : 0, ease: "linear" }}
        />

        {/* Path 3: UAV -> Relay -> Sat -> Server */}
        <motion.path
          d="M 150 200 L 250 150 L 400 80 L 650 200"
          fill="none"
          stroke={isPath3 ? "purple" : "rgba(255,255,255,0.1)"}
          strokeWidth={isPath3 ? 3 : 1}
          strokeDasharray={isPath3 ? "10 5" : "0"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: isPath3 && isRunning ? Infinity : 0, ease: "linear" }}
        />
      </svg>

      {/* Nodes */}
      
      {/* UAV (Source) */}
      <motion.div
        className="absolute left-[120px] top-[170px] z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)]">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xs font-mono text-primary font-bold">UAV-1</span>
        </div>
      </motion.div>

      {/* Satellite (Relay 1) */}
      <motion.div
        className="absolute left-[370px] top-[50px] z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={clsx("w-14 h-14 rounded-full bg-card border-2 flex items-center justify-center transition-colors", 
            isPath1 || isPath3 ? "border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]" : "border-white/10"
          )}>
            <Satellite className={clsx("w-7 h-7", isPath1 || isPath3 ? "text-cyan-400" : "text-muted-foreground")} />
          </div>
        </div>
      </motion.div>

      {/* Ground Station (Relay 2) */}
      <div className="absolute left-[370px] bottom-[50px] z-10">
        <div className="flex flex-col items-center gap-2">
          <div className={clsx("w-14 h-14 rounded-full bg-card border-2 flex items-center justify-center transition-colors", 
            isPath2 ? "border-magenta-500 shadow-[0_0_20px_rgba(255,0,255,0.5)]" : "border-white/10"
          )}>
            <Router className={clsx("w-7 h-7", isPath2 ? "text-magenta-500" : "text-muted-foreground")} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">Ground Stn</span>
        </div>
      </div>

      {/* Server (Destination) */}
      <div className="absolute right-[120px] top-[170px] z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-card border-2 border-white/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded bg-white/10 border border-white/20" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">SERVER</span>
        </div>
      </div>
      
    </div>
  );
}

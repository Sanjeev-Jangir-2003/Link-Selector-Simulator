import { Card } from "@/components/ui/card-hover";
import { useSimulationStore } from "@/lib/simulation-store";
import { Sliders } from "lucide-react";

export default function Simulation() {
  const { weights, switchingMargin, decisionInterval, setWeights, setParams } = useSimulationStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Simulation Parameters</h2>
        <p className="text-muted-foreground">Configure the QoS algorithm weights and thresholds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="QoS Weights" glow>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-cyan-400">Throughput Weight (w1)</label>
                <span className="font-mono text-sm">{weights.w1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w1}
                onChange={(e) => setWeights({ ...weights, w1: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-magenta-400">Delay Weight (w2)</label>
                <span className="font-mono text-sm">{weights.w2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w2}
                onChange={(e) => setWeights({ ...weights, w2: parseFloat(e.target.value) })}
                className="w-full accent-magenta-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-purple-400">Packet Loss Weight (w3)</label>
                <span className="font-mono text-sm">{weights.w3.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w3}
                onChange={(e) => setWeights({ ...weights, w3: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-xs text-muted-foreground">
              <p>Total Weight Score Formula:</p>
              <code className="block mt-2 text-primary font-mono">S = (w1 × T) - (w2 × D) - (w3 × L)</code>
            </div>
          </div>
        </Card>

        <Card title="System Thresholds" glow>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Switching Margin (Δ)</label>
                <span className="font-mono text-sm">{switchingMargin.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={switchingMargin}
                onChange={(e) => setParams(parseFloat(e.target.value), decisionInterval)}
                className="w-full accent-white h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Minimum score difference required to trigger a handover. Higher values prevent ping-pong effects.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Decision Interval (Tdec)</label>
                <span className="font-mono text-sm">{decisionInterval} ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={decisionInterval}
                onChange={(e) => setParams(switchingMargin, parseInt(e.target.value))}
                className="w-full accent-white h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Frequency of the route optimization algorithm execution.
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <Sliders className="w-12 h-12 text-muted-foreground/20" />
              <div className="text-xs text-muted-foreground">
                These settings take effect immediately during a running simulation.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

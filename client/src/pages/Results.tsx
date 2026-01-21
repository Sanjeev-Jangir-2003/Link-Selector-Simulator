import { Card } from "@/components/ui/card-hover";
import { useSimulationStore } from "@/lib/simulation-store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border border-white/10 shadow-xl">
        <p className="text-xs font-mono text-muted-foreground mb-1">{new Date(label).toLocaleTimeString()}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Results() {
  const metrics = useSimulationStore((state) => state.metrics);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Performance Analytics</h2>
        <p className="text-muted-foreground">Historical data analysis of link performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Throughput (Mbps)">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="timestamp" tick={false} stroke="rgba(255,255,255,0.2)" />
                <YAxis stroke="rgba(255,255,255,0.2)" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorThroughput)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="End-to-End Delay (ms)">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="timestamp" tick={false} stroke="rgba(255,255,255,0.2)" />
                <YAxis stroke="rgba(255,255,255,0.2)" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="stepAfter" 
                  dataKey="delay" 
                  stroke="#fbbf24" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Packet Loss (%)">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="timestamp" tick={false} stroke="rgba(255,255,255,0.2)" />
                <YAxis stroke="rgba(255,255,255,0.2)" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="packetLoss" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="QoS Score Trend">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="timestamp" tick={false} stroke="rgba(255,255,255,0.2)" />
                <YAxis stroke="rgba(255,255,255,0.2)" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#d946ef" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

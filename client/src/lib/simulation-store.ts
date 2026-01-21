import { create } from 'zustand';

export interface SimulationMetrics {
  timestamp: number;
  throughput: number; // Mbps
  delay: number;      // ms
  packetLoss: number; // %
  activePath: 'Path-1' | 'Path-2' | 'Path-3';
  score: number;
}

interface SimulationState {
  isRunning: boolean;
  metrics: SimulationMetrics[];
  currentMetrics: SimulationMetrics;
  
  // Parameters
  weights: { w1: number; w2: number; w3: number };
  switchingMargin: number;
  decisionInterval: number;
  
  // Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setWeights: (w: { w1: number; w2: number; w3: number }) => void;
  setParams: (margin: number, interval: number) => void;
  tick: () => void;
}

const generateRandomMetrics = (path: string) => {
  // Base values vary by path type to make it interesting
  const baseThroughput = path === 'Path-1' ? 80 : path === 'Path-2' ? 50 : 30;
  const baseDelay = path === 'Path-1' ? 100 : path === 'Path-2' ? 40 : 150;
  
  return {
    throughput: Math.max(0, baseThroughput + (Math.random() * 40 - 20)),
    delay: Math.max(10, baseDelay + (Math.random() * 50 - 25)),
    packetLoss: Math.max(0, Math.random() * 5),
  };
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isRunning: false,
  metrics: [],
  currentMetrics: {
    timestamp: Date.now(),
    throughput: 0,
    delay: 0,
    packetLoss: 0,
    activePath: 'Path-1',
    score: 0,
  },
  
  weights: { w1: 0.4, w2: 0.3, w3: 0.3 },
  switchingMargin: 5.0,
  decisionInterval: 1000,

  startSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),
  resetSimulation: () => set({ 
    isRunning: false, 
    metrics: [], 
    currentMetrics: {
      timestamp: Date.now(),
      throughput: 0,
      delay: 0,
      packetLoss: 0,
      activePath: 'Path-1',
      score: 0,
    } 
  }),

  setWeights: (weights) => set({ weights }),
  setParams: (switchingMargin, decisionInterval) => set({ switchingMargin, decisionInterval }),

  tick: () => {
    const state = get();
    if (!state.isRunning) return;

    const now = Date.now();
    const { w1, w2, w3 } = state.weights;
    
    // Simulate 3 paths
    const p1 = generateRandomMetrics('Path-1');
    const p2 = generateRandomMetrics('Path-2');
    const p3 = generateRandomMetrics('Path-3');

    // Calculate Scores: S = w1*T - w2*D - w3*L (Simplified logic)
    // Normalize logic: T is good (add), D/L are bad (subtract)
    // Scaling to make scores comparable: T(Mbps), D(ms)/10, L(%)*10
    const calcScore = (m: typeof p1) => (w1 * m.throughput) - (w2 * (m.delay / 10)) - (w3 * (m.packetLoss * 10));

    const s1 = calcScore(p1);
    const s2 = calcScore(p2);
    const s3 = calcScore(p3);

    const scores = { 'Path-1': s1, 'Path-2': s2, 'Path-3': s3 };
    const currentPath = state.currentMetrics.activePath;
    const currentScore = scores[currentPath];

    // Find best path
    let bestPath = currentPath;
    let bestScore = currentScore;

    Object.entries(scores).forEach(([path, score]) => {
      if (path === currentPath) return;
      // Switching logic with margin
      if (score > currentScore + state.switchingMargin) {
        if (score > bestScore) {
          bestScore = score;
          bestPath = path as any;
        }
      }
    });

    const activeMetrics = bestPath === 'Path-1' ? p1 : bestPath === 'Path-2' ? p2 : p3;

    const newMetric: SimulationMetrics = {
      timestamp: now,
      throughput: Number(activeMetrics.throughput.toFixed(1)),
      delay: Number(activeMetrics.delay.toFixed(1)),
      packetLoss: Number(activeMetrics.packetLoss.toFixed(2)),
      activePath: bestPath,
      score: Number(bestScore.toFixed(2)),
    };

    set((s) => ({
      metrics: [...s.metrics.slice(-100), newMetric], // Keep last 100 points
      currentMetrics: newMetric,
    }));
  },
}));

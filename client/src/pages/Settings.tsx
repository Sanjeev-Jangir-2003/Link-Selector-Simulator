import { Card } from "@/components/ui/card-hover";
import { useSettings, useCreateSetting, useDeleteSetting } from "@/hooks/use-settings";
import { useSimulationStore } from "@/lib/simulation-store";
import { Trash2, Save, Download, RotateCw } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const createSetting = useCreateSetting();
  const deleteSetting = useDeleteSetting();
  
  const { weights, switchingMargin, decisionInterval, setWeights, setParams } = useSimulationStore();
  const [newProfileName, setNewProfileName] = useState("");

  const handleSaveProfile = () => {
    if (!newProfileName) return;
    createSetting.mutate({
      name: newProfileName,
      weightThroughput: weights.w1,
      weightDelay: weights.w2,
      weightLoss: weights.w3,
      switchingMargin: switchingMargin,
      decisionInterval: decisionInterval,
      isDefault: false
    });
    setNewProfileName("");
  };

  const handleLoadProfile = (profile: any) => {
    setWeights({ w1: profile.weightThroughput, w2: profile.weightDelay, w3: profile.weightLoss });
    setParams(profile.switchingMargin, profile.decisionInterval);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Profile Management</h2>
        <p className="text-muted-foreground">Save and load simulation configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Save Current Config" glow>
          <div className="space-y-6">
             <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm space-y-2">
                <div className="flex justify-between"><span>Throughput (w1):</span> <span className="text-cyan-400">{weights.w1}</span></div>
                <div className="flex justify-between"><span>Delay (w2):</span> <span className="text-magenta-400">{weights.w2}</span></div>
                <div className="flex justify-between"><span>Loss (w3):</span> <span className="text-purple-400">{weights.w3}</span></div>
                <div className="flex justify-between"><span>Margin:</span> <span>{switchingMargin}</span></div>
                <div className="flex justify-between"><span>Interval:</span> <span>{decisionInterval}ms</span></div>
             </div>

             <div className="flex gap-2">
               <input
                 className="flex-1 bg-background border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                 placeholder="Profile Name..."
                 value={newProfileName}
                 onChange={(e) => setNewProfileName(e.target.value)}
               />
               <button
                 onClick={handleSaveProfile}
                 disabled={!newProfileName || createSetting.isPending}
                 className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
               >
                 {createSetting.isPending ? <RotateCw className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5" />}
               </button>
             </div>
          </div>
        </Card>

        <Card title="Saved Profiles">
           {isLoading ? (
             <div className="flex justify-center p-8"><RotateCw className="animate-spin text-muted-foreground" /></div>
           ) : (
             <div className="space-y-3">
               {settings?.length === 0 && <p className="text-muted-foreground text-center py-4">No profiles saved</p>}
               {settings?.map((profile) => (
                 <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                    <span className="font-medium font-display">{profile.name}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleLoadProfile(profile)}
                        className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                        title="Load Profile"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteSetting.mutate(profile.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </Card>
      </div>
    </div>
  );
}

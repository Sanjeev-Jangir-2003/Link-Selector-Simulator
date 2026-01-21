import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Simulation from "@/pages/Simulation";
import Results from "@/pages/Results";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/simulation" component={Simulation} />
      <Route path="/results" component={Results} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto">
            <Router />
          </div>
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

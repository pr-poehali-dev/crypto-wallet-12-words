import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  function handleLogin(isUnlocked: boolean) {
    setLoggedIn(true);
    setUnlocked(isUnlocked);
  }

  function handleLogout() {
    setLoggedIn(false);
    setUnlocked(false);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!loggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Index unlocked={unlocked} onLogout={handleLogout} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/context/WalletContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgentLab from "./pages/AgentLab";
import MeetingScheduler from "./pages/MeetingScheduler";
import InviteHub from "./pages/InviteHub";
import Meeting from "./pages/Meeting";
import RequestlyDashboard from "./pages/RequestlyDashboard";
import AgreementLedger from "./pages/AgreementLedger";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WalletProvider>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agent-lab" element={<AgentLab />} />
              <Route path="/scheduler" element={<MeetingScheduler />} />
              <Route path="/invite/:id" element={<InviteHub />} />
              <Route path="/meeting/:id" element={<Meeting />} />
              <Route path="/requestly" element={<RequestlyDashboard />} />
              <Route path="/ledger" element={<AgreementLedger />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </WalletProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

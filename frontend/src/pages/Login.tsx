import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Mail, Lock, Zap } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const { isConnected } = useWallet();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // login function now handles the fetch, toast, and navigation internally
    await login(formData.email, formData.password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
      <div className="container max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-mono font-bold text-3xl mb-2">Access Gate</h1>
          <p className="text-muted-foreground text-sm">Resume your DeFAI sessions.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 gradient-primary-bg" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="name@example.com" 
                  className="pl-10 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  placeholder="••••••••" 
                  className="pl-10 font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <div className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition-all ${
                isConnected ? "bg-primary/5 border-primary/20" : "bg-secondary/50 border-border"
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-4 w-4 ${isConnected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={isConnected ? "text-primary" : "text-muted-foreground"}>Wallet Sync Check</span>
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground italic">
                    <span>Not Connected</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary-bg text-primary-foreground font-bold py-6 text-base glow-primary"
              disabled={isLoading || !isConnected}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
              {!isLoading && <Zap className="ml-2 h-4 w-4" />}
            </Button>
            
            {!isConnected && (
              <p className="text-[10px] text-center text-red-400 font-mono animate-pulse">
                * Please connect wallet to access dashboard
              </p>
            )}
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          New to CloneChain? <Link to="/register" className="text-primary hover:underline underline-offset-4">Create Persona</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
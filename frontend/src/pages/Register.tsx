import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, User, Brain, MessageSquare, Zap, Shield, Check } from "lucide-react";
import { Link } from "react-router-dom";

const steps = ["Identity", "AI Behavior", "Communication"];

const Register = () => {
  const { address, isConnected, connectWallet } = useWallet();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    occupation: "",
    walletAddress: address || "",
    customInstructions: "",
    behavioralPreference: "Proactive",
    styleTone: "Formal",
    interestsValues: "",
  });

  const update = (key: string, value: string) => setFormData((f) => ({ ...f, [key]: value }));

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    // Ensure wallet address is updated if it was connected late
    const finalData = { ...formData, walletAddress: address || formData.walletAddress };
    await register(finalData);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container max-w-lg px-4">
        <div className="text-center mb-8">
          <h1 className="font-mono font-bold text-3xl mb-2">Create Your Persona</h1>
          <p className="text-muted-foreground text-sm">Set up your Master Personality for CloneChain.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-bold transition-colors ${
                i <= step ? "gradient-primary-bg text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-xl glow-border">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-primary font-mono text-sm">
                  <User className="h-4 w-4" /> Step 1: Basic Identity
                </div>
                
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Nickname</Label>
                  <Input value={formData.nickname} onChange={(e) => update("nickname", e.target.value)} placeholder="How the AI refers to you" className="font-mono" />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Email Address</Label>
                  <Input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" className="font-mono" />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Password</Label>
                  <Input type="password" value={formData.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="font-mono" />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Occupation</Label>
                  <Input value={formData.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="e.g. Startup Founder, Developer" className="font-mono" />
                </div>

                <div className="pt-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Wallet Link</Label>
                  {isConnected ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-primary/20">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-xs font-mono truncate">{address}</span>
                    </div>
                  ) : (
                    <Button onClick={connectWallet} variant="outline" className="w-full border-dashed border-primary/40 hover:bg-primary/5 text-primary">
                      <Zap className="h-4 w-4 mr-2" /> Connect Wallet to Link Identity
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-primary font-mono text-sm">
                  <Brain className="h-4 w-4" /> Step 2: AI Behavior
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Custom Instructions</Label>
                  <Textarea 
                    value={formData.customInstructions} 
                    onChange={(e) => update("customInstructions", e.target.value)} 
                    placeholder="General rules for how the AI should process info..." 
                    rows={4} 
                    className="font-mono" 
                  />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Behavioral Preference</Label>
                  <Select value={formData.behavioralPreference} onValueChange={(v) => update("behavioralPreference", v)}>
                    <SelectTrigger className="font-mono">
                      <SelectValue placeholder="Select behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proactive">Proactive (Self-starting)</SelectItem>
                      <SelectItem value="Reactive">Reactive (Follows lead)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 text-primary font-mono text-sm">
                  <MessageSquare className="h-4 w-4" /> Step 3: Communication Style
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Style & Tone</Label>
                  <Select value={formData.styleTone} onValueChange={(v) => update("styleTone", v)}>
                    <SelectTrigger className="font-mono">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formal">Formal & Professional</SelectItem>
                      <SelectItem value="Casual">Casual & Friendly</SelectItem>
                      <SelectItem value="Humorous">Humorous & Witty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Interests & Values</Label>
                  <Textarea 
                    value={formData.interestsValues} 
                    onChange={(e) => update("interestsValues", e.target.value)} 
                    placeholder="Describe your moral compass and core values..." 
                    rows={6} 
                    className="font-mono" 
                  />
                </div>

                <div className="pt-2 rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tighter italic">
                    By clicking Register, you bake these traits into your Master Identity.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0} className="font-mono text-xs">
              <ArrowLeft className="mr-2 h-3 w-3" /> Back
            </Button>
            
            {step < 2 ? (
              <Button onClick={handleNext} disabled={step === 0 && (!formData.nickname || !formData.email || !formData.password || !isConnected)} className="gradient-primary-bg text-primary-foreground font-bold px-6">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-primary-bg text-primary-foreground font-bold px-8 glow-primary">
                Complete Onboarding <Zap className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline underline-offset-4">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

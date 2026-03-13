import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/context/WalletContext";
import { Bot, ArrowRight, ArrowLeft, Zap, Check, Brain, Shield, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const steps = ["Identity", "Personality", "Decision Logic", "Review & Mint"];

const brainOptions = [
  { id: "ollama", label: "Ollama (Local)", desc: "Free, private, runs on your machine", icon: Brain },
  { id: "gemini", label: "Gemini (Cloud)", desc: "High performance, pay-as-you-go", icon: Zap },
];

const AgentLab = () => {
  const { isConnected } = useWallet();
  const { mintAgent, isLoading } = useContract();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    systemPrompt: "",
    decisionLogic: "",
    iqStake: "100",
    brain: "gemini",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    try {
      const result = await mintAgent(form.name, form.systemPrompt);
      toast.success(`Agent minted as IQ AI Token! TX: ${result.txHash.slice(0, 10)}...`);
      navigate("/dashboard");
    } catch {
      toast.error("Failed to mint agent");
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <FlaskConical className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Connect to create and mint your AI clone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h1 className="font-mono font-bold text-2xl md:text-3xl">Agent Lab</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Define personality → Mint as IQ AI Token → Record on Ethereum/Base.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-bold transition-colors ${
                i <= step ? "gradient-primary-bg text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-6 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Form steps */}
        <div className="rounded-lg border border-border bg-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Label className="text-sm font-medium mb-2 block">Agent Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g., NegotiatorX" className="font-mono mb-4" />
                <Label className="text-sm font-medium mb-2 block">IQ Token Stake</Label>
                <div className="relative mb-4">
                  <Input value={form.iqStake} onChange={(e) => update("iqStake", e.target.value)} type="number" className="font-mono pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" /> IQ
                  </span>
                </div>
                <Label className="text-sm font-medium mb-2 block">AI Brain</Label>
                <div className="grid grid-cols-2 gap-3">
                  {brainOptions.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => update("brain", b.id)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        form.brain === b.id ? "border-primary glow-border" : "border-border bg-secondary/50 hover:border-muted-foreground"
                      }`}
                    >
                      <b.icon className={`h-5 w-5 mb-2 ${form.brain === b.id ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-mono text-sm font-medium">{b.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Label className="text-sm font-medium mb-2 block">System Prompt (Personality)</Label>
                <Textarea value={form.systemPrompt} onChange={(e) => update("systemPrompt", e.target.value)}
                  placeholder="You are an aggressive deal-closer who maximizes value..." rows={6} className="font-mono mb-2" />
                <p className="text-xs text-muted-foreground">This defines how your agent behaves during negotiations.</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Label className="text-sm font-medium mb-2 block">Decision Logic</Label>
                <Textarea value={form.decisionLogic} onChange={(e) => update("decisionLogic", e.target.value)}
                  placeholder="Accept deals above 500 IQ. Reject if counterparty offers less than 20%..." rows={6} className="font-mono mb-2" />
                <p className="text-xs text-muted-foreground">Rules your agent follows when deciding to accept or reject terms.</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-mono font-semibold mb-4">Review Your Agent</h3>
                <div className="space-y-4">
                  <div className="rounded-md bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="font-mono font-medium">{form.name || "—"}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">IQ Stake</p>
                    <p className="font-mono font-medium flex items-center gap-1"><Zap className="h-3 w-3 text-primary" />{form.iqStake} IQ</p>
                  </div>
                  <div className="rounded-md bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">AI Brain</p>
                    <p className="font-mono font-medium">{form.brain === "ollama" ? "Ollama (Local)" : "Gemini (Cloud)"}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">Personality</p>
                    <p className="text-sm">{form.systemPrompt || "—"}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-4">
                    <p className="text-xs text-muted-foreground mb-1">Decision Logic</p>
                    <p className="text-sm">{form.decisionLogic || "—"}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    Minting will create an IQ AI Token on Ethereum/Base and stake {form.iqStake} IQ.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} className="gradient-primary-bg text-primary-foreground glow-primary">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} className="gradient-primary-bg text-primary-foreground glow-primary">
                {isLoading ? "Minting..." : "Mint Agent"} <Zap className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLab;

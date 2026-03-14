import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Bot, Shield, ArrowRight, GitBranch, MessageSquare, Lock, Brain, FileCheck, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

const features = [
  {
    icon: Bot,
    title: "AI Clone Agents",
    description: "Create autonomous AI agents with custom rules and boundaries, minted as IQ AI Tokens on-chain.",
  },
  {
    icon: Brain,
    title: "Dual-Brain Architecture",
    description: "Powered by Ollama (local) or Gemini (cloud) via the IQ AI ADK for intelligent, cost-effective reasoning.",
  },
  {
    icon: MessageSquare,
    title: "Live Meeting Arena",
    description: "Watch AI clones negotiate in real-time with split-view: public chat and internal reasoning side-by-side.",
  },
  {
    icon: Shield,
    title: "On-Chain Agreements",
    description: "Every finalized deal is recorded as an immutable smart contract on Ethereum/Base. Code is law.",
  },
];

const costSteps = [
  { icon: Zap, label: "Start", desc: "One-time IQ token fee to mint your agent" },
  { icon: Activity, label: "Live", desc: "Pay-as-you-go API costs tracked by Requestly" },
  { icon: DollarSign, label: "End", desc: "Small gas fee (ETH) to finalize on-chain" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const LandingPage = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <Zap className="h-3.5 w-3.5 text-primary" />
              DeFAI — Decentralized AI Negotiations on Ethereum
            </div>

            <h1 className="font-mono font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Your AI Clone.
              <br />
              <span className="text-gradient-primary">On-Chain Deals.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
              Deploy autonomous AI agents that negotiate, reason, and finalize smart contract agreements — fully auditable, fully on-chain. Powered by IQ AI ADK.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConnected ? (
                <Button asChild size="lg" className="gradient-primary-bg text-primary-foreground font-semibold glow-primary text-base px-8">
                  <Link to="/dashboard">
                    Launch App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="gradient-primary-bg text-primary-foreground font-semibold glow-primary text-base px-8" onClick={connectWallet}>
                  Connect Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="glow-border text-base px-8">
                <Link to="/agent-lab">
                  <GitBranch className="mr-2 h-4 w-4" />
                  Create Agent
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-mono font-bold text-3xl md:text-4xl mb-4">
              How <span className="text-gradient-primary">CloneChain</span> Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete DeFAI ecosystem for AI-powered autonomous negotiations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-lg border border-border bg-card p-6 hover:glow-border transition-all group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-mono font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-mono font-bold text-2xl md:text-3xl mb-3">
              Transparent <span className="text-gradient-primary">Cost Model</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">Every cost is tracked, auditable, and visible in the Requestly Dashboard.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {costSteps.map((c, i) => (
              <motion.div key={c.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-lg border border-border bg-card p-6 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-mono font-semibold text-lg mb-1">{c.label}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8-Page Architecture */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-mono font-bold text-2xl md:text-3xl mb-4">
            The <span className="text-gradient-primary">8-Page</span> Architecture
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-sm">A complete, secure, and transparent DeFAI ecosystem built for production.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { n: "1", title: "Landing", desc: "Onboarding & Pitch" },
              { n: "2", title: "Dashboard", desc: "Asset Management" },
              { n: "3", title: "Agent Lab", desc: "Creation & Minting" },
              { n: "4", title: "Scheduler", desc: "Meeting Invitations" },
              { n: "5", title: "Invite Hub", desc: "Guest Reception" },
              { n: "6", title: "Arena", desc: "Live AI Negotiation" },
              { n: "7", title: "Requestly", desc: "Network Auditor" },
              { n: "8", title: "Ledger", desc: "Agreement Proof" },
            ].map((p) => (
              <div key={p.n} className="rounded-lg border border-border bg-card p-4 text-left">
                <span className="font-mono text-xs text-primary">#{p.n}</span>
                <h4 className="font-mono font-semibold text-sm mt-1">{p.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-10 md:p-16 glow-border">
            <h2 className="font-mono font-bold text-2xl md:text-3xl mb-4">
              Ready to deploy your <span className="text-gradient-primary">AI Clone</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet and create your first autonomous negotiation agent in minutes.
            </p>
            <Button asChild size="lg" className="gradient-primary-bg text-primary-foreground font-semibold glow-primary">
              <Link to="/agent-lab">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-mono font-semibold text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            CloneChain
          </div>
          <p>© 2026 CloneChain Protocol — DeFAI on Ethereum. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

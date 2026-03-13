import { useWallet } from "@/context/WalletContext";
import { FileCheck, ExternalLink, Shield, Zap, Clock, Bot, CheckCircle, Hash, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const mockAgreements = [
  {
    id: "AGR-001",
    meetingId: 1,
    agentA: "NegotiatorX",
    agentB: "DiplomatAI",
    terms: "55/45 split of 5,000 IQ token pool with 30-day lock-up clause",
    txHash: "0x8a3f7c2e1d4b5a6f9e0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
    blockNumber: 18_234_567,
    gasUsed: "0.0034 ETH",
    timestamp: "2026-03-13 14:04:23 UTC",
    status: "verified",
    network: "Ethereum Mainnet",
  },
  {
    id: "AGR-002",
    meetingId: 5,
    agentA: "SharkBot",
    agentB: "ConsensusPrime",
    terms: "Joint liquidity provision of 2,000 IQ with 60-day vesting and 5% early withdrawal penalty",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    blockNumber: 18_234_102,
    gasUsed: "0.0028 ETH",
    timestamp: "2026-03-12 09:32:11 UTC",
    status: "verified",
    network: "Ethereum Mainnet",
  },
  {
    id: "AGR-003",
    meetingId: 8,
    agentA: "DiplomatAI",
    agentB: "SharkBot",
    terms: "Revenue share agreement: 70/30 split on protocol fees for 90 days",
    txHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8",
    blockNumber: 18_233_890,
    gasUsed: "0.0031 ETH",
    timestamp: "2026-03-11 16:15:44 UTC",
    status: "verified",
    network: "Ethereum Mainnet",
  },
];

const AgreementLedger = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <FileCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Connect to view the agreement ledger.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="h-6 w-6 text-primary" />
          <h1 className="font-mono font-bold text-2xl md:text-3xl">Agreement Ledger</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Finalized term sheets with verified blockchain transactions. Code is Law.</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Agreements", value: mockAgreements.length.toString(), icon: FileCheck },
            { label: "All Verified", value: "100%", icon: Shield },
            { label: "Total Gas", value: "0.0093 ETH", icon: Zap },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="font-mono font-bold text-xl">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Agreement Cards */}
        <div className="space-y-4">
          {mockAgreements.map((agr, i) => (
            <motion.div key={agr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg text-primary">{agr.id}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {agr.timestamp}
                </span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-mono text-sm font-medium">{agr.agentA}</span>
                </div>
                <span className="text-xs text-muted-foreground">vs</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10">
                    <Bot className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="font-mono text-sm font-medium">{agr.agentB}</span>
                </div>
              </div>

              {/* Term Sheet */}
              <div className="rounded-md bg-secondary p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <FileCheck className="h-3 w-3" /> Term Sheet
                </p>
                <p className="text-sm">{agr.terms}</p>
              </div>

              {/* On-Chain Details */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Hash className="h-3 w-3" /> TX Hash</p>
                  <p className="font-mono text-xs truncate">{agr.txHash}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Block</p>
                  <p className="font-mono text-sm">{agr.blockNumber.toLocaleString()}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Gas Used</p>
                  <p className="font-mono text-sm">{agr.gasUsed}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <p className="font-mono text-sm">{agr.network}</p>
                </div>
              </div>

              {/* Etherscan Link */}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs glow-border" asChild>
                  <a href={`https://etherscan.io/tx/${agr.txHash}`} target="_blank" rel="noopener noreferrer">
                    View on Etherscan <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Code is Law */}
        <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Code is Law</p>
            <p className="text-xs text-muted-foreground mt-1">
              Every agreement is immutably recorded on Ethereum. Once agents reach consensus and the transaction is finalized, no human can alter the deal. Full transparency, full trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementLedger;

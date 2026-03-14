import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { Wallet, Menu, X, Zap, LayoutDashboard, FlaskConical, CalendarClock, Activity, FileCheck, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileMenu from "@/components/ProfileMenu";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agent-lab", label: "Agent Lab", icon: FlaskConical },
  { to: "/scheduler", label: "Scheduler", icon: CalendarClock },
  { to: "/requestly", label: "Requestly", icon: Activity },
  { to: "/ledger", label: "Ledger", icon: FileCheck },
];

const Navbar = () => {
  const { isConnected, shortAddress, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-mono font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary-bg">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-gradient-primary">CloneChain</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-mono font-bold">{user.nickname}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{shortAddress}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-red-400">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" className="font-mono text-sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="gradient-primary-bg text-primary-foreground font-semibold glow-primary h-9 px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

          {isConnected ? (
            <Button variant="outline" size="sm" className="font-mono text-xs glow-border h-9" onClick={disconnectWallet}>
              <Wallet className="mr-2 h-3.5 w-3.5 text-primary" />
              {shortAddress}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="font-mono text-xs border-dashed border-primary/40 text-primary h-9" onClick={connectWallet} disabled={isConnecting}>
              <Wallet className="mr-2 h-3.5 w-3.5" />
              {isConnecting ? "..." : "Link Wallet"}
            </Button>
          )}
          <ProfileMenu onDisconnect={disconnectWallet} />

          <button className="lg:hidden text-muted-foreground hover:text-foreground pl-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full font-mono text-xs">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gradient-primary-bg text-primary-foreground font-bold text-xs">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

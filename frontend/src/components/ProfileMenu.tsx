import { useAuth } from "@/context/AuthContext"; // Switched to Auth for session data
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Settings, User, LogOut, ShieldCheck, Zap } from "lucide-react";

const ProfileMenu = ({ onDisconnect }: { onDisconnect: () => void }) => {
  const { user, logout } = useAuth(); // Getting live user data
  const { shortAddress } = useWallet();

  // Fallbacks to ensure the UI never looks empty
  const displayName = user?.nickname || "Initialize Persona";
  const occupation = user?.occupation || "Digital Entity";
  const walletDisplay = user?.walletAddress 
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` 
    : shortAddress;

  const handleLogout = () => {
    logout();
    onDisconnect(); // Disconnect wallet simultaneously
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-mono text-xs glow-border gap-2 h-9 border-primary/20 hover:bg-primary/5">
          <div className="relative">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
              <User className="h-3 w-3 text-primary" />
            </div>
            {/* Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border-2 border-background"></span>
          </div>
          <span className="hidden sm:inline-block max-w-[100px] truncate">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2 bg-background/95 backdrop-blur-xl border-primary/20">
        <DropdownMenuLabel className="flex flex-col gap-1 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold font-mono text-primary flex items-center gap-1">
              <Zap className="h-3 w-3 fill-primary" /> {displayName}
            </span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
              LVL 1
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground italic truncate">{occupation}</span>
          <div className="flex items-center gap-1.5 mt-2 p-1.5 rounded bg-secondary/50 border border-border">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-mono text-muted-foreground truncate">{walletDisplay}</span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-primary/10" />
        
        <DropdownMenuItem asChild className="focus:bg-primary/10 cursor-pointer">
          <Link to="/profile" className="flex items-center gap-2 py-2">
            <Settings className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Profile Settings</span>
              <span className="text-[10px] text-muted-foreground">Update your identity & AI traits</span>
            </div>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-primary/10" />
        
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer flex items-center gap-2 py-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-semibold">Terminate Session</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
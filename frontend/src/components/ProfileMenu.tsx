import { useProfile } from "@/context/ProfileContext";
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
import { Settings, User, LogOut } from "lucide-react";

const ProfileMenu = ({ onDisconnect }: { onDisconnect: () => void }) => {
  const { profile } = useProfile();
  const { shortAddress } = useWallet();

  const displayName = profile?.nickname || "User";
  const walletDisplay = profile?.walletAddress ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}` : shortAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-mono text-sm glow-border gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
            <User className="h-3 w-3 text-primary" />
          </div>
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold">{displayName}</span>
          {profile?.occupation && <span className="text-xs text-muted-foreground">{profile.occupation}</span>}
          {walletDisplay && <span className="text-xs text-muted-foreground font-mono mt-1">{walletDisplay}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex gap-2">
            <Settings className="h-4 w-4" />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDisconnect} className="text-red-600 cursor-pointer flex gap-2">
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  networkName: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  shortAddress: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState("Unknown");

  const isConnected = !!address;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  // Helper to update account and network info
  const updateWalletInfo = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          // Optional: Get network name
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          setNetworkName(getNetworkNameByChainId(chainId));
        } else {
          setAddress(null);
        }
      } catch (error) {
        console.error("Error fetching wallet info", error);
      }
    }
  }, []);

  // Handle Logic for Connecting
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
    } catch (error) {
      console.error("User rejected connection", error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Note: True "disconnect" isn't possible via code with MetaMask (security reasons).
  // We simply clear the local state to "log out" the user from our app.
  const disconnectWallet = useCallback(() => {
    setAddress(null);
  }, []);

  // Listen for account/network changes in MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      updateWalletInfo(); // Check if already connected on load

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAddress(accounts.length > 0 ? accounts[0] : null);
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // Recommended by MetaMask to reload on chain change
      });
    }
  }, [updateWalletInfo]);

  return (
    <WalletContext.Provider value={{ address, isConnecting, isConnected, networkName, connectWallet, disconnectWallet, shortAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

// Simple helper to map Chain IDs
const getNetworkNameByChainId = (chainId: string) => {
  switch (chainId) {
    case "0x1": return "Ethereum Mainnet";
    case "0xaa36a7": return "Sepolia";
    default: return "Unknown Network";
  }
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
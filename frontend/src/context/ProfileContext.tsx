import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface UserProfile {
  nickname: string;
  occupation: string;
  walletAddress: string;
  customInstructions: string;
  behaviorPreferences: string;
  stylePreferences: string;
  tonePreferences: string;
  moreAboutYou: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (profile: UserProfile) => void;
  loadProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  nickname: "",
  occupation: "",
  walletAddress: "",
  customInstructions: "",
  behaviorPreferences: "",
  stylePreferences: "",
  tonePreferences: "",
  moreAboutYou: "",
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  const loadProfile = useCallback(() => {
    setIsLoading(true);
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(defaultProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage
  const saveProfile = useCallback((newProfile: UserProfile) => {
    try {
      localStorage.setItem("userProfile", JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, saveProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

import { useState } from "react";
import { useProfile, UserProfile } from "@/context/ProfileContext";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CheckCircle, User, Wallet } from "lucide-react";

const Profile = () => {
  const { profile, saveProfile } = useProfile();
  const { address, connectWallet } = useWallet();
  const [formData, setFormData] = useState<UserProfile>(
    profile || {
      nickname: "",
      occupation: "",
      walletAddress: "",
      customInstructions: "",
      behaviorPreferences: "",
      stylePreferences: "",
      tonePreferences: "",
      moreAboutYou: "",
    }
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEditing(true);
  };

  const handleSave = () => {
    saveProfile(formData);
    setIsSaved(true);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (profile) {
      setFormData(profile);
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Customize your personal preferences and behavior</p>
          </div>
        </div>

        {/* Save Success Alert */}
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-600 border border-green-500/20"
          >
            <CheckCircle className="h-5 w-5" />
            Profile saved successfully!
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Wallet Connection */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Blockchain Wallet
              </CardTitle>
              <CardDescription>Manage your connected wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="walletAddress" className="text-base font-semibold">
                  Wallet Address
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Your blockchain wallet address</p>
                <div className="flex gap-2">
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    value={formData.walletAddress || address || ""}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="border-border/50 font-mono text-sm"
                  />
                  {!formData.walletAddress && address && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, walletAddress: address }));
                        setIsEditing(true);
                      }}
                      className="border-border/50"
                    >
                      Use Current
                    </Button>
                  )}
                  {!address && (
                    <Button
                      type="button"
                      onClick={connectWallet}
                      className="gradient-primary-bg text-primary-foreground font-semibold"
                    >
                      Connect
                    </Button>
                  )}
                </div>
                {address && (
                  <p className="text-xs text-green-600 mt-2">✓ Connected: {address}</p>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Basic Information</CardTitle>
              <CardDescription>How would you like to be known?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nickname" className="text-base font-semibold">
                  Nickname
                </Label>
                <p className="text-xs text-muted-foreground mb-2">What should we call you?</p>
                <Input
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="e.g., Alex"
                  className="border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="occupation" className="text-base font-semibold">
                  Occupation
                </Label>
                <p className="text-xs text-muted-foreground mb-2">What do you do?</p>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="e.g., Product Designer"
                  className="border-border/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Personalization */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Customization</CardTitle>
              <CardDescription>Define your preferences and behavior patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customInstructions" className="text-base font-semibold">
                  Custom Instructions
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Specific guidelines or preferences for interactions</p>
                <Textarea
                  id="customInstructions"
                  name="customInstructions"
                  value={formData.customInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g., I prefer concise explanations, technical terminology is fine"
                  className="min-h-24 border-border/50 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="behaviorPreferences" className="text-base font-semibold">
                  Additional Behavior Preferences
                </Label>
                <p className="text-xs text-muted-foreground mb-2">How should the system behave around you?</p>
                <Textarea
                  id="behaviorPreferences"
                  name="behaviorPreferences"
                  value={formData.behaviorPreferences}
                  onChange={handleInputChange}
                  placeholder="e.g., Be proactive in suggesting optimizations, Ask for clarification when needed"
                  className="min-h-24 border-border/50 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="stylePreferences" className="text-base font-semibold">
                  Style Preferences
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Your preferred style of communication</p>
                <Textarea
                  id="stylePreferences"
                  name="stylePreferences"
                  value={formData.stylePreferences}
                  onChange={handleInputChange}
                  placeholder="e.g., Formal, casual, humorous, minimalist"
                  className="min-h-24 border-border/50 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="tonePreferences" className="text-base font-semibold">
                  Tone Preferences
                </Label>
                <p className="text-xs text-muted-foreground mb-2">The tone you prefer in responses</p>
                <Textarea
                  id="tonePreferences"
                  name="tonePreferences"
                  value={formData.tonePreferences}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional, friendly, encouraging, direct"
                  className="min-h-24 border-border/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* More About You */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">More About You</CardTitle>
              <CardDescription>Share your interests and values</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="moreAboutYou" className="text-base font-semibold">
                Interests, Values & Preferences
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Anything else we should know about you?</p>
              <Textarea
                id="moreAboutYou"
                name="moreAboutYou"
                value={formData.moreAboutYou}
                onChange={handleInputChange}
                placeholder="e.g., Interested in AI/blockchain, values privacy and security, prefers data-driven decisions"
                className="min-h-32 border-border/50 resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            {isEditing && (
              <Button variant="outline" onClick={handleReset} className="border-border/50">
                Reset
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!isEditing}
              className="gradient-primary-bg text-primary-foreground font-semibold"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

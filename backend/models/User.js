import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // --- Basic Identity ---
    nickname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    occupation: { type: String },
    walletAddress: { type: String, sparse: true }, // Removed unique constraint to allow wallet switching

    // --- AI Personality (From your images/conclusion) ---
    customInstructions: { type: String, default: "" },
    behaviorPreferences: { type: String, default: "" },
    stylePreferences: { type: String, default: "" },
    tonePreferences: { type: String, default: "" },
    interestsAndValues: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

/**
 * PASSWORD ENCRYPTION HOOK
 * This automatically runs before the .save() method is called.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
 * Use this during login to check if the entered password matches the hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
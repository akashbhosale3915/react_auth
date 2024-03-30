import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('OTP', OtpSchema);

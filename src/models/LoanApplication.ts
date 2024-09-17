// src/models/LoanApplication.ts
import mongoose, { Document, Model } from "mongoose";

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  purpose: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LoanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const LoanApplication: Model<ILoanApplication> =
  mongoose.models.LoanApplication ||
  mongoose.model<ILoanApplication>("LoanApplication", LoanApplicationSchema);

export default LoanApplication;

import mongoose, { Schema } from "mongoose";
import { IDeploymentDocument } from "../types";

const deploymentSchema = new Schema<IDeploymentDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  gitUrl: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["queued", "deploying", "success", "failed"],
    default: "queued",
  },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDeploymentDocument>(
  "Deployment",
  deploymentSchema,
);

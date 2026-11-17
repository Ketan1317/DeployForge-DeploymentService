import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../types';

const userSchema = new Schema<IUserDocument>({
  githubId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  profile: { type: Schema.Types.Mixed },
  githubAccessToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserDocument>('User', userSchema);

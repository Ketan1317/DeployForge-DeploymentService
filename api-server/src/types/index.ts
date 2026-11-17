import { Document, Types } from 'mongoose';

export interface IUser {
  githubId: string;
  username: string;
  email?: string;
  avatar?: string;
  profile?: Record<string, unknown>;
  githubAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export type DeploymentStatus = 'queued' | 'deploying' | 'success' | 'failed';

export interface IDeployment {
  userId: Types.ObjectId;
  title: string;
  gitUrl: string;
  slug: string;
  status: DeploymentStatus;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeploymentDocument extends IDeployment, Document {
  _id: Types.ObjectId;
}

export interface AuthUserSummary {
  id: Types.ObjectId | string;
  username: string;
  avatar?: string;
  email?: string;
}

export interface GitHubLoginResult {
  success: boolean;
  token: string;
  user: AuthUserSummary;
}

export interface UserProfileData {
  id: Types.ObjectId | string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserProfileResult {
  success: boolean;
  data: UserProfileData;
}

export interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  description: string | null;
  private: boolean;
  language: string | null;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
  description: string | null;
  private: boolean;
  language: string | null;
  updatedAt: string;
}

export interface UserReposResult {
  success: boolean;
  data: GitHubRepo[];
}

export interface CreateDeploymentData {
  id: Types.ObjectId | string;
  slug: string;
  title: string;
  gitUrl: string;
  url?: string;
  userId: Types.ObjectId | string;
}

export interface CreateDeploymentResult {
  success: boolean;
  status: string;
  data: CreateDeploymentData;
}

export interface DeploymentSummary extends Partial<IDeployment> {
  id: string;
  _id?: Types.ObjectId;
}

export interface GetDeploymentsResult {
  success: boolean;
  data: DeploymentSummary[];
}

export interface UploadResult {
  url: string;
  publicId: string;
  size: number;
}

export interface DeleteImageResult {
  success: boolean;
  message: string;
}

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

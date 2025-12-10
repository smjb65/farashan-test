export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum PostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PostType {
  SPEECH = 'SPEECH',
  MANQABAT = 'MANQABAT'
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string; // For display
  role: UserRole;
  isDeleted: boolean;
  password?: string; // Only for admin view mock
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName?: string; // Denormalized for ease
  type: PostType;
  title: string;
  description: string;
  mediaUrl: string; // URL from Arvan Cloud
  mediaType: 'video' | 'audio';
  posterUrl?: string; // Optional poster image
  status: PostStatus;
  rejectionReason?: string;
  location?: string;
  date?: string; // Stored as ISO, displayed as Jalali
  views: number;
  downloads: number;
  createdAt: string;
  comments?: Comment[];
}

// For form handling
export interface UploadFormData {
  title: string;
  description: string;
  type: PostType;
  location?: string;
  date?: string;
  mediaFile: File | null;
  posterFile: File | null;
}
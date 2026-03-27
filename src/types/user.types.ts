export type Role = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt?: string; // ISO date string
  image?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // Optional relations for frontend use
  sessions?: Session[];
  accounts?: Account[];
  events?: Event[];
  participation?: EventParticipant[];
  sentInvitations?: Invitation[];
  receivedInvitations?: Invitation[];
  reviews?: Review[];
  payments?: Payment[];
  notifications?: Notification[];
}

// Example nested types (simplified for frontend)
export interface Session {
  id: string;
  token: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Account {
  id: string;
  providerId: string;
  accountId: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  status: string;
}

export interface EventParticipant {
  id: string;
  status: string;
}

export interface Invitation {
  id: string;
  status: string;
  message?: string;
  expiresAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isEdited: boolean;
  editedAt?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
}
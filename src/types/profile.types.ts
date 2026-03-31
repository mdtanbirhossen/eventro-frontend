import { Role, UserStatus } from "@/types/enums";

// ─── Profile ─────────────────────────────────────────────────

export interface IProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  status: UserStatus;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

/** PATCH /auth/me or your profile update endpoint */
export interface IUpdateProfilePayload {
  name?: string;
  image?: string | null;
}

// ─── Change Password ──────────────────────────────────────────

/** POST /auth/change-password */
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Delete Account ───────────────────────────────────────────

/** Whatever endpoint your backend uses to soft-delete the user */
export interface IDeleteAccountPayload {
  password: string; // confirm identity before deleting
}
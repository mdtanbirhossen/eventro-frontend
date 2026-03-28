import { Role, UserStatus } from "./enums";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
 
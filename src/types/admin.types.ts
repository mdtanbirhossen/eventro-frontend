import { PaginationMeta } from "./api.types";
import { Role, UserStatus } from "./enums";

export interface ICreateAdminPayload {
  admin: {
    email: string;
    name: string;
  };
  password: string;
  role: Role.ADMIN;
}
 

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role.ADMIN;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
 
export interface IAdminListResponse {
  data: IAdmin[];
  meta: PaginationMeta;
}
 
import { Role } from "./user.types";

export interface ILoginResponse {
    token : string;
    accessToken : string;
    refreshToken : string;
    user : {
        needPasswordChange : boolean;
        email : string;
        name : string;
        role : string;
        image: string;
        status : string;
        isDeleted : boolean;
        emailVerified : boolean;
    }
}

export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
  iat: number;
  exp: number;
}
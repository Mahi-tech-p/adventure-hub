import { AuthenticatedUser, User } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

export {};
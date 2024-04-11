import { User as UserType } from "../../types.ts";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

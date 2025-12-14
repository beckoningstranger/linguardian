import "next-auth";
import "next-auth/jwt";

import { SessionUser } from "@linguardian/shared/contracts/users";

declare module "next-auth" {
    interface User extends SessionUser {}

    interface Session {
        user: SessionUser;
        accessToken?: string;
    }

    interface JWT extends SessionUser {
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends SessionUser {
        accessToken: string;
    }
}

import { ReactNode } from "react";
import { checkRole } from "./checkrole";

export const AuthGuardComp = ({ roles, children }: { roles: string[], children: ReactNode }) => {
    const isAuthorized = checkRole(roles, localStorage.getItem("roles")?.split(','));

    return isAuthorized ? children : null;

}
import { ReactNode } from "react";
import { checkRole } from "./checkrole";
import { getRoles } from "./localstorage";

export const AuthGuardComp = ({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) => {
  let isAuthorized = checkRole(roles, getRoles());

  return isAuthorized ? children : null;
};
export const isAuthorizedForRoles = (requiredRoles: string[]): boolean => {
  return checkRole(requiredRoles, getRoles());
};

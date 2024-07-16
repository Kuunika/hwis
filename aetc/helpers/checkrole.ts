export const checkRole = (requiredRoles: string[], authenticatedRoles: string[] | undefined) => {

    // TODO: remove temporary fix
    return true;
    // if (!authenticatedRoles) return false
    // return authenticatedRoles.some(role => requiredRoles.flatMap(role=>role?.split(",")).includes(role));
}
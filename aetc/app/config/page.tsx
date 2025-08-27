"use client";

import { MainButton } from "@/components";
import { UsersList } from "./users/components";
import { useNavigation } from "@/hooks";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";

function Page() {
  const { navigateTo } = useNavigation();

  return (
    <>
      <MainButton
        title={"create user"}
        onClick={() => navigateTo("/config/users/create")}
      />
      <UsersList />
    </>
  );
}
export default AuthGuard(Page, [roles.ADMIN]);

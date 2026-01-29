"use client";
import { addUser } from "@/hooks/users";
import { UserForm } from "../components";
import { OverlayLoader } from "@/components/backdrop";
import { useEffect } from "react";
import { useNavigation } from "@/hooks";
import { MainTypography } from "@/components";
import { BackButton } from "@/components/buttons";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";

function Page() {
  const { mutate, isPending, isSuccess } = addUser();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (isSuccess) {
      navigateTo("/config");
    }
  }, [isSuccess]);

  const handleSubmit = (values: any) => {
    const payload = {
      username: values.userName,
      password: values.password,
      given_name: values.firstName,
      family_name: values.lastName,
      roles: values.role.map((r: any) => r.id),
      location_id: 1,
    };

    mutate(payload);
  };
  return (
    <>
      <BackButton />
      <MainTypography variant="h5">Create User</MainTypography>
      <br />
      <UserForm initialValues={{}} onSubmit={handleSubmit} />
      <OverlayLoader open={isPending} />
    </>
  );
}

export default AuthGuard(Page, [roles.ADMIN]);

"use client";
import { addUser } from "@/hooks/users";

import { OverlayLoader } from "@/components/backdrop";
import { useEffect } from "react";
import { useNavigation } from "@/hooks";
import { MainTypography } from "@/components";
import { BackButton } from "@/components/buttons";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { PrinterForm } from "../components/printerForm";
import { addPrinter } from "@/hooks/printers";

function Page() {
  const { mutate, isPending, isSuccess } = addPrinter();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (isSuccess) {
      navigateTo("/config/printers");
    }
  }, [isSuccess]);

  return (
    <>
      <BackButton />
      <MainTypography variant="h5">Add Printer</MainTypography>
      <br />
      <PrinterForm
        initialValues={{ name: "", ip_address: "" }}
        onSubmit={mutate}
      />
      <OverlayLoader open={isPending} />
    </>
  );
}

export default AuthGuard(Page, [roles.ADMIN]);

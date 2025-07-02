"use client";
import { BackButton } from "@/components";
import { OverlayLoader } from "@/components/backdrop";
import { useNavigation, useParameters } from "@/hooks";
import { getOnePrinter, editPrinter } from "@/hooks/printers";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { PrinterForm } from "./printerForm";

export const PrinterEditForm = () => {
  const { params } = useParameters();
  const { isLoading, data } = getOnePrinter(params?.id as string);
  const { isSuccess, mutate } = editPrinter(params?.id as string);
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (isSuccess) {
      navigateTo("/config/printers");
    }
  }, [isSuccess]);

  return (
    <>
      <BackButton />
      <Typography variant="h5">Edit Printer</Typography>
      <br />
      <PrinterForm
        initialValues={data ? data : { name: "", ip_address: "" }}
        onSubmit={mutate}
      />
      <OverlayLoader open={isLoading} />
    </>
  );
};

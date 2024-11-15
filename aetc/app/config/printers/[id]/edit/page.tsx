"use client";
import { OverlayLoader } from "@/components/backdrop";
import { useNavigation, useParameters } from "@/hooks";
import { editPrinter, getOnePrinter } from "@/hooks/printers";
import { useEffect } from "react";
import { PrinterForm } from "../../components/printerForm";
import { Typography } from "@mui/material";
import { BackButton } from "@/components";

export default function Page() {
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
}

"use client";
import { Button } from "@mui/material";
import { PrinterList } from "./components/printerList";
import { useNavigation } from "@/hooks";

export default function Page() {
  const { navigateTo } = useNavigation();
  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigateTo(`/config/printers/create`)}
      >
        Add Printer
      </Button>
      <PrinterList />
    </>
  );
}

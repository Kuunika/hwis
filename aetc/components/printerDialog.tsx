'use client'
import { usePrinterDialog } from "@/contexts/printer";
import { GenericDialog } from "./dialog";
import { SelectPrinter } from "./selectPrinter";
import { Button } from "@mui/material";

export const PrinterDialog = () => {
  const { open, setOpen, setPrinter, handlePrint } = usePrinterDialog();

  return (
    <GenericDialog open={open} onClose={() => setOpen(false)} title="Printers">
      <SelectPrinter setPrinter={setPrinter} />
      <Button variant="contained" onClick={handlePrint} >Print</Button>
    </GenericDialog>
  );
};

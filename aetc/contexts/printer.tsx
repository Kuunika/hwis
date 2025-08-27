"use client";
import axios from "axios";
import { useContext, useState } from "react";

import { createContext, FC, ReactNode } from "react";

export type PrinterContextType = {
  zpl: string;
  setZpl: (zpl: string) => void;
  setOpen: (open: any) => void;
  open: boolean;
  printer: string;
  setPrinter: (values: any) => void;
  handlePrint: () => void;
};

export const PrinterContext = createContext<PrinterContextType | null>(null);

export const PrinterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [zpl, setZpl] = useState("");
  const [printer, setPrinter] = useState("");
  const [open, setOpen] = useState(false);

  const handlePrint = async () => {
    const response = await axios.post(`${printer}/print`, { zpl });
    if (response.statusText == "OK") {
      setOpen(false);
    }
  };

  return (
    <PrinterContext.Provider
      value={{ open, setOpen, zpl, setZpl, printer, setPrinter, handlePrint }}
    >
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinterDialog = (): PrinterContextType => {
  const context = useContext(PrinterContext);
  if (!context) {
    throw new Error("usePrinterDialog must be used within a PrinterProvider");
  }
  return context;
};

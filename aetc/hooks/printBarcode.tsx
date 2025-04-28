import axios from "axios";
import { useEffect, useState } from "react";

export const usePrintBarcode = () => {
  const [zpl, setZpl] = useState("");
  const [printer, setPrinter] = useState("");

  useEffect(() => {
    console.log({ zpl });
  }, [zpl]);

  const printZplData = async () => {
    try {
      await axios.post(`${printer}/print`, { zpl });
    } catch (error) {
      console.error("Error sending ZPL to printer:", error);
    }
  };

  return { zpl, setZpl, printer, setPrinter, printZplData };
};

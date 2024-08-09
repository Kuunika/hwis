import { BasicSelect } from "@/app/patient/components/basicSelect";
import { useEffect, useState } from "react";



export const PrinterSelect = ({getValue}:{getValue:(value:any)=>void}) => {
  const [printer, setPrinter] = useState("http://localhost:3000");
  useEffect(()=>{
    getValue(printer)
  },[printer])


  return (
    <BasicSelect
      getValue={(value: any) => {
        setPrinter(value);
      }}
      label="Select Printer"
      options={[
        {
          value: "http://localhost:3000",
          label: "Local",
        },
        {
          value: `${process.env.NEXT_PUBLIC_PRINTER_IP}`,
          label: "Network",
        },
      ]}
    />
  );
};

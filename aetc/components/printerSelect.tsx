import { BasicSelect } from "@/app/patient/components/basicSelect";
import { getPrinters } from "@/hooks/loadStatic";
import { useEffect, useState } from "react";

export const PrinterSelect = ({
  getValue,
}: {
  getValue: (value: any) => void;
}) => {
  const [printer, setPrinter] = useState("http://localhost:3000");
  const { data, isLoading } = getPrinters();
  useEffect(() => {
    getValue(printer);
  }, [printer]);

  return (
    <BasicSelect
      getValue={(value: any) => {
        setPrinter(value);
      }}
      label="Select Printer"
      options={
        !data
          ? []
          : data?.map((d) => {
              return { value: d.ip_address, label: d.name };
            })
      }
    />
  );
};

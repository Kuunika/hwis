import { BasicSelect } from "@/app/patient/components/basicSelect";
import { getPrinters } from "@/hooks/loadStatic";

export const SelectPrinter = ({
  setPrinter,
}: {
  setPrinter: (value: any) => void;
}) => {
  const { data, isLoading } = getPrinters();

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

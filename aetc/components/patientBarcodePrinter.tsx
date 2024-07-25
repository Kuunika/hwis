import { Address, Identifier, Person } from "@/interfaces";
import { GenericDialog, MainButton, MainTypography } from ".";
import {
  BarcodeComponent,
  PatientRegistrationBarcodeTemplate,
} from "./barcode";
import { useState } from "react";
import { BasicSelect } from "@/app/patient/components/basicSelect";
import { getPatientId } from "@/helpers/emr";
import { SxProps } from "@mui/material";

type Props = {
  firstName: string;
  lastName: string;
  identifiers: Identifier[];
  addresses: Address[];
};

export const PatientBarcodePrinter = ({
  firstName,
  lastName,
  identifiers,
  addresses,
}: Props) => {
  const [printer, setPrinter] = useState("http://localhost:3000");
  const [triggerPrintFunc, setTriggerPrintFunc] = useState<() => any>(() => {});
  return (
    <>
      <PatientRegistrationBarcodeTemplate
        printer={printer}
        setTriggerFunc={(test) => setTriggerPrintFunc(test)}
        value={getPatientId(identifiers)}
      >
        <MainTypography
          fontWeight="600"
          variant="h4"
        >{`${firstName} ${lastName} ~ ${getPatientId(
          identifiers
        )}`}</MainTypography>
        <MainTypography
          fontSize={30}
        >{`${addresses[0]?.address1}, ${addresses[0]?.address2}, ${addresses[0]?.address3}`}</MainTypography>
      </PatientRegistrationBarcodeTemplate>
      <br />
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
      <br />
      <MainButton
        sx={{ color: "#000" }}
        title={"Print Barcode"}
        variant="text"
        onClick={() => {
          const func = triggerPrintFunc();
          if (typeof func === "function") {
            func();
          }
        }}
      />
    </>
  );
};

export const PrinterBarcodeButton = ({ patient, sx }: { patient: Person, sx?:SxProps }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MainButton
        size="small"
        variant="secondary"
        sx={{ fontSize: "12px", ml: "1px",...sx }}
        title="Print"
        onClick={() => setOpen(true)}
      />
      <GenericDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Print Patient Barcode"
      >
        <PatientBarcodePrinter
          firstName={patient.given_name}
          lastName={patient.family_name}
          addresses={patient.addresses}
          identifiers={patient.identifiers}
        />
      </GenericDialog>
    </>
  );
};

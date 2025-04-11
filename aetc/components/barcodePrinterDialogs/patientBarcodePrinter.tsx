import { Address, Identifier, Person } from "@/interfaces";
import { GenericDialog, MainButton, MainTypography } from "..";
import { PatientRegistrationBarcodeTemplate } from "../barcode";
import { useState } from "react";
import { BasicSelect } from "@/app/patient/components/basicSelect";
import { getPatientId } from "@/helpers/emr";
import { IconButton, SxProps, Tooltip } from "@mui/material";
import { getPrinters } from "@/hooks/loadStatic";
import { HiPrinter } from "react-icons/hi2";
import { FaPlay } from "react-icons/fa";

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
  const { data, isLoading } = getPrinters();

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
        options={
          !data
            ? []
            : data?.map((d) => {
                return { value: d.ip_address, label: d.name };
              })
        }
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

export const PrinterBarcodeButton = ({
  patient,
  sx,
  onClose,
  variant = "secondary",
  title = "Print",
  icon,
}: {
  patient: Person;
  sx?: SxProps;
  onClose?: () => void;
  variant?: "secondary" | "text" | "primary";
  title?: string;
  icon?: any;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
     { icon && <Tooltip title="Print" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Print"
          sx={{color:"#015E85"}}
        >
          <HiPrinter />
        </IconButton>
      </Tooltip>}
   {   !icon&&<MainButton
        size="small"
        variant={variant}
        sx={{ fontSize: "12px", ml: "1px", ...sx }}
        title={title}
        icon={icon}
        onClick={() => setOpen(true)}
      />}
      <GenericDialog
        open={open}
        onClose={() => {
          setOpen(false);
          if (onClose) {
            onClose();
          }
        }}
        title="Print Patient Barcode"
      >
        <PatientBarcodePrinter
          firstName={patient?.given_name}
          lastName={patient?.family_name}
          addresses={patient?.addresses}
          identifiers={patient?.identifiers}
        />
      </GenericDialog>
    </>
  );
};

import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import rectangleScan from "../../../icons/rectanglescan.svg";
import documentDemographics from "../../../icons/documentdemographics.svg";
import Image from "next/image";
import Link from "next/link";
import { GenericDialog } from "@/components";
import { ReactNode } from "react";

const MySwal = withReactContent(Swal);

const DialogNationalIdContent = ({ patientId }: { patientId: string }) => {
  const boxStyles = {
    p: "2ch",
    border: "1px solid #E6E6E6",
    width: "272px",
    height: "220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: "16px",
    mx: "2px",
    cursor: "pointer",
  };
  return (
    <WrapperBox sx={{ display: "flex", mb: "5ch" }}>
      <WrapperBox sx={boxStyles}>
        <Link href="/registration/scanner">
          <WrapperBox
            sx={{
              position: "absolute",
              top: 60,
              left: 0,
              width: "100%",
            }}
          >
            <Image src={rectangleScan} alt="scan" />
            <MainTypography>Yes, i need to scan it.</MainTypography>
          </WrapperBox>
        </Link>
      </WrapperBox>

      <WrapperBox sx={boxStyles}>
        <Link href={`/registration/${patientId}/new`}>
          <WrapperBox
            sx={{ position: "absolute", top: 60, left: 0, width: "100%" }}
          >
            <Image src={documentDemographics} alt="demographics" />
            <MainTypography>
              No, i need to enter the demographics manually
            </MainTypography>
          </WrapperBox>
        </Link>
      </WrapperBox>
    </WrapperBox>
  );
};

export const PatientNationalIdCheck = (patientId: any) => {
  return MySwal.fire({
    title: (
      <WrapperBox
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "3ch",
        }}
      >
        <MainTypography
          variant="h1"
          sx={{
            fontFamily: "Inter",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "29px",
            letterSpacing: "0em",
            textAlign: "center",

            width: "275px",
            alignSelf: "center",
          }}
        >
          Does the patient have a National ID card
        </MainTypography>
      </WrapperBox>
    ),
    html: <DialogNationalIdContent patientId={patientId} />,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    showConfirmButton: false,
  });
};

export const LabRequest = (patientId: any) => {
  return MySwal.fire({
    title: (
      <WrapperBox
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "3ch",
        }}
      >
        <MainTypography
          variant="h1"
          sx={{
            fontFamily: "Inter",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "29px",
            letterSpacing: "0em",
            textAlign: "center",

            width: "275px",
            alignSelf: "center",
          }}
        >
          Does the patient have a National ID card
        </MainTypography>
      </WrapperBox>
    ),
    html: <DialogNationalIdContent patientId={patientId} />,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    showConfirmButton: false,
    width: "100%",
    heightAuto: false,
  });
};


export const ShowFormErrors = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: ReactNode }) => {
  return <GenericDialog maxWidth="sm" title="You have the following errors" open={open} onClose={onClose}>
    {children}
    <MainButton title={"ok"} onClick={onClose} />
  </GenericDialog>
}
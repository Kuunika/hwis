import { SxProps } from "@mui/material";
import { MainButton, MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FaCheck } from "react-icons/fa";
import { useNavigation } from "@/hooks";
import { calculateAge } from "@/helpers/dateTime";
import { GenericDialog } from "@/components";
import { useState } from "react";

const color = "#B3B3B3";

type Prop = {
  searchResults: any;
};

export function ResultBox({ searchResults }: Prop) {
  const [patientId, setPatientId] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <MainPaper
      elevation={0}
      sx={{
        zIndex: 1,
        borderRadius: "1ch",
        color,
        py: "1ch",
        position: "absolute",
        width: "100%",
      }}
    >
      <ConfirmationDialog patientId={patientId} onClose={() => setOpen(false)} open={open} />
      <Row
        person_id="ID"
        uuid="Id"
        given_name="Full Name"
        family_name=""
        gender="Gender"
        number="Number"
        birthdate="Birth date"
        sx={{ "&:hover": {} }}
        setPatientId={() => { }}
        setOpen={() => { }}
      />
      <WrapperBox
        sx={{
          width: "100%",
          borderBottomStyle: "dashed",
          borderColor: color,
          borderBottomWidth: "1px",
        }}
      ></WrapperBox>
      <WrapperBox sx={{ maxHeight: "20ch", overflow: "scroll" }}>
        {searchResults.map((result: any) => (
          <Row setPatientId={setPatientId}
            setOpen={() => setOpen(true)} key={result.id} {...result} />
        ))}
      </WrapperBox>
      {/* <WrapperBox sx={{ m: "1ch" }}>{"<AddPatientButton />"}</WrapperBox> */}
    </MainPaper>
  );
}

const Row = ({
  uuid,
  given_name,
  family_name,
  number,
  gender,
  birthdate,
  person_id,
  sx,
  setPatientId,
  setOpen
}: {
  uuid: string;
  given_name: string;
  family_name: string;
  number: string;
  gender: string;
  birthdate: string;
  person_id: string;
  setPatientId: (id: any) => void
  setOpen: () => void
  sx?: SxProps;
}) => {
  const { navigateTo } = useNavigation();
  return (
    <WrapperBox
      onClick={() => { setPatientId(uuid); setOpen() }}
      sx={{
        display: "flex",
        py: "1ch",
        px: "1ch",
        mx: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#EBEBEB",
          ".checkItem": {
            display: "block",
          },
        },
        ...sx,
      }}
    >
      <MainTypography flex={0.1}>{person_id}</MainTypography>
      <MainTypography flex={0.4}>{`${given_name} ${family_name}`}</MainTypography>
      <MainTypography flex={0.2}>{gender}</MainTypography>
      <MainTypography flex={0.3}>{`${birthdate} (${birthdate == "Birth date" ? "Age" : calculateAge(birthdate)})`}</MainTypography>
      <WrapperBox flex={0.1}>
        <MainTypography
          className="checkItem"
          sx={{ display: "none", color: (theme) => theme.palette.primary.main }}
        >
          <FaCheck />
        </MainTypography>
      </WrapperBox>
    </WrapperBox>
  );
};

const ConfirmationDialog = ({ open, onClose, patientId }: { open: boolean, onClose: () => void, patientId: string }) => {
  const { navigateTo } = useNavigation()

  return <GenericDialog maxWidth="sm" title="Confirmation" open={open} onClose={onClose}>
    <MainTypography>you are opening patient profile in view mode. Do you want to continue</MainTypography>
    <MainButton title={"YES"} sx={{ mr: "0.5ch" }} onClick={() => navigateTo(`/patient/${patientId}/profile`)} />
    <MainButton variant="secondary" title={"NO"} onClick={onClose} />

  </GenericDialog>

}
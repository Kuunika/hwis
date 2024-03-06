import { SxProps } from "@mui/material";
import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FaCheck } from "react-icons/fa";
import { useNavigation } from "@/hooks";
import { calculateAge } from "@/helpers/dateTime";

const color = "#B3B3B3";

type Prop = {
  searchResults: any;
};

export function ResultBox({ searchResults }: Prop) {
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
      <Row
        person_id="ID"
        uuid="Id"
        given_name="Full Name"
        family_name=""
        gender="Gender"
        number="Number"
        birthdate="Birth date"
        sx={{ "&:hover": {} }}
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
          <Row key={result.id} {...result} />
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
}: {
  uuid: string;
  given_name: string;
  family_name: string;
  number: string;
  gender: string;
  birthdate: string;
  person_id: string;

  sx?: SxProps;
}) => {
  const { navigateTo } = useNavigation();
  return (
    <WrapperBox
      onClick={() => navigateTo(`/patient/${uuid}/profile`)}
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
      <MainTypography flex={0.2}>{person_id}</MainTypography>
      <MainTypography flex={0.4}>{`${given_name} ${family_name}`}</MainTypography>
      <MainTypography flex={0.2}>{gender}</MainTypography>
      <MainTypography flex={0.2}>{`${birthdate} (${birthdate == "Birth date" ? "Age" : calculateAge(birthdate)})`}</MainTypography>
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

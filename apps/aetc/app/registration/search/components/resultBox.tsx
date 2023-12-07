import { SxProps } from "@mui/material";
import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FaCheck } from "react-icons/fa";
import { useNavigation } from "@/hooks";

const color = "#B3B3B3";

type Prop = {
  searchResults: any;
};

export function ResultBox({ searchResults }: Prop) {
  return (
    <MainPaper
      elevation={0}
      sx={{
        borderRadius: "1ch",
        color,
        py: "1ch",
        position: "absolute",
        width: "100%",
      }}
    >
      <Row
        id="Id"
        fullName="Full Name"
        number="Number"
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
          <Row {...result} />
        ))}
      </WrapperBox>
    </MainPaper>
  );
}

const Row = ({
  id,
  fullName,
  number,
  sx,
}: {
  id: string;
  fullName: string;
  number: string;
  sx?: SxProps;
}) => {
  const { navigateTo } = useNavigation();
  return (
    <WrapperBox
      onClick={() => navigateTo("/patient")}
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
      <MainTypography flex={0.2}>{id}</MainTypography>
      <MainTypography flex={0.6}>{fullName}</MainTypography>
      <MainTypography flex={0.2}>{number}</MainTypography>
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

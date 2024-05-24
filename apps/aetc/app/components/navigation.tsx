import { useNavigation } from "@/hooks";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { FaArrowLeftLong, FaRegCircleQuestion } from "react-icons/fa6";

export const Navigation = ({
  title,
  link,
}: {
  title: string;
  link: string;
}) => {
  const { navigateTo } = useNavigation();
  const fontStyles = {
    //fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "21px",
    letterSpacing: "0em",
    textAlign: "center",
    mx: "1ch",
  };
  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        py: "1ch",
        borderBottom: "solid 1px #E6E6E6",
      }}
    >
      <WrapperBox
        onClick={() => navigateTo(link)}
        sx={{ display: "flex", cursor: "pointer" }}
      >
        <MainTypography>
          <FaArrowLeftLong />
        </MainTypography>
        <MainTypography sx={fontStyles}>Go back</MainTypography>
      </WrapperBox>
      <MainTypography sx={fontStyles}>{title}</MainTypography>
      <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
        <FaRegCircleQuestion />
        <MainTypography sx={fontStyles}>Need any help?</MainTypography>
      </WrapperBox>
    </WrapperBox>
  );
};

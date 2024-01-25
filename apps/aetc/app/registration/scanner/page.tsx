"use client";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { FaArrowLeftLong, FaRegCircleQuestion } from "react-icons/fa6";
import { useNavigation } from "@/hooks";
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function Scanner() {
  return (
    <>
      <Navigation
        title="New Patient Registration"
        link="/registration/search"
      />
      <WrapperBox
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            my: "1ch",
          }}
        >
          National id scanner
        </MainTypography>

        <WrapperBox sx={{ width: "844px", height: "559px" }}>
          <QrScanner
            containerStyle={{
              borderRadius: "10px",
            }}
            onDecode={(result) => console.log(result)}
            onError={(error) => console.log(error?.message)}
          />
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

export const Navigation = ({
  title,
  link,
}: {
  title: string;
  link: string;
}) => {
  const { navigateTo } = useNavigation();
  const fontStyles = {
    fontFamily: "Inter",
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

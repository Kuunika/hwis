"use client";
import { MainTypography, WrapperBox } from "@/components";
import { Navigation } from "@/app/components/navigation";

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
          {/* <QrScanner
            containerStyle={{
              borderRadius: "10px",
            }}
            onDecode={(result) => console.log(result)}
            onError={(error) => console.log(error?.message)}
          /> */}
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

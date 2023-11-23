"use client";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { FcSurvey } from "react-icons/fc";
import { emrLogin, useNavigation } from "@/hooks";

export default function Home() {
  const { navigateTo } = useNavigation();
  emrLogin();
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={2}></MainGrid>
        <MainGrid item lg={6}>
          <br />
          <br />
          <br />
          <MainPaper
            onClick={() => navigateTo("/prescreening")}
            elevation={1}
            sx={{
              p: "1ch",
              py: "4ch",
              width: "30%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <MainTypography variant="h3">
              <FcSurvey />
            </MainTypography>
            <MainTypography variant="h5">Prescreening</MainTypography>
          </MainPaper>
        </MainGrid>
      </MainGrid>
    </>
  );
}

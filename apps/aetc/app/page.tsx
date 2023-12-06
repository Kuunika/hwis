"use client";
import { MainGrid, MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FcSurvey } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import { emrLogin, useNavigation } from "@/hooks";

export default function Home() {
  emrLogin();
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={2}></MainGrid>
        <MainGrid item lg={6}>
          <br />
          <br />
          <br />
          <WrapperBox sx={{ display: "flex" }}>
            <Card link="/initial-registration" title="Initial Registration" />
            <Card link="/prescreening" title="Prescreening" />
          </WrapperBox>
        </MainGrid>
      </MainGrid>
    </>
  );
}

const Card = ({ link, title }: { link: string; title: string }) => {
  const { navigateTo } = useNavigation();
  return (
    <MainPaper
      onClick={() => navigateTo(link)}
      elevation={1}
      sx={{
        p: "1ch",
        py: "4ch",
        mx: "1ch",
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
      <MainTypography variant="h5">{title}</MainTypography>
    </MainPaper>
  );
};

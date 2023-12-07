"use client";
import { MainGrid, MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FcSurvey } from "react-icons/fc";

import { emrLogin, useNavigation } from "@/hooks";
import { LandingPageCollapsible } from "./components";

export default function Home() {
  emrLogin();
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={2}></MainGrid>
        <MainGrid
          item
          lg={6}
          display={"flex"}
          justifyContent={"flex-start"}
          pt="5ch"
        >
          <WrapperBox display={"flex"}>
            <WrapperBox>
              <LandingPageCollapsible />
            </WrapperBox>
            <WrapperBox>Dashboard</WrapperBox>
          </WrapperBox>
          {/* <Card link="/initial-registration" title="Initial Registration" />
          <Card link="/prescreening" title="Patient Waiting Prescreening" />
          <Card link="/prescreening" title="Prescreening" />
          <Card link="/prescreening" title="Prescreening" />
          <Card link="/prescreening" title="Prescreening" />
          <Card link="/prescreening" title="Prescreening" />
          <Card link="/prescreening" title="Prescreening" /> */}
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
        m: "1ch",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <MainTypography variant="h6">
        <FcSurvey />
      </MainTypography>
      <MainTypography>{title}</MainTypography>
    </MainPaper>
  );
};

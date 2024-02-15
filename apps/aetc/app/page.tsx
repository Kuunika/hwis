"use client";
import { MainGrid, MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { FcSurvey } from "react-icons/fc";

import { useNavigation } from "@/hooks";
import { LandingPageCollapsible } from "./components";

import { FcRules, FcSearch, FcTodoList, FcPlus } from "react-icons/fc";

export default function Home() {
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={3}></MainGrid>
        <MainGrid
          item
          lg={8}
          sx={{ display: "flex", flexWrap: "wrap" }}
          pt="5ch"
        >
          {/* <WrapperBox display={"flex"}>
            <WrapperBox>
              <LandingPageCollapsible />
            </WrapperBox>
            <WrapperBox>Dashboard</WrapperBox>
          </WrapperBox> */}
          <Card
            link="/registration/search"
            title="Find Patient"
            icon={<FcSearch />}
          />
          <Card
            link="/initial-registration"
            title="Initial Registration"
            icon={<FcPlus />}
          />
          <Card
            icon={<FcRules />}
            link="/registration/death/list"
            title="Brought In Dead"
          />
          <Card
            icon={<FcTodoList />}
            link="/initial-registration/list"
            title="Patients Waiting for Screening"
          />
          <Card
            icon={<FcTodoList />}
            link="/registration/list"
            title="Patients Waiting for Registration"
          />
          <Card
            icon={<FcTodoList />}
            link="/triage"
            title="Patients Waiting for Triage"
          />
          <Card
            icon={<FcTodoList />}
            link="/assessments"
            title="Patients Waiting for Assessment "
          />
          {/* <Card link="/prescreening" title="Prescreening" /> */}
        </MainGrid>
      </MainGrid>
    </>
  );
}

const Card = ({
  link,
  title,
  icon,
}: {
  link: string;
  title: string;
  icon: any;
}) => {
  const { navigateTo } = useNavigation();
  return (
    <MainPaper
      onClick={() => navigateTo(link)}
      elevation={1}
      sx={{
        p: "1ch",
        m: "1ch",
        width: "25%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <MainTypography variant="h2">{icon}</MainTypography>
      <MainTypography textAlign={"center"}>{title}</MainTypography>
    </MainPaper>
  );
};

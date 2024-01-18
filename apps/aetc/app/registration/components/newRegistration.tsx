"use client";
import { useState, ReactNode } from "react";
import {
  MainButton,
  MainGrid,
  MainPaper,
  MainTypography,
  NewStepperContainer,
  StepperContainer,
  WrapperBox,
} from "shared-ui/src";
import {
  DemographicsForm,
  FinancingForm,
  ReferralForm,
  SocialHistoryForm,
} from "../components";
import { addPatient, useNavigation } from "@/hooks";

import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

export const NewRegistrationFlow = () => {
  const [active, setActive] = useState(1);
  const { navigateTo } = useNavigation();
  return (
    <>
      <MainGrid container>
        <MainGrid item lg={4}></MainGrid>
        <MainGrid
          item
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <br />
          <br />
          {active == 1 && <DemographicsForm onSubmit={() => {}} />}
          {active == 2 && (
            <SocialHistoryForm initialValues={{}} onSubmit={() => {}} />
          )}
          {active == 3 && (
            <ReferralForm initialValues={{}} onSubmit={() => {}} />
          )}
        </MainGrid>
        <MainGrid item lg={4}></MainGrid>
        <RegistrationNavigation
          active={active}
          setActive={(step: number) => setActive(step)}
        />
      </MainGrid>
    </>
  );
};

const RegistrationNavigation = ({
  active,
  setActive,
}: {
  active: number;
  setActive: (step: number) => void;
}) => {
  const buttonStyles = {
    width: "126px",
    height: "44px",
    padding: "10px 18px",
    borderRadius: "8px",
    gap: "8px",
  };
  return (
    <WrapperBox
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
        borderTop: "1px #E6E6E6 solid",
        py: "1ch",
        mb: "2ch",
      }}
    >
      <MainButton
        icon={<FaArrowLeftLong />}
        sx={{
          ...buttonStyles,
          backgroundColor: "#636363",
          "&:hover": { backgroundColor: "#636363" },
        }}
        title={"previous"}
        onClick={() => {
          if (active == 1) return;
          setActive(active - 1);
        }}
      />
      <WrapperBox
        sx={{ display: "flex", alignItems: "center", color: "#00190E" }}
      >
        <NavBox onClick={() => setActive(1)} active={active == 1}>
          Demographics
        </NavBox>
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(2)} active={active == 2}>
          Social History
        </NavBox>
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(3)} active={active == 3}>
          Referral
        </NavBox>
      </WrapperBox>
      <MainButton
        iconRight={<FaArrowRightLong />}
        sx={buttonStyles}
        title={"next"}
        onClick={() => {
          if (active == 3) return;
          setActive(active + 1);
        }}
      />
    </WrapperBox>
  );
};

const NavBox = ({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <WrapperBox
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "1ch",
        borderBottom: active ? "solid 1px #00190E" : "",
        mx: "2ch",
        color: !active ? "#636363" : "",
        cursor: "pointer",
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "0em",
        }}
      >
        {children}
      </MainTypography>
    </WrapperBox>
  );
};

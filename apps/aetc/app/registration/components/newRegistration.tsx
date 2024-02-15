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
import { successDialog } from "@/helpers";

export const NewRegistrationFlow = () => {
  const [active, setActive] = useState(4);
  const { navigateTo } = useNavigation();
  const [registrationData, setRegistrationData] = useState();
  const [demographicsContext, setDemographicsContext] = useState<any>();
  const [socialHistoryContext, setSocialHistoryContext] = useState<any>();
  const [referralContext, setReferralContext] = useState<any>();
  const [financingFormContext, setFinancingFormContext] = useState<any>();

  const changeActive = async (step: number) => {
    if (active == 1) {
      const { submitForm, errors, isValid, touched, dirty } =
        demographicsContext;
      submitForm();

      if (isValid && dirty) {
        setActive(active + 1);
      }
    }
    if (active == 2) {
      const { submitForm, errors, isValid, touched, dirty } =
        socialHistoryContext;
      submitForm();

      if (isValid && dirty) {
        setActive(active + 1);
      }
    }
    if (active == 3) {
      const { submitForm, errors, isValid, touched, dirty } = referralContext;
      submitForm();

      if (isValid && dirty) {
        setActive(active + 1);
      }
    }
  };

  return (
    <>
      <MainGrid sx={{}} container>
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
          {active == 1 && (
            <DemographicsForm
              setContext={setDemographicsContext}
              onSubmit={() => {}}
            />
          )}
          {active == 2 && (
            <SocialHistoryForm
              setContext={setSocialHistoryContext}
              onSubmit={() => {}}
            />
          )}
          {active == 3 && (
            <ReferralForm
              setContext={setReferralContext}
              initialValues={{}}
              onSubmit={() => {}}
            />
          )}
          {active == 4 && (
            <FinancingForm
              setContext={setFinancingFormContext}
              initialValues={{}}
              onSubmit={() => {}}
            />
          )}
        </MainGrid>
        <MainGrid item lg={4}></MainGrid>
        <RegistrationNavigation active={active} setActive={changeActive} />
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
  const { navigateTo } = useNavigation();
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
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(4)} active={active == 4}>
          Financing
        </NavBox>
      </WrapperBox>
      <MainButton
        iconRight={<FaArrowRightLong />}
        sx={buttonStyles}
        title={"next"}
        onClick={() => {
          if (active == 3) {
            successDialog({
              title: "Registration Completed",
              text: "",
              icon: "success",
              onConfirm: () => navigateTo("/registration/list"),
              confirmButtonText: "Register More Patients",
              cancelButtonText: "Home",
              onDismiss: () => navigateTo("/"),
            });

            return;
          }
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

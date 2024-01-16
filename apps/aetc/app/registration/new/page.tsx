"use client";
import {
  FormContainer,
  MainButton,
  MainCard,
  MainGrid,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import { NewRegistrationFlow } from "../components";
import { ReactNode } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

export default function () {
  return (
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
        <NewRegistrationFlow />
      </MainGrid>
      <MainGrid item lg={4}></MainGrid>
      <RegistrationNavigation />
    </MainGrid>
  );
}

const RegistrationNavigation = () => {
  const buttonStyles = {
    width: "126px",
    height: "44px",
    padding: "10px 18px", // top right bottom left
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
        onClick={() => {}}
      />
      <WrapperBox
        sx={{ display: "flex", alignItems: "center", color: "#00190E" }}
      >
        <NavBox active={true}>Demographics</NavBox>
        <FaArrowRightLong />
        <NavBox active={false}>Social History</NavBox>
        <FaArrowRightLong />
        <NavBox active={false}>Referral</NavBox>
      </WrapperBox>
      <MainButton
        iconRight={<FaArrowRightLong />}
        sx={buttonStyles}
        title={"next"}
        onClick={() => {}}
      />
    </WrapperBox>
  );
};

const NavBox = ({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) => {
  return (
    <WrapperBox
      sx={{
        px: "1ch",
        pb: "1ch",
        borderBottom: active ? "solid 1px #00190E" : "",
        mx: "2ch",
        color: !active ? "#636363" : "",
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: "0em",
          textAlign: "center",
        }}
      >
        {children}
      </MainTypography>
    </WrapperBox>
  );
};

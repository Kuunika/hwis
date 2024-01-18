import { ReactNode } from "react";
import { MainPaper, MainTypography } from "shared-ui/src";

export const RegistrationMainHeader = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <MainTypography
      sx={{
        fontFamily: "Inter",
        fontSize: 24,
        fontWeight: 700,
        lineHeight: "29px",
        letterSpacing: 0,
        textAlign: "center",
      }}
    >
      {children}
    </MainTypography>
  );
};

export const RegistrationDescriptionText = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <MainTypography
      alignSelf={"center"}
      sx={{
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "21px",
        letterSpacing: 0,
        color: "#636363",
        width: "50ch",
        textAlign: "center",
        my: "2ch",
      }}
    >
      {children}
    </MainTypography>
  );
};

export const RegistrationCard = ({ children }: { children: ReactNode }) => {
  return (
    <MainPaper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        px: "10ch",
        py: "5ch",
        mb: "2ch",
      }}
    >
      {children}
    </MainPaper>
  );
};

export const RegistrationCardTitle = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <MainTypography
      sx={{
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0em",
        textAlign: "center",
        my: "2ch",
      }}
    >
      {children}
    </MainTypography>
  );
};

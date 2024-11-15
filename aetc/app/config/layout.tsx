"use client";
import { Main } from "next/document";
import { ReactNode } from "react";
import { MainGrid, MainTypography, WrapperBox } from "@/components";
import { FaUsers, FaCodeMerge, FaPrint } from "react-icons/fa6";
import { useNavigation } from "@/hooks";
import { Paper } from "@mui/material";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { navigateTo } = useNavigation();

  const options = [
    { label: "users", icon: <FaUsers />, link: "/config" },
    { label: "DDE merge", icon: <FaCodeMerge />, link: "/config/dde" },
    { label: "Printers", icon: <FaPrint />, link: "/config/printers" },
  ];

  return (
    <>
      <MainGrid sx={{ mt: "10ch" }} container>
        <MainGrid item xs={0} lg={2}></MainGrid>
        <MainGrid item xs={12} lg={8}>
          <WrapperBox display={"flex"}>
            <WrapperBox sx={{ width: "20%" }}>
              {options.map((opt) => {
                return (
                  <WrapperBox
                    onClick={() => navigateTo(opt.link)}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      borderRadius: "5px",
                      p: "1ch",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#DDE0E5",
                      },
                    }}
                  >
                    {opt.icon}
                    <MainTypography ml={"2ch"} variant="body2">
                      {opt.label}
                    </MainTypography>
                  </WrapperBox>
                );
              })}
            </WrapperBox>
            <WrapperBox sx={{ width: "80%", ml: "1ch", minHeight: "100vh" }}>
              {children}
            </WrapperBox>
          </WrapperBox>
        </MainGrid>
        <MainGrid item xs={0} lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}

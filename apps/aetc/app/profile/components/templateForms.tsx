"use client";
import React from "react";
import { Header, MainCard, MainButton, defaultTheme } from "shared-ui/src";

export default function TemplateForms() {
  let titles = [
    "AETC FORM",
    "Medical Inpatient",
    "Surgical Notes",
    "Gynacological",
    "SOAP",
    "Monitoring Chart",
    "Referal",
  ];
  return (
    <MainCard elevation={3} sx={{ marginBottom: 2, padding: 2 }}>
      <Header variant="h2" title="Templates/Forms" sx={{mb: 1}}/>
      {titles.map((title) => {
        return (
          <>
            <MainButton
              variant={"primary"}
              title={title}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
              sx={{
            
                backgroundColor: defaultTheme.buttonColor,
                width: "100%",
                marginBottom: "0.5ch",
                color: defaultTheme.buttonTextColor,
                "&:hover": {
                  backgroundColor: defaultTheme.buttonHoverColor,
                  color: defaultTheme.white,
                },
              }}
            />
          </>
        );
      })}
    </MainCard>
  );
}

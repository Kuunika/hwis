"use client";
import React from "react";
import { Header, MainButton } from "shared-ui/src";
import { defaultTheme } from "shared-ui/src";

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
    <>
      <Header variant="h1" title="Templates/Forms" />
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
    </>
  );
}

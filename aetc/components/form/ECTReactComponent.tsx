"use client";
import React, { useEffect } from "react";
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";
import { useFormikField } from "./hooks/useFormikField";
import { InputLabel } from "@mui/material";
import { IoSearch } from "react-icons/io5";
interface ECTReactComponentProps {
  iNo: number;
  label: string;
  onICD11Selection?: (selectedEntity: any) => void;
}

const ECTReactComponent: React.FC<ECTReactComponentProps> = ({
  onICD11Selection,
  iNo,
  label,
}) => {
  const apiServerUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_ICD11_API_URL
      : "https://icd11restapi-developer-test.azurewebsites.net";

  useEffect(() => {
    const settings = {
      apiServerUrl,
      wordsAvailable: false,
      autoBind: false,
    };

    const callbacks = {
      selectedEntityFunction: (selectedEntity: any) => {
        console.log("Entity selected:", selectedEntity);
        if (onICD11Selection) {
          onICD11Selection(selectedEntity);
        }
        ECT.Handler.clear(iNo);
      },
    };

    ECT.Handler.configure(settings, callbacks);

    ECT.Handler.bind(iNo);

    return () => {
      ECT.Handler.clear(iNo);
    };
  }, [onICD11Selection, iNo]);

  return (
    <div>
      <div style={{ position: "relative", width: "full" }}>
        <InputLabel
          sx={{ mb: "1ch", fontSize: "0.76rem", color: "text.secondary" }}
        >
          {label}
        </InputLabel>
        <IoSearch
          style={{
            position: "absolute",
            left: "10px",
            top: "60%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "gray",
          }}
        />
        <input
          type="text"
          className="ctw-input"
          autoComplete="on"
          data-ctw-ino={iNo}
          style={{
            marginBottom: "1ch",
            paddingInline: "3ch",
            fontSize: ".96rem",
            color: "text.secondary",
            height: "48px",
            width: "100%",
            borderRadius: "5px",
          }}
        />
      </div>
      <div
        className="ctw-window"
        style={{
          background: "white",
          marginLeft: "40px",
          position: "relative",
          zIndex: 9999, // High value to ensure it appears on top
        }}
        data-ctw-ino={iNo}
      ></div>
    </div>
  );
};

export default ECTReactComponent;

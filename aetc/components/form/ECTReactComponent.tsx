"use client";
import React, { useEffect } from 'react';
import * as ECT from '@whoicd/icd11ect';
import '@whoicd/icd11ect/style.css';
import { useFormikField } from './hooks/useFormikField';
import { InputLabel } from '@mui/material';
import { IoSearch } from "react-icons/io5";
interface ECTReactComponentProps {
  iNo: number;
  label: string;
  onICD11Selection?: (selectedEntity: any) => void;
}

const ECTReactComponent: React.FC<ECTReactComponentProps> = ({ onICD11Selection, iNo, label }) => {
  const apiServerUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_SERVER_URL
        : 'https://icd11restapi-developer-test.azurewebsites.net';

  useEffect(() => {
    const settings = {
      apiServerUrl,
      autoBind: false,
    };

    const callbacks = {
      selectedEntityFunction: (selectedEntity: any) => {
        if (onICD11Selection) {
          onICD11Selection(selectedEntity);
        }
        ECT.Handler.clear(iNo);
      },
    };

    ECT.Handler.configure(settings, callbacks);
    ECT.Handler.bind(iNo);
  }, [onICD11Selection]);

  return (
    <div>
<div style={{ position: "relative", width: "full" }}>
  <InputLabel sx={{ mb: "1ch", fontSize: "0.76rem", color: "text.secondary" }}>
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
      paddingInline:"3ch",
      fontSize: ".96rem",
      color: "text.secondary",
      height: "48px",
      width: "100%",
      borderRadius:"5px",
    }}
  />


</div>
<div
    className="ctw-window"
    style={{ color: "white" }}
    data-ctw-ino={iNo}
  ></div>
</div>
  );
};

export default ECTReactComponent;
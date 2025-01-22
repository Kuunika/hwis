"use client";
import React, { useEffect } from 'react';
import * as ECT from '@whoicd/icd11ect';
import '@whoicd/icd11ect/style.css';
import { MainTypography } from '..';
import { useFormikField } from './hooks/useFormikField';
import { InputLabel } from '@mui/material';

interface ECTReactComponentProps {
  iNo: number;
  name: string;
  label: string;
  onICD11Selection?: (selectedEntity: any) => void;
}

const ECTReactComponent: React.FC<ECTReactComponentProps> = ({ onICD11Selection, name, iNo, label }) => {
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

  const { value, handleChange, hasError, errorMessage, handleBlur } =
      useFormikField(name);

  return (
    <div>
    <InputLabel sx={{mb:'1ch', fontSize: "0.76rem", color: "text.secondary" }}>
        {label}
      </InputLabel>
      <input
        type="text"
        className="ctw-input"
        autoComplete="off"
        data-ctw-ino={iNo}
        style={{marginBottom:'1ch', fontSize: "0.76rem", color: "text.secondary", height: "48px", width:"320px"}}
      />
      <MainTypography color={"red"} variant="subtitle2">
          {errorMessage}
      </MainTypography>
      <div className="ctw-window" style={{color:"white"}} data-ctw-ino={iNo}></div>
    </div>
  );
};

export default ECTReactComponent;
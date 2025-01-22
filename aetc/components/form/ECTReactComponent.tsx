"use client";
import React, { useEffect } from 'react';
import * as ECT from '@whoicd/icd11ect';
import '@whoicd/icd11ect/style.css';
import { MainTypography } from '..';
import { useFormikField } from './hooks/useFormikField';

interface ECTReactComponentProps {
  name: string;
  onICD11Selection?: (selectedEntity: any) => void;
}

const ECTReactComponent: React.FC<ECTReactComponentProps> = ({ onICD11Selection, name }) => {
  const iNo = 1;

  useEffect(() => {
    const settings = {
      apiServerUrl: 'https://icd11restapi-developer-test.azurewebsites.net',
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
      <input
        type="text"
        className="ctw-input"
        autoComplete="off"
        data-ctw-ino={iNo}
      />
      <MainTypography color={"red"} variant="subtitle2">
          {errorMessage}
      </MainTypography>
      <div className="ctw-window" data-ctw-ino={iNo}></div>
    </div>
  );
};

export default ECTReactComponent;
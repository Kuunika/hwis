"use client";
import React, { FC, useEffect } from "react";
import { TextField, InputLabel, FormControl } from "@mui/material/";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { MainTypography } from "..";

type Prop = {
  id: string;
  name: string;
  label: string;
  width?: any;
  sx?: SxProps;
  type?: "password" | "text" | "date" | "number";
  placeholder?: string;
  rows?: number;
  getValue?: (value: any) => void;
  size?: "small" | "medium";
  showHelperText?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  unitOfMeasure?: string;
  inputIcon?: any;
  helperTextWidth?: string;
  handleBlurEvent?: (value: any) => void;
};

export const TextInputField: FC<Prop> = ({
  id,
  name,
  label,
  sx,
  type,
  placeholder = "",
  size = "medium",
  rows,
  getValue,
  showHelperText = true,
  disabled = false,
  multiline = false,
  inputIcon,
  unitOfMeasure,
  helperTextWidth = "25ch",
  handleBlurEvent,
}) => {
  const { value, handleChange, hasError, errorMessage, handleBlur } =
    useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  return (
    <FormControl variant="standard" sx={{ mb: "1ch", fontSize: "0.76rem", ...sx }}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <TextField
        sx={{
          backgroundColor: "white",
          "label + &": {
            marginTop: "2.3ch",
          },
          "& .MuiInputBase-input": {
            width: "100%",
            borderRadius: "5px",
          },
          "& .MuiFormHelperText-root": {
            width: helperTextWidth,
          },
          "& fieldset": { borderRadius: "5px" },
          ...sx,
        }}
        id={id}
        name={name}
        value={value}
        type={type}
        onBlur={(event: any) => {
          handleBlur(event);
          if (handleBlurEvent) handleBlurEvent(event.target.value);
        }}
        onChange={handleChange}
        error={hasError}
        size={size}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        multiline={multiline}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">{unitOfMeasure}</InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">{inputIcon}</InputAdornment>
          ),
        }}
      />
                <MainTypography color={"red"} variant="subtitle2">
            {errorMessage}
          </MainTypography>
    </FormControl>
  );
};

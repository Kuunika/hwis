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
  externalValue?: any; // Changed from externalData
  helperTextWidth?: string;
  handleBlurEvent?: (value: any) => void;
  onChange?: (value: any) => void;
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
  externalValue, // Now using externalValue instead of externalData
  handleBlurEvent,
  onChange,
}) => {
  const { value, handleChange, hasError, errorMessage, handleBlur, setValue } =
    useFormikField(name);

  // Sync external value with Formik
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    getValue?.(value);
  }, [value]);

  return (
    <FormControl
      variant="standard"
      sx={{ mb: "1ch", fontSize: "0.76rem", ...sx }}
    >
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
        value={value ?? ""}
        type={type}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
          handleBlur(event);
          handleBlurEvent?.(event.target.value);
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;
          handleChange(event);
          onChange?.(newValue);
        }}
        error={hasError}
        size={size}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        multiline={multiline}
        InputProps={{
          endAdornment: unitOfMeasure && (
            <InputAdornment position="start">{unitOfMeasure}</InputAdornment>
          ),
          startAdornment: inputIcon && (
            <InputAdornment position="start">{inputIcon}</InputAdornment>
          ),
        }}
      />
      {showHelperText && (
        <MainTypography color={"red"} variant="subtitle2">
          {errorMessage}
        </MainTypography>
      )}
    </FormControl>
  );
};

"use client";

import React, { FC, useEffect, useState } from "react";
import { TextField, FormControl, InputLabel, MenuItem, Select, Box, InputAdornment } from "@mui/material";
import { SxProps } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useFormikField } from "./hooks"; // Import your custom hook
import { WrapperBox } from "..";

type UnitInputFieldProps = {
  id: string;
  label: string;
  name: string; // Formik field name
  unitName: string; // Formik field name for the unit
  placeholder?: string;
  unitOptions: string[];
  sx?: SxProps;
  inputIcon?: React.ReactNode;
  handleBlurEvent?: (value: any) => void
  
};

export const UnitInputField: FC<UnitInputFieldProps> = ({
  id,
  label,
  name,
  unitName,
  placeholder = "",
  unitOptions,
  sx,
  inputIcon,
  handleBlurEvent
}) => {
  // Use Formik hooks for both value and unit fields
  const {
    value,
    hasError,
    errorMessage,
    handleChange,
    setFieldValue,
    handleBlur
  } = useFormikField(name);

  const { value: unitValue, setFieldValue: setUnitFieldValue } = useFormikField(unitName);
  const [localUnitValue, setLocalUnitValue] = useState(unitValue || unitOptions[0]);

  useEffect(() => {
    if (!unitValue) {
      setUnitFieldValue(unitName, unitOptions[0]);
    }
  }, [unitValue, unitOptions, unitName, setUnitFieldValue]);
  // Handle unit change with Formik's setFieldValue
  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    const newUnitValue = event.target.value;
    setUnitFieldValue(unitName, event.target.value);
    setLocalUnitValue(newUnitValue);
  };

  return (
    <WrapperBox sx={{ mb: "1ch", marginTop: "1ch", ...sx }}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <Box position="relative" display="flex" alignItems="center" marginBottom={'2ch'} >
        {/* Input Field */}
        <TextField
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          variant="outlined"
          sx={{ flexGrow: 1, background: "white", height: 56}}
          error={hasError}
          helperText={hasError ? errorMessage : ""}
          onBlur={(event: any) => {
            handleBlur(event);
            if (handleBlurEvent)
              handleBlurEvent(event.target.value)
  
          }}
          InputProps={{
            startAdornment: inputIcon && (
              <InputAdornment position="start">{inputIcon}</InputAdornment>
            ),
          }}
        />
        {/* Unit Selector with Absolute Positioning and Custom Border Radius */}
        <Select
          value={localUnitValue}
          onChange={handleUnitChange}
          variant="outlined"
          sx={{
            position: "absolute",
            right: 0,
            minWidth: 80,
            height: "100%",
            background: "white",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            alignItems: "center",
          }}
          MenuProps={{ PaperProps: { style: { maxHeight: 200 } }, disableScrollLock: true, }}
        >
          {unitOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </WrapperBox>
  );
};
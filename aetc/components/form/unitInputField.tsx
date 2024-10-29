"use client";

import React, { FC, useEffect } from "react";
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
}) => {
  // Use Formik hooks for both value and unit fields
  const {
    value,
    hasError,
    errorMessage,
    handleChange,
    setFieldValue,
  } = useFormikField(name);

  const { value: unitValue } = useFormikField(unitName);

  useEffect(() => {
    if (!unitValue) {
      setFieldValue(unitName, unitOptions[0]);
    }
  }, [unitValue, unitOptions, setFieldValue, unitName]);
  // Handle unit change with Formik's setFieldValue
  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setFieldValue(unitName, event.target.value);
  };

  return (
    <WrapperBox sx={{ mb: "1ch", ...sx }}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <Box position="relative" display="flex" alignItems="center" mt="2.5ch">
        {/* Input Field */}
        <TextField
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          variant="outlined"
          sx={{ flexGrow: 1, background: "white" }}
          error={hasError}
          helperText={hasError ? errorMessage : ""}
          InputProps={{
            startAdornment: inputIcon && (
              <InputAdornment position="start">{inputIcon}</InputAdornment>
            ),
          }}
        />
        {/* Unit Selector with Absolute Positioning and Custom Border Radius */}
        <Select
          value={unitValue|| unitOptions[0]}
          onChange={handleUnitChange}
          variant="outlined"
          sx={{
            position: "absolute",
            right: 0,
            minWidth: 80,
            background: "white",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
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
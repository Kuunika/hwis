"use client";

import React, { FC, useState, useEffect } from "react";
import { TextField, FormControl, InputLabel, MenuItem, Select, Box, InputAdornment } from "@mui/material";
import { SxProps } from "@mui/material";

type UnitInputFieldProps = {
  id: string;
  label: string;
  initialValue: string | number;
  initialUnit: string;
  unitOptions: string[];
  placeholder?: string;
  sx?: SxProps;
  inputIcon?: React.ReactNode;
  onValueChange?: (value: string | number) => void;
  onUnitChange?: (unit: string) => void;
};

export const UnitInputField: FC<UnitInputFieldProps> = ({
  id,
  label,
  initialValue,
  initialUnit,
  unitOptions,
  placeholder = "",
  sx,
  inputIcon,
  onValueChange,
  onUnitChange,
}) => {
  const [value, setValue] = useState<string | number>(initialValue);
  const [unit, setUnit] = useState<string>(initialUnit);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange && onValueChange(newValue);
  };

  const handleUnitChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newUnit = e.target.value as string;
    setUnit(newUnit);
    onUnitChange && onUnitChange(newUnit);
  };

  return (
    <FormControl variant="standard" sx={{ mb: "1ch", ...sx }}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <Box display="flex" alignItems="center">
        {/* Input Field */}
        <TextField
          id={id}
          value={value}
          onChange={handleValueChange}
          placeholder={placeholder}
          variant="outlined"
          sx={{ flexGrow: 1, mr: 1, marginTop: "2.3ch", background: "white" }}
          InputProps={{
            startAdornment: inputIcon && (
              <InputAdornment position="start">
                {inputIcon}
              </InputAdornment>
            ),
          }}
        />
        {/* Unit Selector */}
        <Select
          value={unit}
          onChange={handleUnitChange}
          variant="outlined"
          sx={{ minWidth: 80, marginTop: "2.5ch", background: "white" }}
          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
        >
          {unitOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </FormControl>
  );
};
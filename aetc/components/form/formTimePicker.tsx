"use client";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { FC, useEffect } from "react";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";

type Prop = {
  name: string;
  label: string;
  width?: any;
  sx?: SxProps;
  placeholder?: string;
  rows?: number;
  getValue?: (value: any) => void;
  size?: "small" | "medium";
  showHelperText?: boolean;
  disabled?: boolean;
};

export const FormTimePicker: FC<Prop> = ({
  name,
  label,
  width = "100%",
  sx,
  getValue,
  disabled = false,
}) => {
  const { value, setFieldValue } = useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        sx={{
          width: width,
          backgroundColor: "white",
          // "label + &": {
          //   marginTop: "2.3ch",
          // },
          // "& .MuiInputBase-input": {
          //   width: "100%",
          //   borderRadius: "5px",
          // },
          // "& .MuiFormHelperText-root": {
          //   // width: helperTextWidth,
          // },
          // "& fieldset": { borderRadius: "5px" },
          ...sx,
        }}
        label={label}
        // value={value}
        onChange={(dateValue: any) => {
          setFieldValue(name, dayjs(dateValue).format("HH:mm:ss"));
        }}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

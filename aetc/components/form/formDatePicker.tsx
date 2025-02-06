'use client'
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { FC, useEffect } from "react";
import { useFormikField } from "./hooks";
import { Box, InputLabel, SxProps } from "@mui/material";
import { MainTypography } from "..";

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

export const FormDatePicker: FC<Prop> = ({
  name,
  label,
  width = "25ch",
  sx,
  size = "medium",
  getValue,
  disabled = false,
}) => {
  const { value, setFieldValue, initialValues, errorMessage } = useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  let initialDate = "";

  if (typeof initialValues == 'object' && initialValues !== null) {

    //@ts-ignore
    initialDate = initialValues[name] as Date
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", width }}>
      <InputLabel sx={{mb:'1ch', fontSize: "0.76rem", color: "text.secondary" }}>
        {label}
      </InputLabel>
      <DatePicker
        sx={{
          backgroundColor:'white',
          "& fieldset": { borderRadius: "5px" },
          ...sx,
        }}
        defaultValue={dayjs(initialDate)}
        label=""  // Keep label empty to avoid internal label rendering
        onChange={(dateValue: any) =>
          setFieldValue(name, dayjs(dateValue).format("YYYY-MM-DD"))
        }
        disabled={disabled}
      />
                <MainTypography color={"red"} variant="subtitle2">
            {errorMessage}
          </MainTypography>
    </Box>
    </LocalizationProvider>

  );
};

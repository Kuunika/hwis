'use client'
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
      <DatePicker
        slotProps={{ textField: { size, helperText: errorMessage } }}
        sx={{
          width,
          my: "1ch",
          "& fieldset": { borderRadius: "5px" },
          ...sx,
        }}

        defaultValue={dayjs(initialDate)}
        label={label}
        // value={value}
        onChange={(dateValue: any) =>
          setFieldValue(name, dayjs(dateValue).format("YYYY-MM-DD"))
        }

        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

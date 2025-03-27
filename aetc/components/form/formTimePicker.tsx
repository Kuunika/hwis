"use client";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FC, useEffect, useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";
import { Dayjs } from "dayjs";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  const handleSetNowTime = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening time picker
    const currentTime = dayjs().format("HH:mm:ss");
    setFieldValue(name, currentTime);
  };

  const handleTextFieldClick = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        label={label}
        value={value ? dayjs(value, "HH:mm:ss") : null}
        onChange={(newValue: Dayjs | null) => {
          setFieldValue(name, newValue ? newValue.format("HH:mm:ss") : null);
        }}
        sx={{ width, ...sx }}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              fullWidth
              onClick={handleTextFieldClick}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeFilledIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSetNowTime}
                      disabled={disabled}
                    >
                      Now
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          ),
        }}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

"use client";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FC, useEffect, useState, useRef } from "react";
import { Button, TextField, InputAdornment, SxProps } from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { useFormikField } from "./hooks";

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
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  const handleSetNowTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentTime = dayjs().format("HH:mm:ss");
    setFieldValue(name, currentTime);
  };

  const handleTextFieldClick = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleAccept = (newValue: Dayjs | null) => {
    if (newValue) {
      setFieldValue(name, newValue.format("HH:mm:ss"));
      setOpen(false);
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
        onChange={() => {
          // Do nothing on change to keep picker open
        }}
        onAccept={handleAccept}
        PopperProps={{
          anchorEl: inputRef.current,
          placement: "bottom-start",
          style: {
            width: inputRef.current ? inputRef.current.clientWidth : "auto",
          },
        }}
        sx={{ width, ...sx }}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              ref={inputRef}
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

"use client";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FC, useEffect, useState } from "react";
import { useFormikField } from "./hooks";
import {
  Box,
  InputLabel,
  SxProps,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { MainTypography } from "..";
import { CalendarToday, Add, Today } from "@mui/icons-material";

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
  onAddClick?: () => void;
};

export const FormDatePicker: FC<Prop> = ({
  name,
  label,
  width = "25ch",
  sx,
  size = "medium",
  getValue,
  disabled = false,
  onAddClick,
}) => {
  const { value, setFieldValue, initialValues, errorMessage } =
    useFormikField(name);

  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState<any>(
    initialValues && typeof initialValues === "object" && initialValues[name]
      ? dayjs(initialValues[name])
      : null
  );

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  const handleSetToday = () => {
    const today = dayjs();
    setDateValue(today);
    setFieldValue(name, today.format("YYYY-MM-DD"));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", width }}>
        <InputLabel
          sx={{
            mb: "1ch",
            fontSize: "0.76rem",
            color: "text.secondary",
          }}
        >
          {label}
        </InputLabel>
        <DatePicker
          value={dateValue}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          sx={{
            backgroundColor: "white",
            "& fieldset": { borderRadius: "5px" },
            ...sx,
            width: "100%",
          }}
          slotProps={{
            textField: {
              InputProps: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {onAddClick && (
                      <IconButton
                        edge="end"
                        onClick={onAddClick}
                        disabled={disabled}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Add />
                      </IconButton>
                    )}
                    <Button
                      variant="text"
                      color="primary"
                      startIcon={<Today />}
                      onClick={handleSetToday}
                      disabled={disabled}
                      size="small"
                      sx={{ mr: 1, textTransform: "none" }}
                    >
                      Today
                    </Button>
                    <IconButton
                      edge="end"
                      onClick={() => setOpen(true)}
                      disabled={disabled}
                      size="small"
                    >
                      <CalendarToday />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
          onChange={(newValue) => {
            setDateValue(newValue);
            setFieldValue(
              name,
              newValue ? dayjs(newValue).format("YYYY-MM-DD") : null
            );
            setOpen(false);
          }}
          disabled={disabled}
        />
        <MainTypography color={"red"} variant="subtitle2">
          {errorMessage}
        </MainTypography>
      </Box>
    </LocalizationProvider>
  );
};

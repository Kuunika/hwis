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

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  let initialDate = "";
  if (typeof initialValues == "object" && initialValues !== null) {
    //@ts-ignore
    initialDate = initialValues[name] as Date;
  }

  const display =
    typeof sx === "object" && sx !== null ? (sx as any).display : undefined;

  const handleSetToday = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setFieldValue(name, today);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", width }}>
        <InputLabel
          sx={{
            mb: "1ch",
            fontSize: "0.76rem",
            color: "text.secondary",
            display,
          }}
        >
          {label}
        </InputLabel>
        <DatePicker
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
          value={initialDate ? dayjs(initialDate) : null}
          onChange={(newValue) => {
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

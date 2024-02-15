import { FC, useEffect } from "react";
import { TextField, InputLabel, FormControl } from "@mui/material/";
import { useFormikField } from "./hooks/";
import { SxProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

type Prop = {
  id: string;
  name: string;
  label: string;
  width?: any;
  sx?: SxProps;
  type?: "password" | "text" | "date";
  placeholder?: string;
  rows?: number;
  getValue?: (value: any) => void;
  size?: "small" | "medium";
  showHelperText?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  unitOfMeasure?: string;
  inputIcon?: any;
  helperTextWidth?: string;
};

export const TextInputField: FC<Prop> = ({
  id,
  name,
  label,
  width = "100%",
  sx,
  type,
  placeholder = "",
  size = "medium",
  rows,
  getValue,
  showHelperText = true,
  disabled = false,
  multiline = false,
  inputIcon,
  unitOfMeasure,
  helperTextWidth = "25ch",
}) => {
  const { value, handleChange, hasError, errorMessage, handleBlur } =
    useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  return (
    <FormControl variant="standard" sx={{ mb: "1ch", mx: "0.5ch", ...sx }}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <TextField
        sx={{
          "label + &": {
            marginTop: "2ch",
          },
          "& .MuiInputBase-input": {
            width: "25ch",
          },
          "& .MuiFormHelperText-root": {
            width: helperTextWidth,
          },

          "& fieldset": { borderRadius: "5px" },
          ...sx,
        }}
        id={id}
        name={name}
        value={value}
        type={type}
        onBlur={handleBlur}
        onChange={handleChange}
        error={hasError}
        size={size}
        helperText={showHelperText && errorMessage}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        multiline={multiline}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">{unitOfMeasure}</InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">{inputIcon}</InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

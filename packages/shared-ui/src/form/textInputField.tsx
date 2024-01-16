import { FC, useEffect } from "react";
import { TextField, InputLabel, FormControl } from "@mui/material/";
import { useFormikField } from "./hooks/";
import { SxProps } from "@mui/material";

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
}) => {
  const { value, handleChange, hasError, errorMessage, handleBlur } =
    useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  return (
    <FormControl variant="standard" sx={{ mb: "1ch", ...sx }}>
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
            width: "25ch",
          },

          "& fieldset": { borderRadius: "5px" },
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
      />
    </FormControl>
  );
};

import { FC } from "react";
import TextField from "@mui/material/TextField";
import { useFormikField } from "./hooks/";
import { SxProps } from "@mui/material";

type Prop = {
  id: string;
  name: string;
  label: string;
  width?: any;
  sx?: SxProps;
  type?: "password" | "text";
  placeholder?: string;
  rows?: number;
};

export const TextInputField: FC<Prop> = ({
  id,
  name,
  label,
  width = "100%",
  sx,
  type,
  placeholder = "",
  rows,
}) => {
  const { value, handleChange, hasError, errorMessage, handleBlur } =
    useFormikField(name);

  return (
    <TextField
      sx={{
        width,
        my: "1ch",
        "& fieldset": { borderRadius: "10px" },
        ...sx,
      }}
      id={id}
      name={name}
      label={label}
      value={value}
      type={type}
      onBlur={handleBlur}
      onChange={handleChange}
      error={hasError}
      variant="outlined"
      helperText={errorMessage}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

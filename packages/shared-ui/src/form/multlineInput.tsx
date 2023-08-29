import { SxProps, TextField } from "@mui/material";
import { useFormikField } from "./hooks";

 type Prop = {
   id: string;
   name: string;
   label: string;
   maxRows: number;
   sx?: SxProps;
   width?: string
 };
 
const MultlineInput = ({id,name,label,maxRows,sx,width}:Prop) => {
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
      multiline 
      variant="outlined"
      maxRows={maxRows}
      onBlur={handleBlur}
      onChange={handleChange}
      error={hasError}
      value={value}
      helperText={errorMessage}
    />
  );
}

export default MultlineInput
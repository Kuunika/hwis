import React from "react";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useFormikField } from "./hooks";

interface LabelledCheckboxProps {
  name: string;
  label: string;
  helperText?: string; // Optional helper text
}

const LabelledCheckbox: React.FC<LabelledCheckboxProps> = ({
  name,
  label,
  helperText,
}) => {


    const { value, handleChange, hasError, errorMessage, handleBlur } = useFormikField(name);


  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            checked={Boolean(value)}
            onChange={handleChange}
            color="primary" // Change color if needed
          />
        }
        label={label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </>
  );
};

export default LabelledCheckbox;
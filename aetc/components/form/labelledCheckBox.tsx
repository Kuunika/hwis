import React from "react";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";

interface LabelledCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string; // Optional helper text
}

const LabelledCheckbox: React.FC<LabelledCheckboxProps> = ({
  label,
  checked,
  onChange,
  helperText,
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
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
import { FC, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";

type Prop = {
  label: string;
  name: string;
  options: Array<{ label: string; value: string | number }>;
  stylings?: boolean;
  sx?: SxProps;
  getValue?: (value: any) => void;
  row?: boolean;
};

export const RadioGroupInput: FC<Prop> = ({
  label,
  name,
  options,
  getValue,
  row,
  sx,
}) => {
  const { value, handleChange, hasError } = useFormikField(name);

  useEffect(() => {
    if (getValue) getValue(value);
  }, [value]);

  return (
    <BaseRadioInput
      sx={sx}
      label={label}
      handleChange={handleChange}
      options={options}
      hasError={hasError}
      value={value}
      name={name}
      row={row}
    />
  );
};

type BaseProp = {
  value: string | boolean | number;
  handleChange: (values: any) => void;
  hasError: boolean;
  row?: boolean;
};

export const BaseRadioInput: FC<BaseProp & Prop> = ({
  handleChange,
  hasError,
  label,
  name,
  options,
  value,
  row = false,
  sx,
}) => {
  return (
    <FormControl sx={sx} error={hasError}>
      <FormLabel id={name}>{label} "dddd"</FormLabel>
      <RadioGroup row={row} value={value} onChange={handleChange} name={name}>
        {options.map(({ label, value }) => (
          <FormControlLabel
            key={label}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

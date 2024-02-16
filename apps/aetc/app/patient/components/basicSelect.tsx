import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

type BasicSelectProp = {
  label: string;
  options: Array<{ value: string; label: string }>;
};

export function BasicSelect({ label, options }: BasicSelectProp) {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        label={label}
        onChange={handleChange}
      >
        {options.map((o) => (
          <MenuItem value={o.value}>{o.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

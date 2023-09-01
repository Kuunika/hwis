"use client";
import { FC, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useFormikField } from "./hooks/useFormikField";
import { SxProps, Theme } from "@mui/material/styles";

type ISelectItem = { name: string | number; value: string | number };

type Prop = {
  id: string;
  name: string;
  label: string;
  width?: string;
  selectItems: Array<ISelectItem>;
  sx?: SxProps<Theme>;
  getValue?: (value: any) => void;
};
export const SelectInputField: FC<Prop> = ({
  name,
  id,
  label,
  selectItems,
  sx,
  getValue,
}) => {
  const { value, handleChange, hasError } = useFormikField(name);

  useEffect(() => {
    getValue && getValue(value);
  }, [value]);

  return (
    <Box sx={{ minWidth: 120, my: "1ch", ...sx }}>
      <FormControl fullWidth>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          name={name}
          labelId={id}
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
          error={hasError}
        >
          {selectItems.map(({ value, name }) => (
            <MenuItem key={name} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

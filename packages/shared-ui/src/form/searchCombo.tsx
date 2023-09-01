import { FC } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";

type Props = {
  name: string;
  options: Array<{ id: number | string; label: number | string }>;
  label: string;
  width?: string;
  sx?: SxProps;
  getValue?: (value: string) => void;
  disabled?: boolean;
};

export const SearchComboBox: FC<Props> = ({
  options,
  name,
  label,
  width = "100%",
  sx,
  getValue,
  disabled = false,
}) => {
  const { hasError, errorMessage, setFieldValue, initialValues } =
    useFormikField(name);

  return (
    <Autocomplete
      disablePortal
      id={name}
      disabled={disabled}
      //@ts-ignore
      defaultValue={options.find((opt) => opt.id === initialValues[name])}
      options={options}
      sx={{ width, ...sx }}
      onChange={(event: any, newValue: any) => {
        console.log(event);
        setFieldValue(name, newValue.id);
        if (getValue) {
          getValue(newValue.id);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={hasError}
          variant="outlined"
          helperText={errorMessage}
        />
      )}
    />
  );
};

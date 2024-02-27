import { FC } from "react";
import { TextField, Checkbox } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";
import { FaRegSquare, FaSquareCheck } from "react-icons/fa6";

const icon = <FaRegSquare />;
const checkedIcon = <FaSquareCheck />;

type Props = {
  name: string;
  options: Array<{ id: number | string; label: number | string }>;
  label: string;
  width?: string;
  sx?: SxProps;
  getValue?: (value: string) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: "small" | "medium";
};

export const SearchComboBox: FC<Props> = ({
  options,
  name,
  label,
  width = "100%",
  sx,
  getValue,
  disabled = false,
  multiple = true,
  size = "medium",
}) => {
  const { hasError, errorMessage, setFieldValue, initialValues } =
    useFormikField(name);
  return (
    <Autocomplete
      multiple={multiple}
      disablePortal
      id={name}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id == value.id}
      disableCloseOnSelect
      size={size}
      //@ts-ignore
      defaultValue={initialValues[name] ? initialValues[name] : undefined}
      options={options}
      sx={{ width, ...sx }}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.label}
        </li>
      )}
      onChange={(event: any, newValue: any) => {

        console.log(event)
        const inputValue = multiple ? newValue : newValue.id;
        setFieldValue(name, inputValue);
        if (getValue) {
          getValue(inputValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={hasError}
          variant="outlined"
          sx={{ my: "1ch" }}
          helperText={errorMessage}
        />
      )}
    />
  );
};

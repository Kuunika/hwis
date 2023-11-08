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
}) => {
  const { hasError, errorMessage, setFieldValue, initialValues, value } =
    useFormikField(name);

  return (
    <Autocomplete
      multiple={multiple}
      disablePortal
      id={name}
      disabled={disabled}
      disableCloseOnSelect
      //@ts-ignore
      defaultValue={options.find((opt) => opt.id === initialValues[name])}
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
          helperText={errorMessage}
        />
      )}
    />
  );
};

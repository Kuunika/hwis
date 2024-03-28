import { FC } from "react";

import { useFormikField } from "./hooks";
import { SxProps } from "@mui/material";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { MainTypography, WrapperBox, defaultTheme } from "..";



type Props = {
  name: string;
  options: Array<{ id: number | string; label: number | string }>;
  label: string;
  width?: string;
  sx?: SxProps;
  inputSx?: SxProps;
  getValue?: (value: string) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: "small" | "medium";
};

const animatedComponents = makeAnimated();

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
  const { hasError, setFieldValue, initialValues, value } =
    useFormikField(name);



  const mappedOptions = options.map(op => {
    return {
      value: op.id,
      label: op.label
    }
  })

  const handleChange = (values: any) => {
    const inputValue = multiple ? values.map((v: any) => ({
      id: v.value,
      label: v.label

    })) : values.value;

    setFieldValue(name, inputValue);
    if (getValue) {
      getValue(inputValue);
    }
  }


  return <WrapperBox sx={{ width, ...sx, p: 0.5, borderRadius: 0.5, }}>
    <MainTypography variant="subtitle2">{label}</MainTypography>
    <Select
      styles={{
        //@ts-ignore
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: hasError ? "red" : "#B3B3B3"
        }),
      }}
      {...(multiple ? null : { value: mappedOptions.filter(op => op.value == value) })}
      isDisabled={disabled}
      //@ts-ignore
      defaultValue={mappedOptions.filter(op => op.value == initialValues[name])}
      //@ts-ignore
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: defaultTheme.primary,
          primary25: "#cffccf"
        }
      })}

      onChange={values => handleChange(values)}
      isMulti={multiple}
      components={animatedComponents}
      options={mappedOptions} />
  </WrapperBox>

  // return (
  //   <Autocomplete
  //     multiple={multiple}
  //     disablePortal
  //     id={name}
  //     disabled={disabled}
  //     getOptionLabel={(option) => option.label}
  //     isOptionEqualToValue={(option, value) => option.id == value.id}
  //     disableCloseOnSelect
  //     size={size}
  //     //@ts-ignore
  //     defaultValue={initialValues[name] ? initialValues[name] : undefined}
  //     options={options}
  //     sx={{ width, ...sx }}
  //     renderOption={(props, option, { selected }) => (
  //       <li {...props} key={option.id}>
  //         <Checkbox
  //           icon={icon}
  //           checkedIcon={checkedIcon}
  //           style={{ marginRight: 8 }}
  //           checked={selected}
  //         />
  //         {option.label}
  //       </li>
  //     )}
  //     onChange={(event: any, newValue: any) => {

  //       const inputValue = multiple ? newValue : newValue.id;
  //       setFieldValue(name, inputValue);
  //       if (getValue) {
  //         getValue(inputValue);
  //       }
  //     }}
  //     renderInput={(params) => (
  //       <TextField
  //         {...params}
  //         label={label}
  //         error={hasError}
  //         variant="outlined"
  //         sx={{ my: "1ch", ...inputSx }}
  //         helperText={errorMessage}
  //       />
  //     )}
  //   />
  // );
};

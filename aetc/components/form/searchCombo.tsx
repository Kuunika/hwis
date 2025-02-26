"use client";
import { FC } from "react";
import { useFormikField } from "./hooks";
import { InputLabel, SxProps } from "@mui/material";
import Select, {
  MultiValue,
  SingleValue,
  StylesConfig,
  Theme,
} from "react-select";
import makeAnimated from "react-select/animated";
import { MainTypography, WrapperBox, defaultTheme } from "..";
import { fetchConceptsSelectOptions } from "@/hooks/encounter";

type OptionType = { id: number | string; label: string | number };

type Props = {
  name: string;
  options: OptionType[];
  label: string;
  width?: string;
  sx?: SxProps;
  inputSx?: SxProps;
  getValue?: (value: any) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: "small" | "medium";
  applyPadding?: boolean;
  manualInitialValues?: OptionType[];
  coded?: boolean;
};

const animatedComponents = makeAnimated();

export const SearchComboBox: FC<Props> = ({
  options,
  name,
  label,
  width = "100%",
  sx,
  getValue,
  manualInitialValues,
  disabled = false,
  multiple = true,
  applyPadding = true,
  coded = false,
}) => {
  const { hasError, setFieldValue, value, errorMessage } = useFormikField(name);

  const mappedOptions = options.map((op) => ({
    value: op.id,
    label: op.label,
  }));

  const handleChange = async (values: any) => {
    let inputValue = multiple
      ? values.map((v: any) => ({
          id: v.value,
          label: v.label,
        }))
      : values.value;

    if (coded && !multiple) {
      inputValue = (
        await fetchConceptsSelectOptions([{ id: inputValue, label: "" }])
      )[0].id;
    }

    if (coded && multiple)
      inputValue = await fetchConceptsSelectOptions([...inputValue]);

    setFieldValue(name, inputValue);

    if (getValue) {
      getValue(inputValue);
    }
  };

  const paddingStyles = applyPadding
    ? { paddingTop: "1ch", paddingBottom: "1ch" }
    : {};

  const customStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      borderColor: hasError ? "red" : "#B3B3B3",
      ...paddingStyles,
    }),
  };

  return (
    <WrapperBox sx={{ width, ...sx, borderRadius: 0.5 }}>
      <InputLabel shrink>{label}</InputLabel>
      {mappedOptions.length > 0 && (
        <Select
          isDisabled={disabled}
          value={mappedOptions.find((op) => op.value === value)}
          styles={customStyles}
          defaultValue={manualInitialValues}
          theme={(theme: Theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: defaultTheme.primary,
              primary25: "#cffccf",
            },
          })}
          onChange={handleChange}
          isMulti={multiple}
          components={animatedComponents}
          options={mappedOptions}
        />
      )}
      <MainTypography color="red" variant="subtitle2">
        {errorMessage}
      </MainTypography>
    </WrapperBox>
  );
};

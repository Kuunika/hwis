"use client";
import { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFormikField } from "./hooks";
import { InputLabel, SxProps } from "@mui/material";
import type {
  GroupBase,
  StylesConfig,
  Props as SelectProps,
} from "react-select";
import makeAnimated from "react-select/animated";
import { MainTypography, WrapperBox, defaultTheme } from "..";
import { fetchConceptsSelectOptions } from "@/hooks/encounter";

// Dynamically import Select with proper typing
const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
) as <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group>
) => JSX.Element;

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
  const [mounted, setMounted] = useState(false);
  const { hasError, setFieldValue, value, errorMessage } = useFormikField(name);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <WrapperBox sx={{ width, ...sx, borderRadius: 0.5 }}>
      <InputLabel shrink>{label}</InputLabel>

      <Select
        isDisabled={disabled}
        value={value ? mappedOptions?.find((op) => op.value === value) : null}
        styles={customStyles}
        defaultValue={manualInitialValues}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: defaultTheme.primary,
            primary25: "#cffccf",
          },
        })}
        onChange={handleChange}
        isMulti={multiple}
        components={makeAnimated()}
        options={mappedOptions}
      />
      <MainTypography color="red" variant="subtitle2">
        {errorMessage}
      </MainTypography>
    </WrapperBox>
  );
};

"use client";

import { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { InputLabel, SxProps, useTheme } from "@mui/material";
import type {
  GroupBase,
  StylesConfig,
  Props as SelectProps,
} from "react-select";
import makeAnimated from "react-select/animated";
import { useFormikField } from "./hooks";
import { MainTypography, WrapperBox } from "..";
import { fetchConceptsSelectOptions } from "@/hooks/encounter";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  { ssr: false, loading: () => null }
) as <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
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
  const theme = useTheme();
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
      ? values.map((v: any) => ({ id: v.value, label: v.label }))
      : values?.value;

    if (coded) {
      inputValue = multiple
        ? await fetchConceptsSelectOptions(inputValue)
        : (await fetchConceptsSelectOptions([{ id: inputValue, label: "" }]))[0]
            .id;
    }

    setFieldValue(name, inputValue);
    getValue?.(inputValue);
  };

  const paddingStyles = applyPadding
    ? { paddingTop: "1ch", paddingBottom: "1ch" }
    : {};

  const customStyles: StylesConfig<
    { value: string | number; label: string | number },
    boolean
  > = {
    container: (base) => ({
      ...base,
      width, // ✅ use width prop for outer container
    }),
    control: (base, state) => ({
      ...base,
      width, // ✅ use width prop for inner control as well
      borderColor: hasError
        ? theme.palette.error.main
        : state.isFocused
          ? theme.palette.primary.main
          : theme.palette.divider,
      boxShadow: state.isFocused
        ? `0 0 0 1px ${theme.palette.primary.main}`
        : "none",
      "&:hover": {
        borderColor: hasError
          ? theme.palette.error.main
          : theme.palette.primary.main,
      },
      backgroundColor: disabled
        ? theme.palette.action.disabledBackground
        : theme.palette.background.paper,
      minHeight: "40px",
      ...paddingStyles,
    }),
    menu: (base) => ({
      ...base,
      zIndex: theme.zIndex.modal + 1,
      backgroundColor: theme.palette.background.paper,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: theme.zIndex.modal + 1,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme.palette.action.selected
        : state.isFocused
          ? theme.palette.action.hover
          : theme.palette.background.paper,
      color: theme.palette.text.primary,
      "&:active": {
        backgroundColor: theme.palette.action.selected,
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme.palette.grey[200],
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: theme.palette.text.secondary,
      ":hover": {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.text.primary,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: theme.palette.text.disabled,
    }),
    singleValue: (base) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: theme.palette.divider,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: theme.palette.text.secondary,
      ":hover": {
        color: theme.palette.text.primary,
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: theme.palette.text.secondary,
      ":hover": {
        color: theme.palette.text.primary,
      },
    }),
  };

  if (!mounted) return null;

  return (
    <WrapperBox
      sx={{
        width, // ✅ use width prop here too
        ...sx,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <InputLabel
        shrink
        sx={{ color: hasError ? theme.palette.error.main : "inherit" }}
      >
        {label}
      </InputLabel>

      <Select
        isDisabled={disabled}
        isMulti={multiple}
        options={mappedOptions}
        value={value ? mappedOptions?.find((op) => op.value === value) : value}
        //@ts-ignore
        styles={customStyles}
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        menuPosition="fixed"
        onChange={handleChange}
        defaultValue={manualInitialValues?.map((item) => ({
          value: item.id,
          label: item.label,
        }))}
        components={makeAnimated()}
        theme={(selectTheme) => ({
          ...selectTheme,
          colors: {
            ...selectTheme.colors,
            primary: theme.palette.primary.main,
            primary25: theme.palette.action.hover,
            primary50: theme.palette.action.selected,
            neutral0: theme.palette.background.paper,
            neutral20: theme.palette.divider,
            neutral30: theme.palette.action.active,
            neutral40: theme.palette.text.secondary,
            neutral50: theme.palette.text.disabled,
            neutral60: theme.palette.text.secondary,
            neutral80: theme.palette.text.primary,
          },
        })}
      />

      {hasError && (
        <MainTypography color="error.main" variant="caption">
          {errorMessage}
        </MainTypography>
      )}
    </WrapperBox>
  );
};

"use client";
import { FC } from "react";

import { useFormikField } from "./hooks";
import { InputLabel, SxProps } from "@mui/material";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { MainTypography, WrapperBox, defaultTheme } from "..";
import { fetchConceptsSelectOptions } from "@/hooks/encounter";

type Props = {
  name: string;
  options: Array<{ id: number | string; label: number | string }>;
  label: string;
  width?: string;
  sx?: SxProps;
  inputSx?: SxProps;
  getValue?: (value: any) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: "small" | "medium";
  applyPadding?: boolean;
  manualInitialValues?: Array<any>;
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
  const { hasError, setFieldValue, initialValues, value, errorMessage } =
    useFormikField(name);

  const mappedOptions = options.map((op) => {
    return {
      value: op.id,
      label: op.label,
    };
  });

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

  const padding = applyPadding
    ? {
        paddingTop: "1ch",
        paddingBottom: "1ch",
      }
    : {};

  return (
    <WrapperBox sx={{ width, ...sx, borderRadius: 0.5 }}>
      <InputLabel shrink>{label}</InputLabel>
      {mappedOptions && mappedOptions.length > 0 ? (
        <Select
          isDisabled={disabled}
          styles={{
            //@ts-ignore
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: hasError ? "red" : "#B3B3B3",
              ...padding,
            }),
          }}
          // value={() => mappedOptions.find((op) => op.value == value)}
          //@ts-ignore
          defaultValue={manualInitialValues}
          //@ts-ignore
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: defaultTheme.primary,
              primary25: "#cffccf",
            },
          })}
          onChange={(values) => handleChange(values)}
          isMulti={multiple}
          components={animatedComponents}
          options={mappedOptions}
        />
      ) : null}
      <MainTypography color={"red"} variant="subtitle2">
        {errorMessage}
      </MainTypography>
    </WrapperBox>
  );
};

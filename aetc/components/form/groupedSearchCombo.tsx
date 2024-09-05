'use client';
import { FC } from 'react';
import { useFormikField } from './hooks';
import { InputLabel, SxProps } from '@mui/material';
import Select from 'react-select';
import { MainTypography, WrapperBox, defaultTheme } from '..';

type GroupOption = {
  label: string;
  options: Array<{ id: number | string; label: number | string }>;
};

type Props = {
  name: string;
  options: Array<GroupOption>;
  label: string;
  width?: string;
  sx?: SxProps;
  inputSx?: SxProps;
  getValue?: (value: any) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium';
  applyPadding?: boolean;
  manualInitialValues?: Array<any>;
};

export const GroupedSearchComboBox: FC<Props> = ({
  options,
  name,
  label,
  width = '100%',
  sx,
  getValue,
  manualInitialValues,
  disabled = false,
  multiple = true,
  applyPadding = true,
}) => {
  const { hasError, setFieldValue, value, errorMessage } = useFormikField(name);

  const handleChange = (values: any) => {
    const inputValue = multiple
      ? values.map((v: any) => ({
          id: v.value,
          label: v.label,
        }))
      : { id: values?.value, label: values?.label };

    setFieldValue(name, inputValue);
    if (getValue) {
      getValue(inputValue);
    }
  };

  const padding = applyPadding
    ? {
        paddingTop: '1ch',
        paddingBottom: '1ch',
      }
    : {};

  return (
    <WrapperBox sx={{ width, ...sx, borderRadius: 0.5 }}>
      <InputLabel shrink>{label}</InputLabel>
      {options && options.length > 0 ? (
        <Select
          styles={{
            //@ts-ignore
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: hasError ? 'red' : '#B3B3B3',
              ...padding,
            }),
            //@ts-ignore
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isSelected ? 'white' : baseStyles.backgroundColor,
              color: 'black', // Ensures text stays black
              '&:hover': {
                backgroundColor: '#cffccf',
              },
            }),
          }}
          defaultValue={manualInitialValues}
          isDisabled={disabled}
          onChange={handleChange}
          isMulti={multiple}
          options={options}
          formatGroupLabel={(group) => (
            <div style={{ fontWeight: 'bold' }}>{group.label}</div>
          )}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: defaultTheme.primary,
              primary25: '#cffccf',
              neutral0: 'white',  // White background
              neutral80: 'black', // Black text color
            },
          })}
        />
      ) : null}
      <MainTypography color={'red'} variant="subtitle2">
        {errorMessage}
      </MainTypography>
    </WrapperBox>
  );
};
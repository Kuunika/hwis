'use client';
import { FC } from 'react';
import { useFormikField } from './hooks';
import { InputLabel, SxProps } from '@mui/material';
import Select from 'react-select';
import { MainTypography, WrapperBox, defaultTheme } from '..';

export interface GroupedOption {
  readonly label: string;
  readonly value: string;
  readonly options: readonly Option[];
}

export interface Option {
  readonly value: string;
  readonly label: string;
}

type Props = {
  name: string;
  options: Array<GroupedOption>;
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

  const handleChange = (selectedOptions: any) => {
    if (multiple) {
      // Multiple selection case: create an array of selected options with groups
      const selectedWithGroup = selectedOptions.map((selectedOption: any) => {
        // Find the group the selected option belongs to
        const group = options.find(group =>
          group.options.some(option => option.value === selectedOption.value)
        );

        return {
          group: group?.value || 'Unknown', // Include the group label
          value: selectedOption.value,
          label: selectedOption.label,
        };
      });

      setFieldValue(name, selectedWithGroup); // Set field value as an array
      if (getValue) {
        getValue(selectedWithGroup); // Pass the array to the getValue callback
      }
    } else {
      // Single selection case: create an object with selected option and its group
      const group = options.find(group =>
        group.options.some(option => option.value === selectedOptions.value)
      );

      const selectedWithGroup = {
        group: group?.value || 'Unknown', // Include the group label
        value: selectedOptions.value,
        label: selectedOptions.label,
      };

      setFieldValue(name, selectedWithGroup); // Set field value as an object
      if (getValue) {
        getValue(selectedWithGroup); // Pass the object to the getValue callback
      }
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
          onChange={handleChange}
          isDisabled={disabled}
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
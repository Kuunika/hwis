// ============================================
// UPDATED formCheckBox.tsx - Copy this entire file
// ============================================
"use client";
import { useEffect, useState, useRef } from "react";

import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { useFormikField } from "./hooks";

type Props = {
  name: string;
  options: Array<{ value: string; label: string }>;
  getValue?: (value: any) => void;
  allowFilter?: boolean;
  disabled?: boolean;
};

export function CheckboxesGroup({
  options,
  name,
  getValue,
  allowFilter = true,
  disabled: externalDisabled = false,
}: Props) {
  const [checkBoxValue, setCheckBoxValue] = useState<{ [key: string]: any }>({});
  const [disabled, setDisabled] = useState(false);
  const { setFieldValue, hasError, errorMessage, value } = useFormikField(name);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInternalUpdateRef = useRef(false);

  // Initialize checkbox values
  useEffect(() => {
    const obj: any = {};
    for (let i = 0; i < options.length; i++) {
      const key = options[i];
      obj[key.value] = false;
    }
    setCheckBoxValue(obj);
    setIsInitialized(true);
  }, []);

  // CRITICAL FIX: Sync internal state with Formik value changes (only when changed externally)
  useEffect(() => {
    if (!isInitialized || isInternalUpdateRef.current) return;

    if (value && Array.isArray(value)) {
      const newCheckBoxValue: { [key: string]: any } = {};
      let hasChanges = false;

      value.forEach((item: any) => {
        newCheckBoxValue[item.key] = item.value;
        if (checkBoxValue[item.key] !== item.value) {
          hasChanges = true;
        }
      });

      // Only update if there are actual changes
      if (hasChanges) {
        setCheckBoxValue(newCheckBoxValue);
      }
    }
  }, [value, isInitialized]);

  useEffect(() => {
    if (!allowFilter) return;

    if (value && Array.isArray(value)) {
      if (value?.filter((v: any) => v?.value).length == 2) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isInitialized) return;

    isInternalUpdateRef.current = true;
    const array = Object.keys(checkBoxValue).map((key) => ({
      key,
      value: checkBoxValue[key],
    }));

    setFieldValue(name, array);

    // Reset flag after a tick
    setTimeout(() => {
      isInternalUpdateRef.current = false;
    }, 0);
  }, [checkBoxValue, isInitialized]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxValue({
      ...checkBoxValue,
      [event.target.value]: event.target.checked,
    });
  };

  useEffect(() => {
    getValue && getValue(value);
  }, [value, checkBoxValue]);

  return (
    <FormControl
      error={hasError}
      name={name}
      component="fieldset"
      variant="standard"
    >
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                disabled={externalDisabled || (disabled && !checkBoxValue[option.value])}
                value={option.value}
                checked={checkBoxValue[option.value] || false}
                onChange={handleCheckboxChange}
                name={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
}
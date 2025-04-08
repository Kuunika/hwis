"use client";
import {
  useFormikContext,
  FormikValues,
  FormikTouched,
  FormikErrors,
} from "formik";
import { useMemo } from "react";

export const useFormikField = <T extends FormikValues = FormikValues>(
  fieldName: keyof T
) => {
  const context = useFormikContext<T>();

  if (!context) {
    throw new Error("useFormikField must be used within a Formik provider");
  }

  const {
    validateField,
    initialValues,
    values,
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
  } = context;

  // Safely get field value with fallback
  const value = useMemo(() => values?.[fieldName], [values, fieldName]);

  // Error handling with null checks
  const hasError = Boolean(touched?.[fieldName] && errors?.[fieldName]);

  const errorMessage = hasError ? String(errors[fieldName]) : "";
  // Type-safe value updater
  const setValue = (value: unknown) => {
    setFieldValue(fieldName as string, value);
  };

  return {
    value,
    errorMessage,
    hasError,
    values,
    handleChange,
    handleBlur: (e: React.FocusEvent) => handleBlur(e),
    setValue,
    setFieldValue,
    validateField,
    initialValues,
    fieldProps: {
      name: fieldName as string,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
  };
};

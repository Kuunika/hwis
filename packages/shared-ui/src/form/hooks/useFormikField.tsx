import { useFormikContext } from "formik";

export const useFormikField = (name: string) => {
  const { values, handleChange, touched, errors, setFieldValue } =
    useFormikContext() ?? {};

  //@ts-ignore
  const value = values[name];

  //@ts-ignore
  const hasError = touched[name] && Boolean(errors[name]);

  //@ts-ignore
  const errorMessage = touched[name] && errors[name];

  return { value, errorMessage, hasError, handleChange, setFieldValue };
};

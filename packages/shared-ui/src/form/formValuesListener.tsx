import { useEffect } from "react";
import { useFormikField } from "./hooks";

type Prop = {
  getValues: (values: any) => void;
  setField?: (func: any) => void;
};

export const FormValuesListener = ({ getValues, setField }: Prop) => {
  const { values } = useFormikField("");

  useEffect(() => {
    getValues(values);
  }, [values]);

  return <></>;
};

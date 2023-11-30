import { useEffect } from "react";
import { useFormikField } from "./hooks";

type Prop = {
  getValues: (values: any) => void;
};

export const FormValuesListener = ({ getValues }: Prop) => {
  const { values } = useFormikField("");

  useEffect(() => {
    getValues(values);
  }, [values]);

  return <></>;
};

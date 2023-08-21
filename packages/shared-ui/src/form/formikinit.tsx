import { FC, ReactNode } from "react";
import { Form, Formik } from "formik";

import { SxProps } from "@mui/material";
import { MainButton } from "../buttons";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
  children: ReactNode;
  validationSchema: any;
  initialValues: any;
  width?: string;
  submitButton?: boolean;
  title?: string;
  submitStyles?: SxProps;
  submitButtonText?: string;
  sx?: SxProps;
  loading?: boolean;
};

export const FormikInit: FC<Prop> = ({
  children,
  onSubmit,
  validationSchema,
  initialValues,
  submitButton = true,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        {children}
        {submitButton && (
          <MainButton
            variant="primary"
            type="submit"
            title="submit"
            onClick={()=>{}}
          />
        )}
      </Form>
    </Formik>
  );
};

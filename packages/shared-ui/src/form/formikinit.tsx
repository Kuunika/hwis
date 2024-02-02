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
  submitVariant?: "primary" | "secondary" | "text";
  enableReinitialize?: boolean;
};

export const FormikInit: FC<Prop> = ({
  children,
  onSubmit,
  validationSchema,
  initialValues,
  submitButton = true,
  submitButtonText = "submit",
  submitVariant = "primary",
  loading,
  enableReinitialize = false,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={enableReinitialize}
    >
      {({ validateForm }) => (
        <Form>
          {children}
          {submitButton && (
            <MainButton
              sx={{ mt: 3 }}
              variant={submitVariant}
              type={"submit"}
              title={
                loading ? (
                  <i style={{ textTransform: "lowercase" }}>loading...</i>
                ) : (
                  submitButtonText
                )
              }
              onClick={() => {}}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

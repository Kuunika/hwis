"use client";

import { SxProps } from "@mui/material";
import { Formik, Form } from "formik";
import { ReactNode, FC, useEffect } from "react";
import { MainButton } from "../buttons";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
  children:
  | ReactNode
  | ((props: { values: any; setFieldValue: any, submitCount: any }) => ReactNode);
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
  getFormValues?: (values: any) => void;
  ref?: any;
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
  getFormValues = (values) => { },
  ref,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={enableReinitialize}
      innerRef={ref}
    >
      {({ values, setFieldValue, errors, submitCount }) => (
        <Form>
          <ListenToValueChanges getFormValues={getFormValues} values={values} />
          {typeof children === "function"
            ? children({ values, setFieldValue, submitCount })
            : children}
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
              onClick={() => { }}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

const ListenToValueChanges = ({
  values,
  getFormValues,
}: {
  values: any;
  getFormValues: (values: any) => void;
}) => {
  useEffect(() => {
    getFormValues(values);
  }, [values]);

  return null;
};

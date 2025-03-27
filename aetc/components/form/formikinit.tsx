"use client";
import { SxProps } from "@mui/material";
import { Formik, Form } from "formik";
import { ReactNode, FC, useEffect, useState } from "react";
import { MainButton } from "../buttons";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
  children:
    | ReactNode
    | ((props: { values: any; setFieldValue: any }) => ReactNode);
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
  getFormValues = (values) => {},
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={enableReinitialize}
    >
      {({ values, setFieldValue, dirty }) => (
        <Form>
          <ListenToValueChanges
            getFormValues={getFormValues}
            values={values}
            dirty={dirty}
          />
          {typeof children === "function"
            ? children({ values, setFieldValue })
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
              onClick={() => {}}
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
  dirty,
}: {
  values: any;
  getFormValues: (values: any) => void;
  dirty: boolean;
}) => {
  const [initialValues, setInitialValues] = useState(values);

  useEffect(() => {
    getFormValues(values);

    // Function to handle before unload event
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if the form has been modified
      if (dirty) {
        e.preventDefault(); // Cancel the event
        e.returnValue = ""; // Display a generic warning message
      }
    };

    // Add event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [values, dirty, getFormValues]);

  return null;
};

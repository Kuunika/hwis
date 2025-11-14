"use client";
import { useEffect, useState } from "react";
import DynamicFormList from "@/components/form/dynamicFormList";
import { FormikInit, FormValuesListener, MainTypography, SearchComboBox, UnitInputField, TextInputField } from "@/components";
import * as Yup from "yup";
import { IoTimeOutline } from "react-icons/io5";
import { concepts, durationOptions } from "@/constants";
import { FieldArray } from "formik";
import { Field, getIn } from "formik";
import { getConceptFromCacheOrFetch } from "@/hooks/encounter";
import { DetailsPresentingComplaintsAccordion } from "./detailsPresentingComplaintAccordion";
import { TextField } from "@mui/material";

const ErrorMessage = ({ name }: { name: string }) => (
  <Field
    name={name}
    render={({ form }: { form: any }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? error : null;
    }}
  />
);

// Define the structure of a complaint
type Complaint = {
  complaint: string;
  complaintOther?: string;
  duration: number;
  duration_unit: string;
};

const complaintsTemplate: Complaint = {
  complaint: "",
  complaintOther: "",
  duration: 0,
  duration_unit: "",
};

type Prop = {
  onSubmit: (values: any) => void;
};

export const ComplaintsForm = ({ onSubmit }: Prop) => {
  const [presentingComplaints, setPresentingComplaints] = useState([]);
  const [formValues, setFormValues] = useState<any>({});

  useEffect(() => {
    (async () => {
      let complaints = await getConceptFromCacheOrFetch(
        concepts.PRESENTING_COMPLAINTS
      );
      complaints = complaints.data[0].set_members.map((complaint: any) => {
        const label = complaint.names[0].name;
        // Check if this is the "Other" option and standardize its id
        const id = label.toLowerCase() === "other" ? "other" : complaint.names[0].uuid;
        return { id, label };
      });

      // Only add "Other" if it doesn't already exist
      const hasOther = complaints.some((c: any) => c.label.toLowerCase() === "other");
      if (!hasOther) {
        complaints.push({ id: "other", label: "Other" });
      }

      setPresentingComplaints(complaints);
    })();
  }, []);

  const complaintsFormConfig = {
    complaints_name: (index: number) => ({
      name: `complaints[${index}].complaint`,
      label: "Symptom",
    }),
    complaints_other: (index: number) => ({
      name: `complaints[${index}].complaintOther`,
      label: "Please specify",
    }),
    complaints_duration: (index: number) => ({
      name: `complaints[${index}].duration`,
      label: "Duration",
    }),
    complaints_duration_units: (index: number) => ({
      name: `complaints[${index}].duration_unit`,
      label: "Unit",
    }),
  };

  const initialValues = {
    complaints: [complaintsTemplate]
  };

  const schema = Yup.object().shape({
    complaints: Yup.array().of(
      Yup.object().shape({
        complaint: Yup.string().required("Symptom is required"),
        complaintOther: Yup.string().when('complaint', {
          is: (val: string) => val === "other",
          then: (schema) => schema.required("Please specify the complaint"),
          otherwise: (schema) => schema.notRequired(),
        }),
        duration: Yup.number()
          .min(1, "Duration must be greater than 0")
          .required("Duration is required"),
        duration_unit: Yup.string().required("Duration unit is required"),
      })
    ),
  });

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <>
      <DetailsPresentingComplaintsAccordion />
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButton={true}
        submitButtonText="Next"
      >
        {({ values, setFieldValue }) => (
          <>
            <FormValuesListener getValues={setFormValues} />
            <FieldArray name="complaints">
              {({ }) => (
                <DynamicFormList
                  items={values.complaints}
                  setItems={(newItems) => setFieldValue("complaints", newItems)}
                  newItem={complaintsTemplate}
                  renderFields={(item, index) => (
                    <>
                      <div style={{ display: "flex-column", width: "100%" }}>
                        {/* Complaint Name Field */}
                        <SearchComboBox
                          name={complaintsFormConfig.complaints_name(index).name}
                          label={complaintsFormConfig.complaints_name(index).label}
                          options={presentingComplaints}
                          multiple={false}
                          sx={{ width: "100%" }}
                        />
                        <MainTypography color="red" variant="subtitle2">
                          <ErrorMessage name={`complaints[${index}].complaint`} />
                        </MainTypography>

                        {/* Show text field if "Other" is selected */}
                        {values.complaints[index]?.complaint === "other" && (
                          <>
                            <Field
                              as={TextInputField}
                              name={complaintsFormConfig.complaints_other(index).name}
                              label={complaintsFormConfig.complaints_other(index).label}
                              placeholder="Describe the symptom"
                              fullWidth
                              margin="normal"
                              variant="outlined"
                            />
                            <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage name={`complaints[${index}].complaintOther`} />
                            </MainTypography>
                          </>
                        )}

                        {/* Duration and Unit Field */}
                        <UnitInputField
                          id={complaintsFormConfig.complaints_duration(index).name}
                          name={complaintsFormConfig.complaints_duration(index).name}
                          unitName={complaintsFormConfig.complaints_duration_units(index).name}
                          label={complaintsFormConfig.complaints_duration(index).label}
                          sx={{ width: "50%" }}
                          unitOptions={durationOptions}
                          placeholder="e.g., 3"
                          inputIcon={<IoTimeOutline />}
                        />
                        <MainTypography color="red" variant="subtitle2">
                          <ErrorMessage name={`complaints[${index}].duration`} />
                        </MainTypography>
                      </div>
                    </>
                  )}
                />
              )}
            </FieldArray>
          </>
        )}
      </FormikInit>
    </>
  );
};

export default ComplaintsForm;
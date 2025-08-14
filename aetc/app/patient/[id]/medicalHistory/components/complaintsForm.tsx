"use client";;
import { useEffect, useState } from "react";
import DynamicFormList from "@/components/form/dynamicFormList"; // Import the updated component
import { FormikInit, FormValuesListener, MainTypography, SearchComboBox, UnitInputField } from "@/components";
import * as Yup from "yup";
import { IoTimeOutline } from "react-icons/io5";
import { concepts, durationOptions } from "@/constants";
import { FieldArray } from "formik";
import { Field, getIn } from "formik";
import { getConceptFromCacheOrFetch } from "@/hooks/encounter";
import { DetailsPresentingComplaintsAccordion } from "./detailsPresentingComplaintAccordion";
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
  duration: number;
  duration_unit: string;
};

const complaintsTemplate: Complaint = {
  complaint: "",
  duration: 0,
  duration_unit: "",
};
type Prop = {
  onSubmit: (values: any) => void;
};

export const ComplaintsForm = ({ onSubmit }: Prop) => {
  const [presentingComplaints, setPresentingComplaints] = useState([]);
  const [formValues, setFormValues] = useState<any>({});
  const [value, setValue] = useState<number | string>("");

  useEffect(() => {
    (async () => {
      let complaints = await getConceptFromCacheOrFetch(
        concepts.PRESENTING_COMPLAINTS
      );
      complaints = complaints.data[0].set_members.map((complaint: any) => {
        return { id: complaint.names[0].uuid, label: complaint.names[0].name };
      });
      setPresentingComplaints(complaints);
    })();
  }, []);

 const complaintsFormConfig = {
    complaints_name: (index: number) => ({
      name: `complaints[${index}].complaint`,
      label: "Symptom",
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
              {({}) => (
                <DynamicFormList
                  items={values.complaints}
                  setItems={(newItems) => setFieldValue("complaints", newItems)}
                  newItem={complaintsTemplate}
                  renderFields={(item, index) => (
                    <>
                      {/* Complaint Name Field */}
                      <div style={{ display: "flex-column", width: "100%" }}>
                        <SearchComboBox
                          name={
                            complaintsFormConfig.complaints_name(index).name
                          }
                          label={
                            complaintsFormConfig.complaints_name(index).label
                          }
                          options={presentingComplaints}
                          multiple={false}
                          sx={{ width: "100%" }}
                        />
                        <MainTypography
                          color="red" variant="subtitle2"
                        >
                          <ErrorMessage
                            name={`complaints[${index}].complaint`}
                          />
                        </MainTypography>

                        {/* Duration and Unit Field */}

                        <UnitInputField
                          id={
                            complaintsFormConfig.complaints_duration(index).name
                          }
                          name={
                            complaintsFormConfig.complaints_duration(index).name
                          }
                          unitName={
                            complaintsFormConfig.complaints_duration_units(
                              index
                            ).name
                          }
                          label={
                            complaintsFormConfig.complaints_duration(index)
                              .label
                          }
                          sx={{ width: "50%" }}
                          unitOptions={durationOptions}
                          placeholder="e.g., 3"
                          inputIcon={<IoTimeOutline />} // Optional icon
                        />
                        <MainTypography
                          color="red" variant="subtitle2"
                        >
                          <ErrorMessage
                            name={`complaints[${index}].duration`}
                          />
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

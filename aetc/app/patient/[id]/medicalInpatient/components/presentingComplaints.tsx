import {
  FormikInit,
  SearchComboBox,
  TextInputField,
  UnitInputField,
  MainTypography,
  FormFieldContainer,
  WrapperBox,
  FormFieldContainerLayout,
  FormValuesListener,
} from "@/components";
import { concepts, encounters, durationOptions } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import { getInitialValues, mapSearchComboOptionsToConcepts } from "@/helpers";
import { getObservation } from "@/helpers/emr";
import { useSubmitEncounter } from "@/hooks";
import { usePresentingComplaints } from "@/hooks/usePresentingComplaints";
import { useState } from "react";
import * as Yup from "yup";
import { FieldArray, Field, getIn } from "formik";
import { IoTimeOutline } from "react-icons/io5";
import DynamicFormList from "@/components/form/dynamicFormList";

// Define the structure of a complaint with duration
type Complaint = {
  complaint: string;
  duration: number;
  duration_unit: string;
  otherComplaintSpecify?: string;
};

const complaintsTemplate: Complaint = {
  complaint: "",
  duration: 0,
  duration_unit: "",
  otherComplaintSpecify: "",
};

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

const form = {
  complaints: {
    name: concepts.PRESENTING_COMPLAINTS, // Changed to match the new structure
    label: "Presenting Complaints",
  },
  history: {
    name: concepts.PRESENTING_HISTORY,
    label: "History of Presenting Complaints",
  },
};

// Updated validation schema to handle complaints with duration
const schema = Yup.object().shape({
  complaints: Yup.array()
    .of(
      Yup.object().shape({
        complaint: Yup.string().required("Complaint is required"),
        duration: Yup.number()
          .min(1, "Duration must be greater than 0")
          .required("Duration is required"),
        duration_unit: Yup.string().required("Duration unit is required"),
        otherComplaintSpecify: Yup.string()
          .nullable()
          .when("complaint", {
            is: concepts.OTHER,
            then: (schema) =>
              schema.required("Please specify the other complaint"),
          }),
      })
    )
    .min(1, "At least one complaint is required"),
  [form.history.name]: Yup.string().label(form.history.label),
});

const initialValues = {
  complaints: [complaintsTemplate],
  [form.history.name]: "",
};

export const PresentingComplaints = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
  const { ServerTime } = useServerTime();
  const { presentingComplaints } = usePresentingComplaints();
  const [formValues, setFormValues] = useState<any>({});

  const complaintsFormConfig = {
    complaints_name: (index: number) => ({
      name: `complaints[${index}].complaint`,
      label: "Presenting Complaint",
    }),
    complaints_duration: (index: number) => ({
      name: `complaints[${index}].duration`,
      label: "Duration",
    }),
    complaints_duration_units: (index: number) => ({
      name: `complaints[${index}].duration_unit`,
      label: "Unit",
    }),
    other_complaint_specify: (index: number) => ({
      name: `complaints[${index}].otherComplaintSpecify`,
      label: "Specify Other Complaint",
    }),
  };

  const handleSubmit = (values: any) => {
    const obsDatetime = ServerTime.getServerTimeString();

    // Create observations for each complaint with duration
    const complaintObservations = values.complaints.map(
      (complaint: Complaint) => {
        const isOther = complaint.complaint === concepts.OTHER;

        return {
          concept: complaint.complaint,
          value: isOther
            ? complaint.otherComplaintSpecify
            : complaint.complaint,
          obsDatetime: obsDatetime,
          groupMembers: [
            {
              concept: concepts.DURATION,
              value: `${complaint.duration} ${complaint.duration_unit}`,
              obsDatetime: obsDatetime,
            },
          ],
        };
      }
    );

    const obs = [
      {
        concept: concepts.PRESENTING_COMPLAINTS,
        value: concepts.PRESENTING_COMPLAINTS,
        obsDatetime: obsDatetime,
        groupMembers: complaintObservations,
      },
      {
        concept: form.history.name,
        value: values[form.history.name],
        obsDatetime,
      },
    ];

    onSubmit(obs);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => (
        <>
          <FormValuesListener getValues={setFormValues} />
          <FormFieldContainer direction="row">
            <WrapperBox
              sx={{
                bgcolor: "white",
                padding: "2ch",
                mb: "2ch",
                width: "100%",
              }}
            >
              <FormFieldContainerLayout title="Presenting complaints">
                <FieldArray name="complaints">
                  {({}) => (
                    <DynamicFormList
                      items={values.complaints}
                      setItems={(newItems) =>
                        setFieldValue("complaints", newItems)
                      }
                      newItem={complaintsTemplate}
                      renderFields={(item, index) => (
                        <>
                          <div
                            style={{ display: "flex-column", width: "100%" }}
                          >
                            {/* Complaint Name Field */}
                            <SearchComboBox
                              name={
                                complaintsFormConfig.complaints_name(index).name
                              }
                              label={
                                complaintsFormConfig.complaints_name(index)
                                  .label
                              }
                              options={presentingComplaints}
                              multiple={false}
                              sx={{ width: "100%" }}
                            />
                            <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage
                                name={`complaints[${index}].complaint`}
                              />
                            </MainTypography>

                            {/* Duration and Unit Field */}
                            <UnitInputField
                              id={
                                complaintsFormConfig.complaints_duration(index)
                                  .name
                              }
                              name={
                                complaintsFormConfig.complaints_duration(index)
                                  .name
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
                              inputIcon={<IoTimeOutline />}
                            />
                            <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage
                                name={`complaints[${index}].duration`}
                              />
                            </MainTypography>
                            <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage
                                name={`complaints[${index}].duration_unit`}
                              />
                            </MainTypography>

                            {/* Other complaint text field - only show if "Other" is selected */}
                            {item.complaint === concepts.OTHER && (
                              <>
                                <TextInputField
                                  id={
                                    complaintsFormConfig.other_complaint_specify(
                                      index
                                    ).name
                                  }
                                  label={
                                    complaintsFormConfig.other_complaint_specify(
                                      index
                                    ).label
                                  }
                                  name={
                                    complaintsFormConfig.other_complaint_specify(
                                      index
                                    ).name
                                  }
                                  placeholder="Specify the complaint"
                                  sx={{ width: "100%", mt: 1 }}
                                />
                                <MainTypography color="red" variant="subtitle2">
                                  <ErrorMessage
                                    name={`complaints[${index}].otherComplaintSpecify`}
                                  />
                                </MainTypography>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    />
                  )}
                </FieldArray>
              </FormFieldContainerLayout>
              <br />

              {/* History of presenting complaint */}
              <TextInputField
                multiline
                rows={5}
                name={form.history.name}
                label={form.history.label}
                id={form.history.name}
                sx={{ width: "100%" }}
              />
              <MainTypography color="red" variant="subtitle2">
                <ErrorMessage name={form.history.name} />
              </MainTypography>
            </WrapperBox>
          </FormFieldContainer>
        </>
      )}
    </FormikInit>
  );
};

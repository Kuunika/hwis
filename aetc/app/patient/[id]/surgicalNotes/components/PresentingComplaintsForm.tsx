"use client";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  TextInputField,
  FormFieldContainerLayout,
  FormValuesListener,
  SearchComboBox,
  UnitInputField,
  MainTypography,
} from "@/components";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { concepts, encounters, durationOptions } from "@/constants";
import { useParameters } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";
import { FieldArray, Field, getIn } from "formik";
import { IoTimeOutline } from "react-icons/io5";
import DynamicFormList from "@/components/form/dynamicFormList";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const presentingComplaintsConfig = [
  { id: concepts.FEELING_OF_A_MASS, label: "Feeling of a mass" },
  {
    id: concepts.DIFFICULTY_PAIN_ON_PASSING_STOOLS,
    label: "Difficulty/Pain on passing stools",
  },
  { id: concepts.PAIN, label: "Pain" },
  { id: concepts.NOT_PASSING_FLATUS, label: "Not passing flatus" },
  { id: concepts.PASSING_BLOODY_STOOLS, label: "Passing bloody stools" },
  { id: concepts.PASSING_MELENA, label: "Passing melena" },
  { id: concepts.NOT_PASSING_URINE, label: "Not passing urine" },
  { id: concepts.DIFFICULTY_PASSING_URINE, label: "Difficulty passing urine" },
  {
    id: concepts.PASSING_DEEP_YELLOW_URINE,
    label: "Passing deep yellow urine",
  },
  { id: concepts.PASSING_PUS_IN_URINE, label: "Passing pus in urine" },
  { id: concepts.NOT_PASSING_STOOLS, label: "Not passing stools" },
  { id: concepts.VOMITING, label: "Vomiting" },
  { id: concepts.VOMITING_BLOOD, label: "Vomiting Blood" },
  { id: concepts.DYSPHAGIA, label: "Dysphagia" },
  { id: concepts.ODYNOPHAGIA, label: "Odynophagia" },
  { id: concepts.ULCER_OR_WOUND, label: "Ulcer" },
  { id: concepts.YELLOWINGOFEYESORSKIN, label: "Yellowing of the eyes" },
  { id: concepts.BLEEDING, label: "Bleeding" },
  { id: concepts.SHORTNESS_OF_BREATH, label: "Shortness of breath" },
  { id: concepts.OTHER, label: "Other (Specify)" },
];

// Define the structure of a complaint
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

// Validation schema
const schema = yup.object().shape({
  complaints: yup.array().of(
    yup.object().shape({
      complaint: yup.string().required("Complaint is required"),
      duration: yup
        .number()
        .min(1, "Duration must be greater than 0")
        .required("Duration is required"),
      duration_unit: yup.string().required("Duration unit is required"),
      otherComplaintSpecify: yup
        .string()
        .nullable()
        .when("complaint", {
          is: concepts.OTHER,
          then: (schema) =>
            schema.required("Please specify the other complaint"),
        }),
    })
  ),
  historyOfPresentingComplaint: yup.string().required("History is required"),
});

export const PresentingComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { init, ServerTime } = useServerTime();

  useEffect(() => {
    // Finds the active visit for the patient from their visit history
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

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

  const initialValues = {
    complaints: [complaintsTemplate],
    historyOfPresentingComplaint: "",
  };

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();

    // Create observations for each complaint
    const complaintObservations = values.complaints.map(
      (complaint: Complaint) => {
        const isOther = complaint.complaint === concepts.OTHER;

        return {
          concept: complaint.complaint,
          value: isOther
            ? complaint.otherComplaintSpecify
            : complaint.complaint,
          obsDatetime: currentDateTime,
          groupMembers: [
            {
              concept: concepts.DURATION,
              value: `${complaint.duration} ${complaint.duration_unit}`,
              obsDatetime: currentDateTime,
            },
          ],
        };
      }
    );

    // Create the main observations array
    const obs = [
      {
        concept: concepts.PRESENTING_COMPLAINTS,
        value: concepts.PRESENTING_COMPLAINTS,
        obsDatetime: currentDateTime,
        groupMembers: complaintObservations,
      },
      {
        concept: concepts.PRESENTING_HISTORY,
        value: values.historyOfPresentingComplaint,
        obsDatetime: currentDateTime,
      },
    ];

    // Prepare the payload
    const payload = {
      encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: currentDateTime,
      obs,
    };

    try {
      await submitEncounter(payload);
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting presenting complaints: ", error);
    }
  };

  return (
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
                              options={presentingComplaintsConfig}
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
                sx={{ width: "100%" }}
                id="historyOfPresentingComplaint"
                name="historyOfPresentingComplaint"
                label="History of Presenting Complaint"
                multiline
                rows={5}
                placeholder="Describe the history of the presenting complaint..."
              />
              <MainTypography color="red" variant="subtitle2">
                <ErrorMessage name="historyOfPresentingComplaint" />
              </MainTypography>
            </WrapperBox>
          </FormFieldContainer>
        </>
      )}
    </FormikInit>
  );
};

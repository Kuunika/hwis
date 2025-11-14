import React, { useEffect, useState } from "react";
import {
  FormikInit,
  MainButton,
  WrapperBox,
  FormFieldContainer,
  TextInputField,
  FormValuesListener,
  RadioGroupInput,
} from "@/components";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useServerTime } from "@/contexts/serverTimeContext";
import dayjs from "dayjs";
import { Field, getIn } from "formik";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
  onPrevious: () => void;
};

const ErrorMessage = ({ name }: { name: string }) => (
  <Field
    name={name}
    render={({ form }: { form: any }) => {
      const error = getIn(form.errors, name);
      return error ? error : null;
    }}
  />
);

const injuryMechanismList = {
  assault: {
    name: "assault",
    label: "Assault",
    subOptions: [
      { label: "Physical", value: "Physical" },
      { label: "Sexual", value: "Sexual" },
    ],
  },
  roadTraffic: { name: "roadTraffic", label: "Road Traffic" },
  fall: { name: "fall", label: "Fall" },
  bite: { name: "bite", label: "Bite" },
  gunshot: { name: "gunshot", label: "Gunshot" },
  collapse: { name: "collapse", label: "Collapse of building" },
  selfInflicted: { name: "selfInflicted", label: "Self-inflicted" },
  burns: { name: "burns", label: "Burns" },
  drowning: { name: "drowning", label: "Drowning" },
  other: { name: "other", label: "Other" },
};

export const ReviewOfSystemsForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { ServerTime } = useServerTime();
  const dateTime = ServerTime.getServerTimeString();
  const [formValues, setFormValues] = useState<any>({});
  const [showTraumaFields, setShowTraumaFields] = useState(false);
  const [showAssaultOptions, setShowAssaultOptions] = useState(false);
  const [showOtherOption, setShowOtherOption] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState<{
    [key: string]: boolean;
  }>({});

  const generateValidationSchema = (): yup.ObjectSchema<any> => {
    const shape: Record<string, yup.Schema<any>> = {};

    shape["historyOfPresentingComplaints"] = yup
      .string()
      .required("History of presenting complaints is required");

    shape["wasInjured"] = yup
      .string()
      .required("Please specify whether the patient was injured");

    shape["timeOfInjury"] = yup.date().when("wasInjured", (wasInjured, schema) => {
      return wasInjured[0] === "Yes"
        ? schema.required("Time of injury is required")
        : schema.nullable();
    });

    shape["injuryMechanism"] = yup
      .boolean()
      .when("wasInjured", (wasInjured, schema) => {
        return wasInjured[0] === "Yes"
          ? schema.oneOf([true], "Injury mechanism is required")
          : schema.nullable();
      });

    Object.keys(injuryMechanismList).forEach((key) => {
      const mechanism =
        injuryMechanismList[key as keyof typeof injuryMechanismList];
      const label = `${mechanism.name}Comment`;

      if (formValues[key]) {
        shape[label] = yup
          .string()
          .required(
            `Please provide details about the ${mechanism.label} injury`
          );
      }

      if (key === "assault") {
        shape["assaultType"] = yup
          .string()
          .when("assault", (assault, schema) => {
            return assault[0]
              ? schema.required("Please specify the type of assault")
              : schema.nullable();
          });
      }
    });

    return yup.object().shape(shape);
  };

  const schema = generateValidationSchema();

  const initialValues = {
    historyOfPresentingComplaints: "",
    wasInjured: "",
    timeOfInjury: dayjs(dateTime),
    injuryMechanism: [],
    lostConsciousness: "Unknown",
    occupationalInjury: "Unknown",
    assaultType: "",
    assault: false,
    roadTraffic: false,
    fall: false,
    bite: false,
    gunshot: false,
    collapse: false,
    selfInflicted: false,
    burns: false,
    drowning: false,
    other: false,
  };

  useEffect(() => {
    setShowTraumaFields(!!(formValues["wasInjured"] === "Yes"));
    setShowAssaultOptions(formValues["assault"]);
    setShowOtherOption(formValues["other"]);

    const updatedMechanism: Record<string, boolean> = {};

    Object.keys(injuryMechanismList).forEach((key) => {
      updatedMechanism[key] = !!formValues[key];
    });

    setSelectedMechanism(updatedMechanism);

    const hasInjuryMechanism = Object.values(updatedMechanism).some(Boolean);
    hasInjuryMechanism
      ? (formValues["injuryMechanism"] = true)
      : (formValues["injuryMechanism"] = false);
  }, [formValues]);

  const handleSubmit = async () => {
    onSubmit(formValues);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />

      <WrapperBox
        sx={{
          bgcolor: "white",
          padding: "2ch",
          mb: "2ch",
          width: "100%",
          borderRadius: "5px",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            borderBottom: "2px solid #ccc",
            paddingBottom: "0.5rem",
          }}
        >
          History of Presenting Complaints
        </h3>

        <TextInputField
          id="historyOfPresentingComplaints"
          label="History of Presenting Complaints"
          name="historyOfPresentingComplaints"
          placeholder="e.g., Started with mild abdominal pain 3 days ago..."
          multiline
          rows={6}
          sx={{ width: "100%", mb: "2rem" }}
        />

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            borderBottom: "2px solid #ccc",
            paddingBottom: "0.5rem",
          }}
        >
          Trauma/Injury History
        </h3>

        <RadioGroupInput
          row
          name="wasInjured"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          label="Was the patient injured?"
        />

        {showTraumaFields && (
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "16px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <FormFieldContainer direction="row">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  name="timeOfInjury"
                  label="Select Date/Time of Injury"
                  onChange={(newValue: any) => {
                    formValues["timeOfInjury"] = newValue;
                  }}
                  sx={{ mb: "1ch", mt: "1ch", backgroundColor: "white" }}
                />
              </LocalizationProvider>
            </FormFieldContainer>

            <div style={{ marginTop: "1rem" }}>
              <RadioGroupInput
                row
                name="lostConsciousness"
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                  { value: "Unknown", label: "Unknown" },
                ]}
                label="Did the patient lose consciousness on the scene?"
              />

              <RadioGroupInput
                row
                name="occupationalInjury"
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                  { value: "Unknown", label: "Unknown" },
                ]}
                label="Was this injury work-related?"
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h4 style={{ marginBottom: "1ch" }}>Mechanism of Injury</h4>
              <div
                style={{
                  backgroundColor: "white",
                  marginBlock: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                {Object.keys(injuryMechanismList).map((key) => {
                  const mechanism =
                    injuryMechanismList[
                    key as keyof typeof injuryMechanismList
                    ];
                  return (
                    <LabelledCheckbox
                      key={key}
                      name={mechanism.name}
                      label={mechanism.label}
                    />
                  );
                })}
              </div>
              <div style={{ color: "red", fontSize: "0.875rem" }}>
                <ErrorMessage name={"injuryMechanism"} />
              </div>

              {showAssaultOptions && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px dashed #ccc",
                  }}
                >
                  <RadioGroupInput
                    name="assaultType"
                    label="Type of assault"
                    options={injuryMechanismList.assault.subOptions}
                    row={true}
                  />
                  <TextInputField
                    id="assaultComment"
                    label="Assault comments"
                    name="assaultComment"
                    placeholder="Add details about the assault"
                    multiline
                    rows={3}
                    sx={{ width: "100%", mt: "1rem" }}
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={"assaultComment"} />
                  </div>
                </div>
              )}

              {showOtherOption && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px dashed #ccc",
                  }}
                >
                  <TextInputField
                    id="otherComment"
                    label="Other mechanism comments"
                    name="otherComment"
                    placeholder="Add details about the mechanism of injury"
                    multiline
                    rows={3}
                    sx={{ width: "100%", mt: "0.5rem" }}
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={"otherComment"} />
                  </div>
                </div>
              )}

              {Object.keys(selectedMechanism).map((mechanism: string) =>
                selectedMechanism[mechanism] &&
                  mechanism !== "assault" &&
                  mechanism !== "other" ? (
                  <div
                    key={`comment-${mechanism}`}
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px dashed #ccc",
                    }}
                  >
                    <TextInputField
                      id={`${mechanism}-comment`}
                      label={`${injuryMechanismList[mechanism as keyof typeof injuryMechanismList].label} comments`}
                      name={`${mechanism}Comment`}
                      placeholder={`Add details about the ${mechanism.toLowerCase()}`}
                      multiline
                      rows={3}
                      sx={{ width: "100%", mt: "0.5rem" }}
                    />
                    <div style={{ color: "red", fontSize: "0.875rem" }}>
                      <ErrorMessage name={`${mechanism}Comment`} />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </WrapperBox>

      {/* Commented out sections */}
      {/* 
      <TextInputField
        id="events"
        label="Events(History of presenting complaints)"
        name="events"
        placeholder="e.g., Started with mild abdominal pain 3 days ago..."
        multiline
        rows={4}
        sx={{ width: "100%" }}
      />

      <FormFieldContainer direction="row">
        <SearchComboBox
          name="Gastrointenstinal_history"
          label="Gastrointestinal history"
          options={GastrointenstinalOptions}
          multiple={true}
        />
      </FormFieldContainer>
      
      <FormFieldContainer direction="row">
        <SearchComboBox
          name="Cardiac/Respiratory history"
          label="Cardiac/Respiratory history"
          options={cardiacRespiratoryOptions}
          multiple={true}
        />
      </FormFieldContainer>
      
      <FormFieldContainer direction="row">
        <SearchComboBox
          name="Nervous system history"
          label="Nervous system history"
          options={nervousSystemOptions}
          multiple={true}
        />
      </FormFieldContainer>
      
      <FormFieldContainer direction="row">
        <SearchComboBox
          name="genitourinaryHistory"
          label="Genitourinary history"
          options={genitourinaryOptions}
          multiple={true}
        />
      </FormFieldContainer>

      <FormFieldContainer direction="column">
        <div style={{ marginTop: "2rem" }}>
          <SocialHistoryPanel
            showForPrinting={showAll}
            toggleShow={setShowAll}
          />
        </div>
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "white",
            width: "32%",
            marginTop: "1rem",
          }}
        >
          <LabelledCheckbox
            name="showSocialHistory"
            label="Update social history?"
          />
        </div>
      </FormFieldContainer>
      */}

      <WrapperBox sx={{ mt: "2ch" }}>
        <MainButton
          variant="secondary"
          title="Previous"
          type="button"
          onClick={onPrevious}
          sx={{ flex: 1, marginRight: "8px" }}
        />
        <MainButton
          onClick={() => { }}
          variant="primary"
          title="Submit"
          type="submit"
          sx={{ flex: 1 }}
        />
      </WrapperBox>
    </FormikInit>
  );
};
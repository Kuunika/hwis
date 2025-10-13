import React, { useEffect, useState } from "react";
import {
  FormikInit,
  MainButton,
  WrapperBox,
  FormFieldContainer,
  TextInputField,
  FormDatePicker,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  UnitInputField,
  FormFieldContainerLayout,
  CheckboxesGroup,
} from "@/components";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { concepts, durationOptions } from "@/constants";
import { IoTimeOutline } from "react-icons/io5";
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useServerTime } from "@/contexts/serverTimeContext";
import dayjs from "dayjs";
import { Field, getIn } from "formik";
import SocialHistoryPanel from "../../medicalInpatient-/components/socialHistory";

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

const symptomList = {
  lastMeal: {
    name: "lastMeal",
    label: "Date of Last Meal",
    requiresSite: true,
  },
  events: {
    name: "events",
    label: "Events(History of presenting complaints)",
    requiresSite: true,
  },
  pain: { name: "pain", label: "Pain", requiresSite: true },
  rash: { name: "rash", label: "Rash", requiresSite: true },
  itching: { name: "itching", label: "Itching", requiresSite: true },
  earDischarge: {
    name: "earDischarge",
    label: "Ear Discharge",
    requiresSite: true,
  },
  redEye: { name: "redEye", label: "Red Eye", requiresSite: true },
  dizziness: { name: "dizziness", label: "Dizziness", requiresSite: false },
  excessiveThirst: {
    name: "excessiveThirst",
    label: "Excessive Thirst",
    requiresSite: false,
  },
  painfulEar: { name: "painfulEar", label: "Painful Ear", requiresSite: true },
  poorVision: { name: "poorVision", label: "Poor Vision", requiresSite: true },
  toothache: { name: "toothache", label: "Toothache", requiresSite: true },
  runnyNose: { name: "runnyNose", label: "Runny Nose", requiresSite: false },
  noseBleeding: {
    name: "noseBleeding",
    label: "Nose Bleeding",
    requiresSite: false,
  },
  jointSwelling: {
    name: "jointSwelling",
    label: "Joint Swelling",
    requiresSite: true,
  },
  jointPain: { name: "jointPain", label: "Joint Pain", requiresSite: true },
  deformity: { name: "deformity", label: "Deformity", requiresSite: true },
  fever: { name: "fever", label: "Fever", requiresSite: false },
  nightSweats: {
    name: "nightSweats",
    label: "Night Sweats",
    requiresSite: false,
  },
  weightLoss: { name: "weightLoss", label: "Weight Loss", requiresSite: false },
  heatIntolerance: {
    name: "heatIntolerance",
    label: "Heat Intolerance",
    requiresSite: false,
  },
  coldIntolerance: {
    name: "coldIntolerance",
    label: "Cold Intolerance",
    requiresSite: false,
  },
  bodySwelling: {
    name: "bodySwelling",
    label: "Body Swelling",
    requiresSite: true,
  },
  fatigue: { name: "fatigue", label: "Fatigue", requiresSite: false },
  poisoning: { name: "poisoning", label: "Poisoning", requiresSite: false },
  poisoningIntentional: {
    name: "intentionalPoisoning",
    label: "Intentional Poisoning",
    requiresSite: false,
  },
  ulcerWound: { name: "ulcerWound", label: "Ulcer/Wound", requiresSite: true },
};

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
};

const GastrointenstinalOptions = [
  { id: concepts.YELLOWINGOFEYESORSKIN, label: "Yellowing of eyes or skin" },
  { id: concepts.NAUSEA, label: "Nausea" },
  { id: concepts.DYSPEPSIA, label: "Dyspepsia" },
  { id: concepts.ABDOMINALPAINS, label: "Abdominal pains" },
  { id: concepts.VOMITING, label: "Vomiting" },
  { id: concepts.DIARRHOEA, label: "Diarrhoea" },
  { id: concepts.DIFFICULTYINSWALLOWING, label: "Difficulty in swallowing" },
  { id: concepts.PAINFULSWALLOWING, label: "Painful in swallowing" },
  { id: concepts.ABDOMINALDISTENSION, label: "Abdominal distension" },
  { id: concepts.BLOODYSTOOL, label: "Bloody stool" },
  { id: concepts.STOOL_INCONTINENCE, label: "Stool incontinence" },
  { id: concepts.ANAL_SWELLING, label: "Anal swelling" },
  { id: concepts.ANAL_DISCHARGE, label: "Anal discharge" },
  { id: concepts.YELLOWINGOFEYESORSKIN, label: "Yellowing of eyes or skin" },
  { id: concepts.NAUSEA, label: "Nausea" },
  { id: concepts.DYSPEPSIA, label: "Dyspepsia" },
  { id: concepts.ABDOMINALPAINS, label: "Abdominal pains" },
  { id: concepts.VOMITING, label: "Vomiting" },
  { id: concepts.DIARRHOEA, label: "Diarrhoea" },
  { id: concepts.DIFFICULTYINSWALLOWING, label: "Difficulty in swallowing" },
  { id: concepts.PAINFULSWALLOWING, label: "Painful in swallowing" },
  { id: concepts.ABDOMINALDISTENSION, label: "Abdominal distension" },
  { id: concepts.BLOODYSTOOL, label: "Bloody stool" },
  { id: concepts.STOOL_INCONTINENCE, label: "Stool incontinence" },
  { id: concepts.ANAL_SWELLING, label: "Anal swelling" },
  { id: concepts.ANAL_DISCHARGE, label: "Anal discharge" },
];

const cardiacRespiratoryOptions = [
  { id: concepts.COUGH, label: "Cough" },
  { id: concepts.SHORTNESS_OF_BREATH, label: "Shortness of breath" },
  { id: concepts.HEART_PALPITATIONS, label: "Heart palpitations" },
  { id: concepts.WHEEZES, label: "Wheezing" },
];

const nervousSystemOptions = [
  { id: concepts.HEADACHE, label: "Headache" },
  { id: concepts.CONVULSIONS, label: "Convulsions" },
  { id: concepts.CONFUSION, label: "Confusions" },
  { id: concepts.HALLUCINATIONS, label: "Hallucinations" },
  { id: concepts.ABNORMAL_BEHAVIOUR, label: "Abnormal behaviour" },
  { id: concepts.TREMOR, label: "Tremor" },
  { id: concepts.ABNORMAL_GAIT, label: "Abnormal gait" },
  { id: concepts.NUMBNESS, label: "Numbness" },
  { id: concepts.NECK_PAINS, label: "Neck pain" },
  { id: concepts.NECK_STIFFNESS, label: "Neck stiffness" },
  { id: concepts.WEAKNESS, label: "Weakness" },
];

const genitourinaryOptions = [
  { id: concepts.FREQUENT_URINATION, label: "Frequent urination" },
  { id: concepts.PAINFUL_URINATION, label: "Painful urination" },
  { id: concepts.BLOODY_URINE, label: "Bloody urine" },
  {
    id: concepts.ABNORMAL_VAGINAL_DISCHARGE,
    label: "Abnormal vaginal discharge",
  },
  { id: concepts.VAGINAL_BLEEDING, label: "Vaginal bleeding" },
  { id: concepts.SCROTAL_SWELLING, label: "Scrotal swelling" },
  { id: concepts.GENITAL_ULCER, label: "Genital ulcer" },
  { id: concepts.URINARY_RETENTION, label: "Urinary retention" },
  { id: concepts.URINARY_INCONTINENCE, label: "Urine incontinence" },
  { id: concepts.ERECTILE_DYSFUNCTION, label: "Erectile dysfunction" },
  { id: concepts.INFERTILITY, label: "Infertility" },
  { id: concepts.PROLAPSE, label: "Prolapse" },
  { id: concepts.OTHER_GENITOURINARY_CONDITION, label: "Other" },
];

export const ReviewOfSystemsForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { ServerTime } = useServerTime();
  const dateTime = ServerTime.getServerTimeString();
  const [formValues, setFormValues] = useState<any>({});
  const [showExtraFields, setShowExtraFields] = useState<any>({});
  const [showTraumaFields, setShowTraumaFields] = useState(false);
  const [showAssaultOptions, setShowAssaultOptions] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState<{
    [key: string]: boolean;
  }>({});
  const [genitourinaryOther, setGenitourinaryOther] = useState(false);
  const [updateSocial, setUpdateSocial] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  const visibleSymptoms = Object.keys(symptomList).filter((key) => {
    const typedKey = key as keyof typeof symptomList;
    const shouldRenderCheckbox =
      typedKey !== "poisoningIntentional" &&
      typedKey !== "lastMeal" &&
      typedKey !== "events";
    const shouldRenderExtras =
      showExtraFields[typedKey] && typedKey !== "poisoningIntentional";
    return shouldRenderCheckbox || shouldRenderExtras;
  });

  const displayedSymptoms = showAllSymptoms
    ? visibleSymptoms
    : visibleSymptoms.slice(0, 6);

  const generateValidationSchema = (
    symptomList: Record<string, any>
  ): yup.ObjectSchema<any> => {
    const shape: Record<string, yup.Schema<any>> = {};

    Object.keys(symptomList).forEach((key) => {
      const symptom = symptomList[key];

      if (
        !(
          key === "lastMeal" ||
          key === "events" ||
          key === "poisoningIntentional"
        )
      ) {
        if (typeof symptom === "object") {
          const symptomName = symptom.name;

          shape[`${symptomName}Duration`] = yup
            .string()
            .when(symptomName, (value, schema) => {
              if (formValues[key]) {
                return schema.required(
                  `Duration of ${symptom.label} is required`
                );
              }
              return schema.notRequired();
            });

          if (symptom.requiresSite) {
            shape[`${symptomName}_site`] = yup
              .string()
              .when(symptomName, (value, schema) => {
                if (formValues[key]) {
                  return schema.required(
                    `Please specify the site of ${symptom.label}`
                  );
                }
                return schema.notRequired();
              });
          }
        }
      }
    });

    shape["events"] = yup.string().required("Events field is required.");
    shape["timeOfInjury"] = yup.date().required("Time of injury is required.");
    shape["poisoningIntentional"] = yup
      .string()
      .when("poisoning", (poisoned, schema) => {
        return poisoned[0]
          ? schema.required("Intentional poisoning is required")
          : schema.notRequired();
      });

    shape["otherSymptom"] = yup.string().when("other", (poisoned, schema) => {
      return poisoned[0]
        ? schema.required("Symptom details are required")
        : schema.notRequired();
    });

    shape["wasInjured"] = yup
      .string()
      .required("Please specify whether the patient was injured");
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

    shape["occupation"] = yup
      .string()
      .when("showSocialHistory", (socialHistory, schema) => {
        return socialHistory[0]
          ? schema.required("Occupation is required.")
          : schema.nullable();
      });
    shape["maritalStatus"] = yup
      .string()
      .when("showSocialHistory", (socialHistory, schema) => {
        return socialHistory[0]
          ? schema.required("Marital status is required.")
          : schema.nullable();
      });

    shape["travelDetails"] = yup
      .string()
      .when("showSocialHistory", (socialHistory, schema) => {
        return socialHistory[0]
          ? schema.required("Travel details are required.")
          : schema.nullable();
      });

    shape["Gastrointenstinal_history"] = yup.array().of(
      yup.object({
        id: yup
          .string()
          .required("ID is required for Gastrointestinal history."),
        label: yup
          .string()
          .required("Label is required for Gastrointestinal history."),
      })
    );

    shape["Cardiac/Respiratory history"] = yup.array().of(
      yup.object({
        id: yup
          .string()
          .required("ID is required for Cardiac/Respiratory history."),
        label: yup
          .string()
          .required("Label is required for Cardiac/Respiratory history."),
      })
    );

    shape["Nervous system history"] = yup.array().of(
      yup.object({
        id: yup.string().required("ID is required for Nervous system history."),
        label: yup
          .string()
          .required("Label is required for Nervous system history history."),
      })
    );

    shape["genitourinaryHistory"] = yup.array().of(
      yup.object({
        id: yup.string().required("ID is required for genitourinary history."),
        label: yup
          .string()
          .required("Label is required for genitourinary history."),
      })
    );

    return yup.object().shape(shape);
  };

  const schema = generateValidationSchema(symptomList);

  const initialValues = {
    wasInjured: "",
    events: "",
    pain: false,
    painDuration: "",
    pain_site: "",
    rash: false,
    rashDuration: "",
    rash_site: "",
    itching: false,
    itchingDuration: "",
    itching_site: "",
    earDischarge: false,
    earDischargeDuration: "",
    earDischarge_site: "",
    redEye: false,
    redEyeDuration: "",
    redEye_site: "",
    dizziness: false,
    dizzinessDuration: "",
    excessiveThirst: false,
    excessiveThirstDuration: "",
    painfulEar: false,
    painfulEarDuration: "",
    painfulEar_site: "",
    poorVision: false,
    poorVisionDuration: "",
    poorVision_site: "",
    toothache: false,
    toothacheDuration: "",
    toothache_site: "",
    runnyNose: false,
    runnyNoseDuration: "",
    noseBleeding: false,
    noseBleedingDuration: "",
    jointSwelling: false,
    jointSwellingDuration: "",
    jointSwelling_site: "",
    jointPain: false,
    jointPainDuration: "",
    jointPain_site: "",
    deformity: false,
    deformityDuration: "",
    deformity_site: "",
    fever: false,
    feverDuration: "",
    nightSweats: false,
    nightSweatsDuration: "",
    weightLoss: false,
    weightLossDuration: "",
    heatIntolerance: false,
    heatIntoleranceDuration: "",
    coldIntolerance: false,
    coldIntoleranceDuration: "",
    bodySwelling: false,
    bodySwellingDuration: "",
    bodySwelling_site: "",
    fatigue: false,
    fatigueDuration: "",
    poisoning: false,
    poisoningDuration: "",
    poisoningIntentional: "",
    ulcerWound: false,
    ulcerWoundDuration: "",
    ulcerWound_site: "",
    other: false,
    otherSymptom: "",
    timeOfInjury: dayjs(dateTime),
    injuryMechanism: [],
    showSocialHistory: false,
    lostConsciousness: "Unknown",
    occupation: "",
    maritalStatus: "",
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
  };

  useEffect(() => {
    const updatedShowExtraFields: Record<string, boolean> = {};
    Object.keys(symptomList).forEach((key) => {
      if (key != "lastMeal" && key != "events")
        updatedShowExtraFields[key] = !!formValues[key];
    });

    setShowExtraFields(updatedShowExtraFields);

    setShowTraumaFields(!!(formValues["wasInjured"] === "Yes"));

    setShowAssaultOptions(formValues["assault"]);

    const updatedMechanism: Record<string, boolean> = {};

    Object.keys(injuryMechanismList).forEach((key) => {
      updatedMechanism[key] = !!formValues[key];
    });

    setSelectedMechanism(updatedMechanism);

    setShowOther(!!formValues["other"]);

    const hasInjuryMechanism = Object.values(updatedMechanism).some(Boolean);
    hasInjuryMechanism
      ? (formValues["injuryMechanism"] = true)
      : (formValues["injuryMechanism"] = false);

    const socialHistory = formValues["showSocialHistory"];
    setUpdateSocial(!!socialHistory);
  }, [formValues, symptomList, formValues["showSocialHistory"]]);

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
          General History
        </h3>

        {displayedSymptoms.map((key) => {
          const typedKey = key as keyof typeof symptomList;
          const symptom = symptomList[typedKey];

          const shouldRenderCheckbox =
            typedKey !== "poisoningIntentional" &&
            typedKey !== "lastMeal" &&
            typedKey !== "events";

          const shouldRenderExtras =
            showExtraFields[typedKey] && typedKey !== "poisoningIntentional";

          return (
            <div
              key={typedKey}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {shouldRenderCheckbox && (
                <LabelledCheckbox
                  name={symptomList[typedKey].name}
                  label={symptomList[typedKey].label}
                />
              )}

              {shouldRenderExtras && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "8px",
                  }}
                >
                  <UnitInputField
                    id={`${typedKey}Duration`}
                    name={`${typedKey}Duration`}
                    unitName={`${typedKey}DurationUnit`}
                    label="Duration"
                    unitOptions={durationOptions}
                    placeholder="e.g. 7"
                    inputIcon={<IoTimeOutline />}
                  />

                  {symptom.requiresSite && typedKey !== "poisoning" && (
                    <TextInputField
                      id={`${symptom.name}_site`}
                      label="Specify Site"
                      name={`${symptom.name}_site`}
                      placeholder="Specify the site"
                    />
                  )}

                  {typedKey === "poisoning" && (
                    <RadioGroupInput
                      row
                      name="poisoningIntentional"
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                      label="Was the poisoning intentional?"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {visibleSymptoms.length > 6 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              onClick={() => setShowAllSymptoms((prev) => !prev)}
              style={{
                background: "none",
                border: "none",
                color: "Green",
                cursor: "pointer",
                fontSize: "0.95rem",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              {showAllSymptoms ? "View Less" : "View More"}
            </button>
          </div>
        )}

        <div
          style={{
            border: "1px dashed #aaa",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "24px",
          }}
        >
          <LabelledCheckbox name="other" label="Other symptom" />

          {showOther && (
            <TextInputField
              id="otherSymptom"
              label="Specify other symptom"
              name="otherSymptom"
              placeholder="Provide details of the symptom"
              sx={{ width: "100%", marginTop: "12px" }}
            />
          )}
        </div>

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            borderBottom: "2px solid #ccc",
            paddingBottom: "0.5rem",
            marginTop: "2rem",
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
                    marginLeft: "1em",
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
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={"assaultComment"} />
                  </div>
                </div>
              )}

              {Object.keys(selectedMechanism).map((mechanism: string) =>
                selectedMechanism[mechanism] && mechanism !== "assault" ? (
                  <TextInputField
                    key={`comment-${mechanism}`}
                    id={`${mechanism}-comment`}
                    label={`${mechanism} comments`}
                    name={`${mechanism}Comment`}
                    placeholder={`Add details about the ${mechanism.toLowerCase()}`}
                    multiline
                    rows={3}
                    sx={{ mt: "1rem" }}
                  />
                ) : null
              )}
            </div>
          </div>
        )}
      </WrapperBox>

      <TextInputField
        id={symptomList.events.name}
        label={symptomList.events.label}
        name={symptomList.events.name}
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
          getValue={(values) => {
            const other = values.some(
              (value: any) => value.label === genitourinaryOptions[12].label
            );
            if (other) {
              setGenitourinaryOther(true);
            }
          }}
        />

        {genitourinaryOther && (
          <TextInputField
            id="Other_Genitourinary_condition"
            name="Other_Genitourinary_condition"
            label="Specify condition"
            sx={{ marginLeft: "2ch" }}
          />
        )}
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
        {updateSocial && (
          <>
            <RadioGroupInput
              row={true}
              name="occupation"
              label="What is the patients occupation?"
              options={[
                { label: "Working", value: "working" },
                { label: "Business", value: "business" },
                { label: "Unemployed", value: "unemployed" },
                { label: "Self Employed", value: "selfemployed" },
                { label: "Student", value: "student" },
                { label: "House Wife", value: "housewife" },
                { label: "Unknown", value: "unknown" },
              ]}
              sx={{ mb: "1ch" }}
            />
            <CheckboxesGroup
              getValue={(value: Array<any>) => {}}
              name="socialDetails"
              options={[
                { label: "Smoker", value: "smoking" },
                { label: "Drinker", value: "alcohol" },
              ]}
            />
            <RadioGroupInput
              sx={{ mt: "1ch" }}
              row={true}
              name="maritalStatus"
              label="What is the patients marital status?"
              options={[
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Separated", value: "separated" },
                { label: "Widowed", value: "widow/widower" },
                { label: "Divorced", value: "divorced" },
                { label: "Unknown", value: "unknown" },
              ]}
            />
            <TextInputField
              id="travelDetails"
              name="travelDetails"
              label="Travel Details"
              multiline
              rows={4}
            />
          </>
        )}
      </FormFieldContainer>

      <WrapperBox>
        <MainButton
          variant="secondary"
          title="Previous"
          type="button"
          onClick={onPrevious}
          sx={{ flex: 1, marginRight: "8px" }}
        />
        <MainButton
          onClick={() => {}}
          variant="primary"
          title="Next"
          type="submit"
          sx={{ flex: 1 }}
        />
      </WrapperBox>
    </FormikInit>
  );
};

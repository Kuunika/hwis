// @ts-nocheck
import {
  FormikInit,
  FormValuesListener,
  MainButton,
  WrapperBox,
  FormFieldContainer,
  TextInputField,
} from "@/components";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getInitialValues } from "@/helpers";
import { Field, getIn } from "formik";
import FamilyHistoryPanel from "../../medicalInpatient/components/familyHistory";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value: any;
  children: ProcessedObservation[];
}

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const familyHistoryFormConfig = {
  asthma: { name: "asthma", label: "Asthma" },
  hypertension: { name: "hypertension", label: "Hypertension" },
  diabetes_mellitus: { name: "diabetes_mellitus", label: "Diabetes mellitus" },
  epilepsy: { name: "epilepsy", label: "Epilepsy" },
  cancer: { name: "cancer", label: "Cancer" },
  tuberculosis: { name: "tuberculosis", label: "Tuberculosis" },
  other: { name: "other", label: "Other (Specify)" },
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

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [formValues, setFormValues] = useState<any>({});
  const [showRelationshipFields, setShowRelationshipFields] = useState({
    asthma: false,
    hypertension: false,
    diabetes_mellitus: false,
    epilepsy: false,
    cancer: false,
    tuberculosis: false,
    other: false,
  });
  const [familyHistory, setFamilyHistory] = useState<ProcessedObservation[]>(
    []
  );
  const [showAll, setShowAll] = useState(false);

  const schema = yup.object().shape({
    asthma: yup.boolean(),
    asthmaRelationship: yup.string().when("asthma", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for asthma"),
      otherwise: (schema) => schema.notRequired(),
    }),
    hypertension: yup.boolean(),
    hypertensionRelationship: yup.string().when("hypertension", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for hypertension"),
      otherwise: (schema) => schema.notRequired(),
    }),
    diabetes_mellitus: yup.boolean(),
    diabetes_mellitusRelationship: yup.string().when("diabetes_mellitus", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for diabetes mellitus"),
      otherwise: (schema) => schema.notRequired(),
    }),
    epilepsy: yup.boolean(),
    epilepsyRelationship: yup.string().when("epilepsy", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for epilepsy"),
      otherwise: (schema) => schema.notRequired(),
    }),
    cancer: yup.boolean(),
    cancerType: yup.string().when("cancer", {
      is: true,
      then: (schema) => schema.required("Please specify the type of cancer"),
      otherwise: (schema) => schema.notRequired(),
    }),
    cancerRelationship: yup.string().when("cancer", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for cancer"),
      otherwise: (schema) => schema.notRequired(),
    }),
    tuberculosis: yup.boolean(),
    tuberculosisRelationship: yup.string().when("tuberculosis", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for tuberculosis"),
      otherwise: (schema) => schema.notRequired(),
    }),
    other: yup.boolean(),
    otherSpecify: yup.string().when("other", {
      is: true,
      then: (schema) => schema.required("Please specify the other condition"),
      otherwise: (schema) => schema.notRequired(),
    }),
    otherRelationship: yup.string().when("other", {
      is: true,
      then: (schema) =>
        schema.required("Please specify relationship for the other condition"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const initialValues = {
    asthma: false,
    hypertension: false,
    diabetes_mellitus: false,
    epilepsy: false,
    cancer: false,
    tuberculosis: false,
    other: false,
  };

  const handleCheckboxChange = (e: any, field: string) => {
    const isChecked = e.target.checked;
    setShowRelationshipFields((prev) => ({
      ...prev,
      [field]: isChecked,
    }));
    setFormValues((prev: any) => ({
      ...prev,
      [field]: isChecked,
    }));
  };

  const handleSubmit = async () => {
    await schema.validate(formValues);
    onSubmit(formValues);
  };

  useEffect(() => {
    setShowRelationshipFields((prev) => {
      const updatedFields: Record<string, boolean> = { ...prev };

      Object.keys(familyHistoryFormConfig).forEach((key) => {
        updatedFields[key] = !!formValues[key];
      });

      return updatedFields;
    });
  }, [formValues, familyHistoryFormConfig]);

  return (
    <>
      <FamilyHistoryPanel showForPrinting={showAll} toggleShow={setShowAll} />
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
        <FormFieldContainer direction="row">
          <WrapperBox
            sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}
          >
            {Object.keys(familyHistoryFormConfig).map((key) => {
              // Ensure TypeScript knows that `key` is one of the keys in `familyHistoryFormConfig`
              const typedKey = key as keyof typeof familyHistoryFormConfig;

              return (
                <div key={typedKey}>
                  <LabelledCheckbox
                    name={familyHistoryFormConfig[typedKey].name}
                    label={familyHistoryFormConfig[typedKey].label}
                    checked={formValues[typedKey]}
                  />
                  {showRelationshipFields[typedKey] && (
                    <>
                      {typedKey === "cancer" ? (
                        <>
                          <TextInputField
                            id="cancerType"
                            label="Type of Cancer"
                            name="cancerType"
                            placeholder="Specify type of cancer"
                            sx={{ mr: "2ch" }}
                          />
                          <TextInputField
                            id="cancerRelationship"
                            label="Relationship to family member"
                            name="cancerRelationship"
                            placeholder="e.g., Mother"
                          />
                        </>
                      ) : typedKey === "other" ? (
                        <>
                          <TextInputField
                            id="otherSpecify"
                            label="Specify Other Condition"
                            name="otherSpecify"
                            placeholder="Specify the condition"
                            sx={{ mr: "2ch" }}
                          />
                          <TextInputField
                            id="otherRelationship"
                            label="Relationship to family member"
                            name="otherRelationship"
                            placeholder="e.g., Mother"
                          />
                        </>
                      ) : (
                        <TextInputField
                          id={`${typedKey}Relationship`}
                          label="Relationship to family member"
                          name={`${typedKey}Relationship`}
                          placeholder="e.g., Mother"
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </WrapperBox>
        </FormFieldContainer>

        <WrapperBox>
          <MainButton
            variant="secondary"
            title="Previous"
            type="button"
            onClick={onSkip}
            sx={{ flex: 1, marginRight: "8px" }}
          />
          <MainButton
            onClick={handleSubmit}
            variant="primary"
            title="Submit"
            type="submit"
            sx={{ flex: 1 }}
          />
        </WrapperBox>
      </FormikInit>
    </>
  );
};

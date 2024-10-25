// @ts-nocheck
import {
    FormikInit,
    FormValuesListener,
    MainButton,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    
  } from "@/components";
  import { useState } from "react";
  import * as yup from "yup";
  import LabelledCheckbox from "@/components/form/labelledCheckBox";
  
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
  
  export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
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
  
    const schema = yup.object().shape({
        asthma: yup.boolean(),
        asthmaRelationship: yup.string().when("asthma", (asthma, schema) => 
          asthma ? schema.required("Please specify relationship for asthma") : schema
        ),
        hypertension: yup.boolean(),
        hypertensionRelationship: yup.string().when("hypertension", (hypertension, schema) => 
          hypertension ? schema.required("Please specify relationship for hypertension") : schema
        ),
        diabetes_mellitus: yup.boolean(),
        diabetesMellitusRelationship: yup.string().when("diabetes_mellitus", (diabetes_mellitus, schema) => 
          diabetes_mellitus ? schema.required("Please specify relationship for diabetes mellitus") : schema
        ),
        epilepsy: yup.boolean(),
        epilepsyRelationship: yup.string().when("epilepsy", (epilepsy, schema) => 
          epilepsy ? schema.required("Please specify relationship for epilepsy") : schema
        ),
        cancer: yup.boolean(),
        cancerType: yup.string().when("cancer", (cancer, schema) => 
          cancer ? schema.required("Please specify the type of cancer") : schema
        ),
        cancerRelationship: yup.string().when("cancer", (cancer, schema) => 
          cancer ? schema.required("Please specify relationship for cancer") : schema
        ),
        tuberculosis: yup.boolean(),
        tuberculosisRelationship: yup.string().when("tuberculosis", (tuberculosis, schema) => 
          tuberculosis ? schema.required("Please specify relationship for tuberculosis") : schema
        ),
        other: yup.boolean(),
        otherSpecify: yup.string().when("other", (other, schema) => 
          other ? schema.required("Please specify the other condition") : schema
        ),
        otherRelationship: yup.string().when("other", (other, schema) => 
          other ? schema.required("Please specify relationship for the other condition") : schema
        ),
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
  
    const handleSubmit = () => {
      console.log(formValues);
      onSubmit(formValues);
    };
  
    return (
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
        <FormFieldContainer direction="row">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width:'100%' }}>
  {Object.keys(familyHistoryFormConfig).map((key) => {
    // Ensure TypeScript knows that `key` is one of the keys in `familyHistoryFormConfig`
    const typedKey = key as keyof typeof familyHistoryFormConfig;

    return (
      <div key={typedKey}>
        <LabelledCheckbox
          label={familyHistoryFormConfig[typedKey].label}
          checked={formValues[typedKey] || false}
          onChange={(e) => handleCheckboxChange(e, typedKey)}
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
                  sx={{mr:'2ch'}}
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
                  sx={{mr:'2ch'}}
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
          <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
          <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
        </WrapperBox>
      </FormikInit>
    );
  };
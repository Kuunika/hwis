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
      asthmaRelationship: yup.string().when("asthma", {
        is: true,
        then: yup.string().required("Please specify relationship for asthma"),
      }),
      hypertension: yup.boolean(),
      hypertensionRelationship: yup.string().when("hypertension", {
        is: true,
        then: yup.string().required("Please specify relationship for hypertension"),
      }),
      diabetes_mellitus: yup.boolean(),
      diabetesMellitusRelationship: yup.string().when("diabetes_mellitus", {
        is: true,
        then: yup.string().required("Please specify relationship for diabetes mellitus"),
      }),
      epilepsy: yup.boolean(),
      epilepsyRelationship: yup.string().when("epilepsy", {
        is: true,
        then: yup.string().required("Please specify relationship for epilepsy"),
      }),
      cancer: yup.boolean(),
      cancerType: yup.string().when("cancer", {
        is: true,
        then: yup.string().required("Please specify the type of cancer"),
      }),
      cancerRelationship: yup.string().when("cancer", {
        is: true,
        then: yup.string().required("Please specify relationship for cancer"),
      }),
      tuberculosis: yup.boolean(),
      tuberculosisRelationship: yup.string().when("tuberculosis", {
        is: true,
        then: yup.string().required("Please specify relationship for tuberculosis"),
      }),
      other: yup.boolean(),
      otherSpecify: yup.string().when("other", {
        is: true,
        then: yup.string().required("Please specify the other condition"),
      }),
      otherRelationship: yup.string().when("other", {
        is: true,
        then: yup.string().required("Please specify relationship for the other condition"),
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
      setFormValues((prev) => ({
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
            {Object.keys(familyHistoryFormConfig).map((key) => (
              <div key={key}>
                <LabelledCheckbox
                  label={familyHistoryFormConfig[key].label}
                  checked={formValues[key] || false}
                  onChange={(e) => handleCheckboxChange(e, key)}
                />
                {showRelationshipFields[key] && (
                  <>
                    {key === "cancer" ? (
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
                    ) : key === "other" ? (
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
                        id={`${key}Relationship`}
                        label="Relationship to family member"
                        name={`${key}Relationship`}
                        placeholder="e.g., Mother"
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </WrapperBox>
        </FormFieldContainer>
  
        <WrapperBox>
          <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
          <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
        </WrapperBox>
      </FormikInit>
    );
  };
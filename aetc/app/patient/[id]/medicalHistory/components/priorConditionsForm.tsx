"use client";
import {
  FieldsContainer,
  FormDatePicker,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormikInit,
  FormValuesListener,
  MainButton,
  MainTypography,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { Field, FieldArray, getIn } from "formik";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Obs } from "@/interfaces";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import OfflineICD11Selection from "@/components/form/offLineICD11Diagnosis";
import { MdOutlineClose } from "react-icons/md";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
  onPrevious: ()=>void;
};

type Condition = {
  name: string;
  date: string;
  onTreatment: string;
  additionalDetails: string;
};

const conditionTemplate: Condition = {
  name: "",
  date: "",
  onTreatment: "",
  additionalDetails: "",
};

const initialValues = {
  conditions: [conditionTemplate],
  none: false
};

const priorConditionsFormConfig = {
  conditions_name: (index: number) => ({
    name: `conditions[${index}].name`,
    label: "Condition",
  }),
  conditions_diagnosis_date: (index: number) => ({
    name: `conditions[${index}].date`,
    label: "Date of diagnosis",
  }),
  conditions_on_treatment: (index: number) => ({
    name: `conditions[${index}].onTreatment`,
    label: "On treatment?",
  }),
  conditions_additional_details: (index: number) => ({
    name: `conditions[${index}].additionalDetails`,
    label: "Additional details",
  }),
};

const conditionsSchema = Yup.object().shape({
      name: Yup.string().required("Condition name is required"),

      date: Yup.date()
        .nullable()
        .required("Date of diagnosis is required")
        .typeError("Invalid date format")
        .max(new Date(), "Date of diagnosis cannot be in the future"),

      onTreatment: Yup.string().required("Treatment status is required"),

      additionalDetails: Yup.string().optional(),

});

const schema = Yup.object().shape({
  none: Yup.boolean().required(),
  conditions: Yup.array().when("none", {
    is: false,
    then: (schema) =>
      schema
        .of(conditionsSchema)
        .min(1, "At least one condition must be added"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

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

export const PriorConditionsForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [formValues, setFormValues] = useState<any>({});
  const [existingHistory, setExistingHistory] = useState<string[]>();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const conditionsEncounters = data?.filter(
        (item) =>
          item.encounter_type?.name === "DIAGNOSIS" && item.obs?.length !== 4
      );

      const ICD11Obs = conditionsEncounters?.[0]?.obs?.filter(
        (obsItem) => (obsItem as Obs).names[0].name === "ICD11 Diagnosis"
      );

      const uniqueObs = new Map();

      ICD11Obs?.forEach((obs) => {
        const uniqueKey = obs.value;
        if (!uniqueObs.has(uniqueKey)) {
          uniqueObs.set(uniqueKey, obs);
        }
      });

      const uniqueDiagnoses = Array.from(uniqueObs.keys());

      setExistingHistory(uniqueDiagnoses);
    }
  }, [data]);

  const handleSubmit = async () => {
    if(formValues.none){
      onSkip();
      return;
    }
    onSubmit(formValues);
  };

  const handleICD11Selection = (selectedEntity: any, index: number) => {
    const updatedSelections = { ...selectedDiagnosis };
    updatedSelections[index] = selectedEntity.diagnosis + " - " + selectedEntity.code;

    setSelectedDiagnosis(updatedSelections);

    const updatedValues = { ...formValues };
    updatedValues.conditions[index].name = selectedEntity.code +","+ selectedEntity.diagnosis;

    setFormValues(updatedValues);
  };

  const handleClear = (index: number) => {
      const updatedSelections = { ...selectedDiagnosis };
      updatedSelections[index] = "";

      setSelectedDiagnosis(updatedSelections);
      
    };


  return (
    <>
      {existingHistory && existingHistory.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ color: "rgba(0, 0, 0, 0.6)", marginBottom: "10px" }}>
            Known Conditions
          </h4>
          {existingHistory?.map((condition, index) => (
            <p key={index} style={{ color: "rgba(0, 0, 0, 0.6)", margin: 0 }}>
              {condition}
            </p>
          ))}
        </div>
      )}
      <FormikInit
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
        enableReinitialize
        submitButton={false}
      >
        {({ values, setFieldValue }) => (
          <>
                  <div style={{marginBottom:"2ch"}}>
        <LabelledCheckbox
          name="none"
          label="Patient has no prior/existing conditions"
        />
        </div>
            <FormValuesListener getValues={setFormValues} />
            <FieldArray name="conditions">
              {({ push, remove }) => (
                <>
                  <DynamicFormList
                    items={values.conditions}
                    setItems={(newItems) =>
                      setFieldValue("conditions", newItems)
                    }
                    newItem={conditionTemplate}
                    renderFields={(item, index) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          
                            <FormDatePicker
                              name={
                                priorConditionsFormConfig.conditions_diagnosis_date(
                                  index
                                ).name
                              }
                              disabled={formValues.none}
                              label={
                                priorConditionsFormConfig.conditions_diagnosis_date(
                                  index
                                ).label
                              }
                              sx={{ background: "white", width: "100%" }}
                            />
                           <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage
                                name={
                                  priorConditionsFormConfig.conditions_diagnosis_date(
                                    index
                                  ).name
                                }
                              />
                            </MainTypography>
                                {selectedDiagnosis[index] !=="" && selectedDiagnosis[index] ? (
                                    <div 
                                      style={{ 
                                        backgroundColor: "white", 
                                        display: 'flex', 
                                        flexDirection: 'row', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        gap: '1rem', 
                                        borderRadius: "5px",
                                        border: '1px solid #e0e0e0',
                                        minHeight: '48px'
                                      }}
                                    >
                                      <label style={{ fontWeight: "bold" }}>
                                        {selectedDiagnosis[index]}
                                      </label>
                                      <MdOutlineClose 
                                        color={"red"} 
                                        onClick={()=>handleClear(index)} 
                                        style={{ cursor: "pointer" }} 
                                      />
                                    </div>
                                  ) : (<>
                              <OfflineICD11Selection
            label="Diagnosis"
            initialValue=""
            onSelection={(entity: any) => handleICD11Selection(entity, index)}
            placeholder="Start typing to search diagnoses..."
          />
                                    <MainTypography color="red" variant="subtitle2">
                            <ErrorMessage
                              name={
                                priorConditionsFormConfig.conditions_name(index)
                                  .name
                              }
                            />
                          </MainTypography>
          </>)}

                          <div>
                            <RadioGroupInput
                            disabled={formValues.none}
                              name={
                                priorConditionsFormConfig.conditions_on_treatment(
                                  index
                                ).name
                              }
                              options={[
                                { value: "Yes", label: "Yes" },
                                { value: "No", label: "No" },
                                { value: "Unknown", label: "Unknown" },
                              ]}
                              label={
                                priorConditionsFormConfig.conditions_on_treatment(
                                  index
                                ).label
                              }
                            />
                            <MainTypography color="red" variant="subtitle2">
                              <ErrorMessage
                                name={
                                  priorConditionsFormConfig.conditions_on_treatment(
                                    index
                                  ).name
                                }
                              />
                            </MainTypography>
                          </div>
                        </div>

                        <TextInputField
                        disabled={formValues.none}
                          id={
                            priorConditionsFormConfig.conditions_additional_details(
                              index
                            ).name
                          }
                          name={
                            priorConditionsFormConfig.conditions_additional_details(
                              index
                            ).name
                          }
                          label={
                            priorConditionsFormConfig.conditions_additional_details(
                              index
                            ).label
                          }
                          sx={{ width: "100%" }}
                          multiline={true}
                          rows={3}
                        />
                        <div style={{ color: "red", fontSize: "0.875rem" }}>
                          <ErrorMessage
                            name={
                              priorConditionsFormConfig.conditions_additional_details(
                                index
                              ).name
                            }
                          />
                        </div>
                      </>
                    )}
                  />
                  <WrapperBox sx={{ mt: "2ch" }}>
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
                </>
              )}
            </FieldArray>
          </>
        )}
      </FormikInit>
    </>
  );
};

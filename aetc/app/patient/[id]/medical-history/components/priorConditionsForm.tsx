"use client"
import {
    FieldsContainer,
    FormDatePicker,
    FormFieldContainerLayout,
    FormikInit,
    FormValuesListener,
    MainButton,
    SearchComboBox,
    TextInputField,
    WrapperBox,
  } from "@/components";
  import { Checkbox, IconButton, TableCell } from "@mui/material";
  import { FaPlus, FaMinus } from "react-icons/fa6";
  import { useEffect, useState } from "react";
  import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { FaExternalLinkAlt } from "react-icons/fa";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { FieldArray } from "formik";
  
  type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };

  type Condition = {
    name: string;
    date: string;
    onTreatment: boolean;
    additionalDetails: string;
  };
  
  const conditionTemplate: Condition = {
    name: "",
    date:"",
    onTreatment:false,
    additionalDetails:""
  };
  
  const initialValues = {
    conditions: [conditionTemplate],
  };
  
  const priorConditionsFormConfig = {
    conditions_name: (index: number) => ({
      name: `conditions[${index}].name`,
      label: 'Condition'
    }),
    conditions_diagnosis_date: (index: number) => ({
      name: `conditions[${index}].date`,
      label: 'Date of diagnosis'
    }),
    conditions_on_treatment: (index: number) => ({
      name: `conditions[${index}].onTreatment`,
      label: 'On treatment?'
    }),
    conditions_additional_details: (index: number) => ({
      name: `conditions[${index}].additionalDetails`,
      label: 'Additional details'
    })
  };
  
  const schema = Yup.object().shape({
    surgeries: Yup.array().of(
      Yup.object().shape({
        surgical_procedure_name: Yup.string().required("Drug name is required"),
        surgical_procedure_date: Yup.string().required("Dose is required"),
        surgical_procedure_indication: Yup.string().required("Route is required"),
        surgical_procedure_complications: Yup.string().required("Prescriber is required"),
      })
    ),
  });
  
  
  
  export const PriorConditionsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [diagnosisOptions, setDiagnosisOptions] = useState<{ id: string; label: string }[]>([]);
      const diagnosesConceptId = "b8e32cd6-8d80-11d8-abbb-0024217bb78e"
      const {
        data: diagnoses,
        isLoading: diagnosesLoading,
        refetch: reloadDiagnoses,
        isRefetching: reloadingDiagnoses,
      } = getConceptSetMembers(diagnosesConceptId);


    useEffect(() => {
      reloadDiagnoses();
      if (diagnoses) {
        const formatDiagnosisOptions = (diagnoses: any) => {
          return diagnoses.map((diagnosis: { uuid: string; names: { name: any; }[]; }) => ({
            id: diagnosis.uuid,
            label: diagnosis.names[0].name,
          }));
        };
        setDiagnosisOptions(formatDiagnosisOptions(diagnoses));
      }
    }, [diagnoses]);
  
    const handleSubmit = () => {
     onSubmit(formValues);
    };
  
    return (
      <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize
      submitButton={false}
    >
        {({ values, setFieldValue }) => (
          <>
            <FormValuesListener getValues={setFormValues} />
            <FieldArray name="conditions">
              {({ push, remove }) => (
                <>
                  <a
                    href="https://icd.who.int/browse/2024-01/mms/en"
                    style={{
                      color: 'primary',
                      textDecorationLine: 'underline',
                      paddingRight: '1ch',
                      fontSize: 'small',
                    }}
                  >
                    ICD11 List of diagnoses <FaExternalLinkAlt />
                  </a>
                  
                  <DynamicFormList
                    items={values.conditions}
                    setItems={(newItems) => setFieldValue("conditions", newItems)}
                    newItem={conditionTemplate}
                    renderFields={(item, index) => (
                      <>
                        <SearchComboBox
                          name={priorConditionsFormConfig.conditions_name(index).name}
                          label={priorConditionsFormConfig.conditions_name(index).label}
                          options={diagnosisOptions}
                          multiple={false}
                          sx={{ width: '100%' }}
                        />
                        <FormDatePicker
                          name={priorConditionsFormConfig.conditions_diagnosis_date(index).name}
                          label={priorConditionsFormConfig.conditions_diagnosis_date(index).label}
                          sx={{ background: 'white', width: '150px' }}
                        />
                        <LabelledCheckbox
                          label={priorConditionsFormConfig.conditions_on_treatment(index).label}
                          checked={values.conditions[index].onTreatment || false}
                          onChange={(e) =>
                            setFieldValue(priorConditionsFormConfig.conditions_on_treatment(index).name, e.target.checked)
                          }
                        />
                        <TextInputField
                          id={priorConditionsFormConfig.conditions_additional_details(index).name}
                          name={priorConditionsFormConfig.conditions_additional_details(index).name}
                          label={priorConditionsFormConfig.conditions_additional_details(index).label}
                          sx={{ width: '100%' }}
                          multiline={true}
                          rows={3}
                        />
                      </>
                    )}
                  />
                </>
              )}
            </FieldArray>
            <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
            <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
          </>
        )}
      </FormikInit>
    );
  };
"use client";
import {
  FieldsContainer,
  FormDatePicker,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormikInit,
  FormValuesListener,
  MainButton,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import { Checkbox, IconButton, RadioGroup, TableCell } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { Field, FieldArray, getIn } from "formik";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Obs } from "@/interfaces";
import ECTReactComponent from "@/components/form/ECTReactComponent";
import { MdOutlineClose } from "react-icons/md";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
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

const schema = Yup.object().shape({
  conditions: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Condition name is required"),

      date: Yup.date()
        .nullable()
        .required("Date of diagnosis is required")
        .typeError("Invalid date format")
        .max(new Date(), "Date of diagnosis cannot be in the future"),

      onTreatment: Yup.string().required("Treatment status is required"),

      additionalDetails: Yup.string().optional(),
    })
  ),
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

export const PriorConditionsForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [formValues, setFormValues] = useState<any>({});
  const [existingHistory, setExistingHistory] = useState<string[]>();
  interface ShowSelectionState {
    [key: number]: boolean;
  }

  const [showSelection, setShowSelection] = useState<ShowSelectionState>({});

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
    await schema.validate(formValues);
    onSubmit(formValues);
  };

  const handleICD11Selection = (selectedEntity: any, index: number) => {
    setShowSelection((prev) => ({ ...prev, [index]: true }));
    formValues.conditions[index][
      "name"
    ] = `${selectedEntity.code}, ${selectedEntity.bestMatchText}`;
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
                          {showSelection[index] ? (
                            <div
                              style={{
                                backgroundColor: "white",
                                display: "flex",
                                flexDirection: "row",
                                gap: "1rem",
                                borderRadius: "5px",
                                padding: "1ch",
                              }}
                            >
                              <label style={{ fontWeight: "bold" }}>
                                {formValues.conditions[index]["name"]}
                              </label>
                              <MdOutlineClose
                                color={"red"}
                                onClick={() => {
                                  setShowSelection((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
                                  formValues.conditions[index]["name"] = "";
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ) : (
                            <ECTReactComponent
                              onICD11Selection={(selectedEntity: any) =>
                                handleICD11Selection(selectedEntity, index)
                              }
                              label={"Condition"}
                              iNo={index + 1}
                            />
                          )}
                          <div style={{ color: "red", fontSize: "0.875rem" }}>
                            <ErrorMessage
                              name={
                                priorConditionsFormConfig.conditions_name(index)
                                  .name
                              }
                            />
                          </div>
                          <div>
                            <FormDatePicker
                              name={
                                priorConditionsFormConfig.conditions_diagnosis_date(
                                  index
                                ).name
                              }
                              label={
                                priorConditionsFormConfig.conditions_diagnosis_date(
                                  index
                                ).label
                              }
                              sx={{ background: "white", width: "100%" }}
                            />
                            <div
                              style={{
                                color: "red",
                                fontSize: "0.875rem",
                                marginTop: "0.5rem",
                              }}
                            >
                              <ErrorMessage
                                name={
                                  priorConditionsFormConfig.conditions_diagnosis_date(
                                    index
                                  ).name
                                }
                              />
                            </div>

                            <RadioGroupInput
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
                            <div style={{ color: "red", fontSize: "0.875rem" }}>
                              <ErrorMessage
                                name={
                                  priorConditionsFormConfig.conditions_on_treatment(
                                    index
                                  ).name
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <TextInputField
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
                      onClick={onSkip}
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

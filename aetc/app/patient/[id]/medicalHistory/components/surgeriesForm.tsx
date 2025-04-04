import {
  FormDatePicker,
  FormikInit,
  FormValuesListener,
  MainButton,
  MainTypography,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import React, { use, useEffect, useState } from "react";
import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { Field, FieldArray, getIn } from "formik";
import { concepts } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import PastSurgicalHistoryPanel from "../../medicalInpatient-/components/pastSurgicalHistory";
import LabelledCheckbox from "@/components/form/labelledCheckBox";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[];
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
  onPrevious: ()=>void;
};

type Surgery = {
  procedure: string;
  other: string;
  indication: string;
  date: string;
  complication: string;
};

const surgeryTemplate: Surgery = {
  procedure: "",
  other: "",
  date: "",
  complication: "",
  indication: "",
};

const initialValues = {
  surgeries: [surgeryTemplate],
  none: false
};

const surgeryFormConfig = {
  surgical_procedure_name: (index: number) => ({
    name: `surgeries[${index}].procedure`,
    label: "Procedure",
  }),
  surgical_procedure_other: (index: number) => ({
    name: `surgeries[${index}].other`,
    label: "Procedure",
  }),
  surgical_procedure_date: (index: number) => ({
    name: `surgeries[${index}].date`,
    label: "Date",
  }),

  surgical_procedure_indication: (index: number) => ({
    name: `surgeries[${index}].indication`,
    label: "Indication",
  }),
  surgical_procedure_complications: (index: number) => ({
    name: `surgeries[${index}].complication`,
    label: "Complications",
  }),
};

const surgeriesSchema = Yup.object().shape({

      procedure: Yup.string().required("Surgical procedure is required"),
      other: Yup.string().when("procedure", {
        is: (procedure: string) => procedure === "other_surgical_procedure",
        then: (schema) =>
          schema.required("Other surgical procedure is required"),
        otherwise: (schema) => schema.optional(),
      }),
      date: Yup.date()
        .required("Date of surgery is required")
        .nullable()
        .max(new Date(), "Date cannot be in the future"),
      complication: Yup.string().optional(),
      indication: Yup.string().required("Indication is required"),

});

export const schema = Yup.object().shape({
  none: Yup.boolean().required(),
  surgeries: Yup.array().when("none", {
    is: false,
    then: (schema) =>
      schema
        .of(surgeriesSchema)
        .min(1, "At least one medication must be added"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const surgicalProcedures = [
  { id: concepts.EXPLORATORY_LAPAROTOMY, label: "Exploratory laparotomy" },
  { id: concepts.CAESARIAN_SECTION, label: "Caesarian section" },
  { id: concepts.INCISION_AND_DRAINAGE, label: "Incision and drainage" },
  { id: concepts.THORACOTOMY, label: "Thoracotomy" },
  { id: concepts.CIRCUMCISION, label: "Circumcision" },
  { id: concepts.DEBRIDEMENT, label: "Debridement" },
  { id: concepts.HYSTERECTOMY, label: "Hysterectomy" },
  { id: concepts.ORIF, label: "ORIF (Open reduction and internal fixation)" },
  { id: concepts.EXTERNAL_FIXATION, label: "External fixation" },
  { id: concepts.THYROIDECTOMY, label: "Thyroidectomy" },
  { id: concepts.SKIN_GRAFT, label: "Skin graft" },
  { id: concepts.OTHER_SURGICAL_PROCEDURE, label: "Other procedure specify" },
];
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

export const SurgeriesForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { params } = useParameters();
  const [formValues, setFormValues] = useState<any>({});
  const { data: patientHistory, isLoading: historyLoading } =
    getPatientsEncounters(params?.id as string);
  const [observations, setObservations] = useState<ProcessedObservation[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [showOther, setShowOther] = useState<boolean[]>([]);
  const surgicalEncounters = patientHistory?.filter(
    (item) => item.encounter_type?.name === "SURGICAL HISTORY"
  );
  const handleSubmit = async () => {
    if(formValues.none){
      onSkip();
      return;
    }
    onSubmit(formValues);
  };

  useEffect(() => {
    if (!formValues.surgeries) return;

    const updatedShowOther = formValues.surgeries.map(
      (surgery: any) => surgery.procedure === concepts.OTHER_SURGICAL_PROCEDURE
    );

    setShowOther(updatedShowOther);
  }, [formValues]);

  return (
    <>
      <PastSurgicalHistoryPanel
        showForPrinting={showAll}
        toggleShow={setShowAll}
      />
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
          label="Patient has had no surgeries"
        />
        </div>
            <FieldArray name="surgeries">
              {({ push, remove }) => (
                <>
                  <FormValuesListener getValues={setFormValues} />
                  <DynamicFormList
                    items={values.surgeries}
                    setItems={(newItems) =>
                      setFieldValue("surgeries", newItems)
                    }
                    newItem={surgeryTemplate}
                    renderFields={(item, index) => (
                      <><div>
                        <SearchComboBox
                        disabled={formValues.none}
                          options={surgicalProcedures}
                          name={`surgeries[${index}].procedure`}
                          label="Surgical Procedure"
                          sx={{ width: "100%" }}
                          multiple={false}
                        />
                        <MainTypography color="red" variant="subtitle2">
                          <ErrorMessage
                            name={`surgeries[${index}].procedure`}
                          />
                        </MainTypography>
                        </div>
                        {showOther[index] && (
                          <div>
                            <TextInputField
                            disabled={formValues.none}
                              id={`surgeries[${index}].other`}
                              name={`surgeries[${index}].other`}
                              label="Other procedure"
                              sx={{ width: "100%" }}
                            />

                          <MainTypography color="red" variant="subtitle2">  
                              <ErrorMessage
                                name={`surgeries[${index}].other`}
                              />
                            </MainTypography>
                          </div>
                        )}
                        <div>
                        <FormDatePicker
                        disabled={formValues.none}
                          name={`surgeries[${index}].date`}
                          label="Date of Surgery"
                          sx={{
                            background: "white",
                            width: "150px",
                            margin: "0px",
                          }}
                        />
                        <MainTypography color="red" variant="subtitle2">
                          <ErrorMessage name={`surgeries[${index}].date`} />
                        </MainTypography>
                        </div>
                        <TextInputField
                        disabled={formValues.none}
                          id={`surgeries[${index}].complication`}
                          name={`surgeries[${index}].complication`}
                          label="Complications (optional)"
                          sx={{ width: "100%" }}
                        />
<div>
                        <TextInputField
                        disabled={formValues.none}
                          id={`surgeries[${index}].indication`}
                          name={`surgeries[${index}].indication`}
                          label="Indication"
                          sx={{ width: "100%" }}
                        />
                        <MainTypography color="red" variant="subtitle2">
                          <ErrorMessage
                            name={`surgeries[${index}].indication`}
                          />
                        </MainTypography>
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

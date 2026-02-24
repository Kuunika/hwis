import {
  DatePickerInput,
  FormDatePicker,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
  getInitialValues,
  getObservations,
  mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { getFacilities } from "@/hooks";
import { getAllRegimenNames } from "@/hooks/drugs";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  hivStatus: {
    name: concepts.HIV,
    label: "HIV status",
  },
  arvStatus: {
    name: concepts.ARV,
    label: "on antiretrovirals (ARVs)",
  },
  drugList: {
    name: concepts.DRUG_ADMINISTRATION,
    label: "ARVs given",
  },
  // otherArvMedication: {
  //   name: concepts.OTHER_MEDICATION,
  //   label: "Other Medication",
  // },
  sinceWhen: {
    // name: concepts.DATE,
    name: concepts.DRUG_START_DATE,
    label: "Since When",
  },
  clinic: {
    name: concepts.HEALTH_CENTER,
    label: "Clinic",
  },
  other: {
    name: concepts.OTHER_MEDICATION,
    label: "Other (Past Medical History)",
  },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

const hivOptions = [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.UNKNOWN, label: "unknown" },
];

const radioOptions = [
  { value: concepts.YES, label: "YES" },
  { value: concepts.NO, label: "NO" },
];

export const PastMedicalHistory = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
  const { data } = getFacilities();
  const [formValues, setFormValues] = useState<any>({});
  const { data: regimenNames } = getAllRegimenNames();
  const { ServerTime } = useServerTime();

  const handleSubmit = (values: any) => {
    const formValues = { ...values };
    const obsDatetime = ServerTime.getServerTimeString();

    const drugGivenObs = mapSearchComboOptionsToConcepts(
      formValues[form.drugList.name],
      form.drugList.name,
      obsDatetime
    );

    delete formValues[form.drugList.name];

    const obsFormatted = [
      {
        concept: form.drugList.name,
        value: form.drugList.name,
        groupMembers: drugGivenObs,
        obsDatetime: obsDatetime,
      },
    ];

    const obs = getObservations(formValues, obsDatetime);

    onSubmit([...obs, ...obsFormatted]);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <RadioGroupInput
        name={form.hivStatus.name}
        label={form.hivStatus.label}
        options={hivOptions}
        row
      />
      {formValues[form.hivStatus.name] == concepts.POSITIVE && (
        <>
          <RadioGroupInput
            options={radioOptions}
            name={form.arvStatus.name}
            label={form.arvStatus.label}
            row
          />
          <br />
          {formValues[form.arvStatus.name] == concepts.YES && (
            <>
              <SearchComboBox
                name={form.drugList.name}
                label={form.drugList.label}
                options={
                  regimenNames
                    ? regimenNames.map((name: any) => ({
                      id: name,
                      label: name,
                    }))
                    : []
                }
              />
              <br />
              <FormDatePicker
                name={form.sinceWhen.name}
                label={form.sinceWhen.label}
                width={"100%"}
              />
              <br />
              {/* <TextInputField
                multiline
                rows={4}
                name={form.otherArvMedication.name}
                label={form.otherArvMedication.label}
                id={form.otherArvMedication.name}
                sx={{ width: "100%" }}
              />
              <br /> */}

              <SearchComboBox
                label="Which Clinic"
                name={form.clinic.name}
                multiple={false}
                options={
                  data
                    ? data.map((d: any) => ({
                      id: d.facility_name,
                      label: d.facility_name,
                    }))
                    : []
                }
              />
            </>
          )}
        </>
      )}
      <br />

      <TextInputField
        multiline
        rows={5}
        name={form.other.name}
        label={form.other.label}
        id={form.other.name}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
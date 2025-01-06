import {
  FieldsContainer,
  FormFieldContainerMultiple,
  FormikInit,
  GenericDialog,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  UnitInputField,
} from "@/components";
import DynamicFormList from "@/components/form/dynamicFormList";
import { concepts, NO, YES } from "@/constants";
import { getInitialValues } from "@/helpers";
import useFetchMedications from "@/hooks/useFetchMedications";
import { Box, Typography } from "@mui/material";
import { FieldArray } from "formik";
import { GiMedicines } from "react-icons/gi";
import * as Yup from "yup";

const form = {
  cardiacArrest: {
    name: concepts.CARDIAC_ARREST,
    label: "Witnessed Cardiac Arrest",
  },
  site: {
    name: concepts.SITE,
    label: "SITE",
  },
  specify: {
    name: concepts.OTHER,
    label: "Specify",
  },
};

const initialValues = getInitialValues(form);

const validationSchema = Yup.object().shape({
  [form.cardiacArrest.name]: Yup.string()
    .required()
    .label(form.cardiacArrest.label),
});

const sites = [
  { label: "Rescitation", value: concepts.RESCITATION },
  { label: "SSW", value: concepts.SSW },
  { label: "Priority", value: concepts.PRIORITY },
  { label: "Other", value: concepts.OTHER },
];
const rhythmOptions = [
  { label: "PEA", id: concepts.PEA },
  { label: "VF", id: concepts.VF },
  { label: "VT", id: concepts.VT },
  { label: "Asys", id: concepts.ASYS },
];

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
const emptyRecord = {
  rhythm: "",
  shockEnergy: "",
  medication: "",
  dose: "",
  route: "",
  Interventions: "",
  occurrences: "",
};
const medicationUnits = [
  "Milligrams (mg)",
  "Micrograms (µg)",
  "Grams (g)",
  "International Units (IU)",
  "Milliliters (ml)",
  "Millimoles (mmol)",
];
const interventions = [
  { label: "IV Access", id: concepts.IV_ACCESS },
  { label: "Intubation", id: concepts.INTUBATION },
  { label: "POCUS", id: concepts.POCUS },
  { label: "ABG", id: concepts.ABG },
];

const CPRForm = () => {
  const { medicationOptions } = useFetchMedications();
  return (
    <FormikInit
      onSubmit={() => {}}
      initialValues={{ ...initialValues, records: [emptyRecord] }}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <>
          <FormFieldContainerMultiple>
            <RadioGroupInput
              options={radioOptions}
              label={form.cardiacArrest.label}
              name={form.cardiacArrest.name}
              //   sx={{ width: "1ch", backgroundColor: "red" }}
              row
            />
            <RadioGroupInput
              //   sx={{ backgroundColor: "red" }}
              name={form.site.name}
              label={form.site.label}
              options={sites}
              row
            />
          </FormFieldContainerMultiple>
          {values[form.site.name] == concepts.OTHER && (
            <TextInputField
              size="small"
              name={form.specify.name}
              label={form.specify.label}
              id={form.specify.name}
              sx={{ width: "100%" }}
            />
          )}
          <FieldArray name="records">
            {({}) => (
              <DynamicFormList
                items={values.records}
                setItems={(newItems) => setFieldValue("records", newItems)}
                newItem={emptyRecord}
                itemsProps={{
                  flexDirection: "column",
                  gap: 0,
                  alignItems: "start",
                  borderBottom: "1px solid #ccc",
                  pb: "1ch",
                }}
                renderFields={(item, index) => (
                  <>
                    <br />
                    <Typography color={"#333"} variant="h6">
                      Record {index + 1}
                    </Typography>
                    <br />
                    <FieldsContainer sx={{ width: "100%" }} mr="1ch">
                      <SearchComboBox
                        name={`records.${index}.rhythm`}
                        label="Rhythm"
                        options={rhythmOptions}
                        size="small"
                        sx={{ width: "100%" }}
                      />
                      <TextInputField
                        name={`records.${index}.shockEnergy`}
                        label="Shock Energy"
                        id={`records.${index}.shockEnergy`}
                        sx={{ width: "100%" }}
                      />
                    </FieldsContainer>
                    <br />
                    <FormFieldContainerMultiple>
                      <SearchComboBox
                        name={`records[${index}].medication`}
                        label="Medication Name"
                        options={medicationOptions}
                        getValue={(value) =>
                          setFieldValue(`records[${index}].medication`, value)
                        }
                        multiple={false}
                      />
                      <UnitInputField
                        id={`medications[${index}].medication_dose`}
                        label="Dose"
                        name={`medications[${index}].medication_dose`}
                        unitName={`medications[${index}].medication_dose_unit`}
                        unitOptions={medicationUnits}
                        placeholder="e.g., 500"
                        sx={{ m: 0 }}
                        inputIcon={<GiMedicines />}
                      />
                      <TextInputField
                        name={`records[${index}].route`}
                        label="Route"
                        id={`records[${index}].route`}
                        sx={{ width: "100%" }}
                      />
                    </FormFieldContainerMultiple>
                    <br />
                    <FormFieldContainerMultiple>
                      <Box>
                        <SearchComboBox
                          name={`records[${index}].Interventions`}
                          label="Interventions"
                          options={interventions}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                      <TextInputField
                        name={`records[${index}].occurrences`}
                        label="Occurrences"
                        id={`records[${index}].occurrences`}
                        sx={{ width: "100%" }}
                      />
                    </FormFieldContainerMultiple>
                  </>
                )}
              ></DynamicFormList>
            )}
          </FieldArray>
        </>
      )}
    </FormikInit>
  );
};

export const CPRDialogForm = () => {
  return (
    <GenericDialog maxWidth="md" open={true} title="CPR" onClose={() => {}}>
      <CPRForm />
    </GenericDialog>
  );
};

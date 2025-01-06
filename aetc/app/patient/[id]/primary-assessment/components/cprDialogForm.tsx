import {
  FieldsContainer,
  FormFieldContainerMultiple,
  FormikInit,
  GenericDialog,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import DynamicFormList from "@/components/form/dynamicFormList";
import { concepts, NO, YES } from "@/constants";
import { getInitialValues } from "@/helpers";
import useFetchMedications from "@/hooks/useFetchMedications";
import { FieldArray } from "formik";
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
                }}
                renderFields={(item, index) => (
                  <>
                    <FieldsContainer sx={{ width: "100%" }} mr="1ch">
                      <SearchComboBox
                        name={`records.${index}.rhythm`}
                        label="Rhythm"
                        options={rhythmOptions}
                        sx={{ width: "100%" }}
                      />
                      <TextInputField
                        name={`records.${index}.shockEnergy`}
                        label="Shock Energy"
                        id={`records.${index}.shockEnergy`}
                        sx={{ width: "100%" }}
                      />
                    </FieldsContainer>
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
    <GenericDialog open={true} title="CPR" onClose={() => {}}>
      <CPRForm />
    </GenericDialog>
  );
};

import {
  FieldsContainer,
  FormikInit,
  SearchComboBox,
  TextInputField,
} from "@/components";
import * as yup from "yup";

type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};

const form = {
  nameOfDrug: {
    name: "nameOfDrug",
    label: "Name of Drug",
  },
  strength: {
    name: "strength",
    label: "Strength",
  },
  frequency: {
    name: "frequency",
    label: "Frequency",
  },
  duration: {
    name: "duration",
    label: "Duration",
  },
  route: {
    name: "route",
    label: "Route",
  },
  instructions: {
    name: "instructions",
    label: "Instructions",
  },
};

const schema = yup.object({
  [form.nameOfDrug.name]: yup.string().required().label(form.nameOfDrug.label),
  [form.strength.name]: yup.string().label(form.strength.label),
  [form.frequency.name]: yup.string().label(form.frequency.label),
  [form.duration.name]: yup.string().label(form.duration.label),
  [form.route.name]: yup.string().label(form.route.label),
  [form.instructions.name]: yup.string().label(form.route.label),
});

const drugs = [
  { id: "Aspirin", label: "Aspirin" },
  { id: "Ibuprofen", label: "Ibuprofen" },
  { id: "Lisinopril", label: "Lisinopril" },
  { id: "Metformin", label: "Metformin" },
  { id: "Levothyroxine", label: "Levothyroxine" },
  { id: "Simvastatin", label: "Simvastatin" },
  { id: "Amoxicillin", label: "Amoxicillin" },
  { id: "Omeprazole", label: "Omeprazole" },
  { id: "Atorvastatin", label: "Atorvastatin" },
  { id: "Hydrochlorothiazide", label: "Hydrochlorothiazide" },
  { id: "Metoprolol", label: "Metoprolol" },
  { id: "Prednisone", label: "Prednisone" },
];

export const MedicationForm = ({ initialValues, onSubmit }: props) => {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      <FieldsContainer>
        <SearchComboBox
          name={form.nameOfDrug.name}
          label={form.nameOfDrug.label}
          options={drugs}
          multiple={false}
          sx={{ mr: "1ch" }}
        />
        <TextInputField
          name={form.strength.name}
          label={form.strength.label}
          id={form.strength.name}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.frequency.name}
          label={form.frequency.label}
          id={form.frequency.name}
        />

        <TextInputField
          name={form.duration.name}
          label={form.duration.label}
          id={form.duration.name}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.route.name}
          label={form.route.label}
          id={form.route.name}
        />

        <TextInputField
          name={form.instructions.name}
          label={form.instructions.label}
          id={form.instructions.name}
        />
      </FieldsContainer>
    </FormikInit>
  );
};

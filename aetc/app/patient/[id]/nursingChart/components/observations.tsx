import {
  FieldsContainer,
  FormikInit,
  SearchComboBox,
  FormValuesListener,
  MainButton,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
} from "@/components";
import { IconButton } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { KeyValueContext, KeyValueContextType } from "@/contexts/keyValueContext"; 
import { concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const form = {
  duration: {
    name: concepts.DURATION,
    label: "Duration",
  },
  route_of_administration: {
    name: concepts.ROUTEOFADMIN,
    label: "Route of administration",
  },
};

const medicationFormConfig = {
  formulation: (index: number) => ({
    name: `medications[${index}].formulation`,
    label: "Formulation",
  }),
  frequency: (index: number) => ({
    name: `medications[${index}].frequency`,
    label: "Frequency",
  }),
  route_of_administration: (index: number) => ({
    name: `medications[${index}].route_of_administration`,
    label: "Route of administration",
  }),
  duration: (index: number) => ({
    name: `medications[${index}].duration`,
    label: "Duration",
  }),
  last_prescribed_date: (index: number) => ({
    name: `medications[${index}].last_prescribed_date`,
    label: "Date last prescribed",
  }),
  date_and_time_of_last_med: (index: number) => ({
    name: `medications[${index}].date_and_time_of_last_med`,
    label: "Date and time last taken",
  }),
};

const schema = Yup.object().shape({
  medications: Yup.array().of(
    Yup.object().shape({
      formulation: Yup.string().required("Formulation is required"),
      frequency: Yup.string().required("Frequency is required"),
      route_of_administration: Yup.string().required("Route of administration is required"),
      duration: Yup.string().required("Duration is required"),
      last_prescribed_date: Yup.string().required("Date last prescribed is required"),
      date_and_time_of_last_med: Yup.string().required("Date and time last taken is required"),
    })
  ),
});

export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [medications, setMedications] = useState([
    { formulation: { label: "" }, frequency: { label: "" }, route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" },
  ]);
  const { flow, addKeyToFlow } = useContext(KeyValueContext) as KeyValueContextType;

  const formulationLists = [{ id: "Tablet", label: "tablet" }];

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { formulation: { label: "" }, frequency: { label: "" }, route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" },
    ]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedMedications = medications.map((medication, i) =>
      i === index ? { ...medication, [field]: value } : medication
    );
    setMedications(updatedMedications);
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const handleSubmit = () => {
    formValues["medications"] = medications;
    onSubmit(formValues);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ medications }}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      submitButtonText="Submit"
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />

      <WrapperBox sx={{ padding: "1.5rem", borderRadius: "8px", backgroundColor: "#f7f9fc" }}>
        {medications.map((medication, index) => (
          <FieldsContainer key={index} sx={{ mb: "2ch", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>

            {/* Formulation */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <SearchComboBox
                name={medicationFormConfig.formulation(index).name}
                options={formulationLists}
                label={medicationFormConfig.formulation(index).label}
                sx={{ my: "1ch" }}
                multiple={false}
                disabled={false}
                getValue={(value) => addKeyToFlow({ [medicationFormConfig.formulation(index).name]: value })}
              />
            </FieldsContainer>

            {/* Frequency */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <SearchComboBox
                name={medicationFormConfig.frequency(index).name}
                options={formulationLists}
                label={medicationFormConfig.frequency(index).label}
                sx={{ my: "1ch" }}
                multiple={false}
                disabled={false}
                getValue={(value) => addKeyToFlow({ [medicationFormConfig.frequency(index).name]: value })}
              />
            </FieldsContainer>

            {/* Route of Administration */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <RadioGroupInput
                row={true}
                name={medicationFormConfig.route_of_administration(index).name}
                label={medicationFormConfig.route_of_administration(index).label}
                options={[
                  { label: "", value: "" },
                  { label: "", value: "" },
                  { label: "", value: "" },
                ]}
              />
            </FieldsContainer>

            {/* Duration */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <RadioGroupInput
                row={true}
                name={medicationFormConfig.duration(index).name}
                label={medicationFormConfig.duration(index).label}
                options={[
                  { label: "Single dose", value: "single dose" },
                  { label: "Number of days", value: "number of days" },
                  { label: "Number of months", value: "number of months" },
                ]}
              />
            </FieldsContainer>

            {/* Last Prescribed Date */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <TextInputField
                id={`last_prescribed_date-${index}`}
                name={medicationFormConfig.last_prescribed_date(index).name}
                label={medicationFormConfig.last_prescribed_date(index).label}
                handleBlurEvent={(value) => handleInputChange(index, "last_prescribed_date", value)}
                sx={{ mb: "2ch" }}
              />
            </FieldsContainer>

            {/* Date and Time of Last Medication */}
            <FieldsContainer sx={{ mb: "1.5ch" }}>
              <TextInputField
                id={`date_and_time_of_last_med-${index}`}
                name={medicationFormConfig.date_and_time_of_last_med(index).name}
                label={medicationFormConfig.date_and_time_of_last_med(index).label}
                handleBlurEvent={(value) => handleInputChange(index, "date_and_time_of_last_med", value)}
                sx={{ mb: "2ch", ml: "0.5ch" }}
              />
            </FieldsContainer>

            <IconButton
              disabled={index === 0}
              onClick={() => handleRemoveMedication(index)}
              color="error"
              sx={{ marginBottom: "2ch", marginLeft: "2ch" }}
            >
              <FaMinus />
            </IconButton>

            <IconButton onClick={handleAddMedication} color="primary" sx={{ marginBottom: "2ch" }}>
              <FaPlus />
            </IconButton>
          </FieldsContainer>
        ))}
      </WrapperBox>

      <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" onClick={handleSubmit} />
      <MainButton variant="secondary" title="Skip" type="button" onClick={onSkip} />
    </FormikInit>
  );
};

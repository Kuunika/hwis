import {
  FieldsContainer,
  FormikInit,
  FormValuesListener,
  MainButton,
  TextInputField,
  WrapperBox,
} from "@/components";
import { IconButton } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from "react";
import * as Yup from "yup";

type Prop = {
  onSubmit: (values: any) => void;
};

const medicationFormConfig = {
  drugName: (index: number) => ({
    name: `medications[${index}].drugName`,
    label: "Drug Name",
  }),
  dose: (index: number) => ({
    name: `medications[${index}].dose`,
    label: "Dose",
  }),
  route: (index: number) => ({
    name: `medications[${index}].route`,
    label: "Route",
  }),
  prescriber: (index: number) => ({
    name: `medications[${index}].prescriber`,
    label: "Prescriber",
  }),
};

const schema = Yup.object().shape({
  medications: Yup.array().of(
    Yup.object().shape({
      drugName: Yup.string().required("Drug name is required"),
      dose: Yup.string().required("Dose is required"),
      route: Yup.string().required("Route is required"),
      prescriber: Yup.string().required("Prescriber is required"),
    })
  ),
});

export const MedicationsForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [medications, setMedications] = useState([
    { drugName: "", dose: "", route: "", prescriber: "" },
  ]);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { drugName: "", dose: "", route: "", prescriber: "" },
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const handleSubmit = () => {
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
      <WrapperBox>
        {medications.map((medication, index) => (
          <FieldsContainer key={index}>
            <TextInputField
              id={`drugName-${index}`}
              name={medicationFormConfig.drugName(index).name}
              label={medicationFormConfig.drugName(index).label}
              sx={{ mb: "2ch" }}
            />
            <TextInputField
              id={`dose-${index}`}
              name={medicationFormConfig.dose(index).name}
              label={medicationFormConfig.dose(index).label}
              sx={{ mb: "2ch" }}
            />
            <TextInputField
              id={`route-${index}`}
              name={medicationFormConfig.route(index).name}
              label={medicationFormConfig.route(index).label}
              sx={{ mb: "2ch" }}
            />
            <TextInputField
              id={`prescriber-${index}`}
              name={medicationFormConfig.prescriber(index).name}
              label={medicationFormConfig.prescriber(index).label}
              sx={{ mb: "2ch" }}
            />
            <IconButton
              disabled={index === 0}
              onClick={() => handleRemoveMedication(index)}
              color="error"
            >
              <FaMinus />
            </IconButton>
            <IconButton onClick={handleAddMedication} color="primary">
              <FaPlus />
            </IconButton>
          </FieldsContainer>
        ))}
      </WrapperBox>
      <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
    </FormikInit>
  );
};
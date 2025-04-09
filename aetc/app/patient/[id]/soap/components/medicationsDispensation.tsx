import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormikInit,
  FormValuesListener,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import { IconButton, Paper } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from "react";
import * as Yup from "yup";
import { PrescribedMedication } from "@/app/patient/[id]/nursingChart/components/prescribedMedications";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const medicationFormConfig = {
  drugName: (index: number) => ({
    name: `medications[${index}].drugName`,
    label: "Drug Name",
  }),
  dose: (index: number) => ({
    name: `medications[${index}].dose`,
    label: "Dose Administered",
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

export const MedicationsDispensationForm = ({ onSubmit, onSkip }: Prop) => {
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
      <PrescribedMedication />
      <br />

      <MainButton
        sx={{ m: 0.5 }}
        title={"Submit"}
        type="submit"
        onClick={handleSubmit}
      />
      <MainButton
        variant={"secondary"}
        title="Skip"
        type="button"
        onClick={onSkip}
      />
    </FormikInit>
  );
};

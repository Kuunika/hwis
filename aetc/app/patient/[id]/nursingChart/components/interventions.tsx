import {
  FieldsContainer,
  FormikInit,
  FormValuesListener,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import { getInitialValues } from "@/helpers";
import { IconButton } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { useState } from "react";
import * as Yup from "yup";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

export const InterventionFormConfig = {
  airwayIntervention: {
    name: concepts.AIRWAY_OPENING_INTERVENTIONS,
    label: "Airway intervention(s)",
  },
  breathingIntervention: {
    name: concepts.DEVICE_USED_FOR_INTERVENTION,
    label: "Breathing intervention(s)",
  },
  circulationIntervention: {
    name: concepts.CIRCULATION_INTERVENTIONS,
    label: "Circulation intervention(s)",
  },
};

const schema = Yup.object().shape({
  // Airway Intervention Validation
  [InterventionFormConfig.airwayIntervention.name]: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      label: Yup.string().required(),
    })
  ).label(InterventionFormConfig.airwayIntervention.label),

  // Breathing Intervention Validation
  [InterventionFormConfig.breathingIntervention.name]: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      label: Yup.string().required(),
    })
  ).label(InterventionFormConfig.breathingIntervention.label),

  // Circulation Intervention Validation
  [InterventionFormConfig.circulationIntervention.name]: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      label: Yup.string().required(),
    })
  ).label(InterventionFormConfig.circulationIntervention.label),
});

export const InterventionsForm = ({ onSubmit, onSkip }: Prop) => {
  const initialValues = getInitialValues(InterventionFormConfig);
  const [formValues, setFormValues] = useState<any>({});
  const [airwayOther, setAirwayOther] = useState(false);
  const [circulationIVFluids, setCirculationIVFluids] = useState(false);
  const [fluidEntries, setFluidEntries] = useState([
    { intakeFluidType: "", intakeFluidAmount: "", outputFluidType: "", outputFluidAmount: "", balance: 0 },
  ]);

  const handleSubmit = () => {
    console.log(formValues);
    onSubmit(formValues);
  };

  const airwayList = [
    { id: concepts.POSITIONING, label: "Positioning" },
    { id: concepts.C_SPINE_STABILIZATION, label: "C-Spine Stabilization" },
    { id: concepts.SUCTIONING, label: "Suctioning" },
    { id: concepts.FOREIGN_BODY_REMOVAL, label: "Foreign body removal" },
    { id: concepts.INSERTION_OF_GUEDEL, label: 'Insertion of airway "Guedel"' },
    { id: concepts.OTHER_AIRWAY_INTERVENTION, label: "Other" },
  ];

  const breathingList = [
    { id: "Oxygen therapy", label: "Oxygen therapy" },
    { id: "Bag and mask", label: "Bag and mask" },
    { id: "Intercostal drainage", label: "Intercostal drainage" },
  ];

  const circulationList = [
    { id: "Intake fluids", label: "Intake fluids" },
    { id: "Hemorrhage control", label: "Hemorrhage control" },
    { id: "Blood sample", label: "Blood sample" },
    { id: "Catheter", label: "Catheter" },
    { id: "Transfusion", label: "Transfusion" },
    { id: "NG Insertion", label: "NG Insertion" },
    { id: "Suturing", label: "Suturing" },
    { id: "Keep warm", label: "Keep warm" },
  ];

  const groupedOptions = [
    {
      label: 'IV Fluids',
      options: [
        { id: "Lingers Lactate", label: "Lingers Lactate" },
        { id: "Saline 5%", label: "Saline 5%" },
        { id: "Saline 3%", label: "Saline 3%" },
        { id: "Saline 0.9%", label: "Saline 0.9%" },
        { id: "Saline 0.45%", label: "Saline 0.45%" },
        { id: "Dextrose 10%", label: "Dextrose 10%" },
        { id: "Dextrose 5%", label: "Dextrose 5%" },
        { id: "Haemacel", label: "Haemacel" },
      ],
    },
    {
      label: 'Blood products',
      options: [
        { id: "Whole blood", label: "Whole blood" },
        { id: "Packed Red cells", label: "Packed Red cells" },
        { id: "Platelets", label: "Platelets" },
        { id: "Fresh frozen plasma", label: "Fresh frozen plasma" },
      ],
    },
    {
      label: 'Oral products',
      options: [
        { id: "Water", label: "Water" },
        { id: "Juice", label: "Juice" },
      ],
    },
  ];

  const outputFluidList = [
    { id: "Urine", label: "Urine" },
    { id: "Stool", label: "Stool" },
    { id: "Nasal gastric tube drainage", label: "Nasal gastric tube drainage" },
    { id: "Vomitting", label: "Vomitting" },
    { id: "Insensible loss", label: "Insensible loss" },

  ];


  const handleAddFluidEntry = () => {
    setFluidEntries([...fluidEntries, { intakeFluidType: "", intakeFluidAmount: "", outputFluidType: "", outputFluidAmount: "", balance: 0 }]);
  };

  const handleRemoveFluidEntry = (index: number) => {
    const updatedEntries = fluidEntries.filter((_, i) => i !== index);
    setFluidEntries(updatedEntries);
  };

  const handleFluidChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...fluidEntries];
    updatedEntries[index][field] = value;
    setFluidEntries(updatedEntries);
  };

  return (
    <>
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      submitButtonText="Submit"
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />
      <WrapperBox>
        <SearchComboBox
          name={InterventionFormConfig.airwayIntervention.name}
          options={airwayList}
          label={InterventionFormConfig.airwayIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          disabled={false}
          getValue={(value: any) => {
            const exists = value.some((item: { id: string }) => item.id === airwayList[5].id);
            if (exists) return setAirwayOther(true);
            setAirwayOther(false);
          }}
        />
        {airwayOther && (
          <TextInputField
            id="airwayOtherInput"
            name={InterventionFormConfig.airwayIntervention.name + "_Other"}
            label="Please specify"
            sx={{ mb: "2ch" }}
          />
        )}
        <SearchComboBox
          name={InterventionFormConfig.breathingIntervention.name}
          options={breathingList}
          label={InterventionFormConfig.breathingIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          disabled={false}
        />
        <SearchComboBox
          name={InterventionFormConfig.circulationIntervention.name}
          options={circulationList}
          getValue={(value: any) => {
            const existsIV = value.some((item: { id: string }) => item.id === circulationList[0].label);
            if (existsIV) setCirculationIVFluids(true);
            else setCirculationIVFluids(false);

          }}
          label={InterventionFormConfig.circulationIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          disabled={false}
        />
        {circulationIVFluids && (
          <WrapperBox>
          {fluidEntries.map((entry, index) => (
            <FieldsContainer key={index}>
              <WrapperBox>
                <GroupedSearchComboBox
                  name={`fluidEntries[${index}].intakeFluidType`}
                  label="Intake Fluid Type"
                  options={groupedOptions}
                  multiple={false}
                  getValue={(value) => handleFluidChange(index, "intakeFluidType", value)}
                  sx={{ mb: "2ch" }}
                />
                <TextInputField
                  id={`fluidEntries[${index}].intakeFluidAmount`}
                  name={`fluidEntries[${index}].intakeFluidAmount`}
                  label="Intake Fluid Amount"
                  unitOfMeasure="ml"
                  getValue={(value) => handleFluidChange(index, "intakeFluidAmount", value)}
                  sx={{ mb: "2ch" }}
                />
              </WrapperBox>

              <WrapperBox>
                <GroupedSearchComboBox
                  name={`fluidEntries[${index}].outputFluidType`}
                  label="Output Fluid Type"
                  options={outputFluidList}
                  multiple={false}
                  getValue={(value) => handleFluidChange(index, "outputFluidType", value)}
                  sx={{ mb: "2ch" }}
                />
                <TextInputField
                  id={`fluidEntries[${index}].outputFluidAmount`}
                  name={`fluidEntries[${index}].outputFluidAmount`}
                  label="Output Fluid Amount"
                  unitOfMeasure="ml"
                  getValue={(value) => handleFluidChange(index, "outputFluidAmount", value)}
                  sx={{ mb: "2ch" }}
                />
              </WrapperBox>

              <WrapperBox>
                <TextInputField
                  id={`fluidEntries[${index}].balance`}
                  name={`fluidEntries[${index}].balance`}
                  label="Fluid Balance"
                  unitOfMeasure="ml"
                  getValue={(value) => handleFluidChange(index, "balance", value)}
                  sx={{ ml: "0.3ch", mt:"0.5ch" }}
                />
              </WrapperBox>

              <IconButton
                disabled={index === 0}
                onClick={() => handleRemoveFluidEntry(index)}
                color="error"
              >
                <FaMinus />
              </IconButton>
              <IconButton onClick={handleAddFluidEntry} color="primary">
                <FaPlus />
              </IconButton>
            </FieldsContainer>
          ))}
        </WrapperBox>
        )}
      </WrapperBox>

      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
      </WrapperBox>
    </FormikInit>
    </>
  );
};
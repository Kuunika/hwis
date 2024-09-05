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
import { IconButton, Typography } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { useState } from "react";
import * as Yup from "yup";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";

type Prop = {
  onSubmit: (values: any) => void;
};

export const InterventionFormConfig = {
  airwayIntervention: {
    name: "AIRWAY_INTERVENTION",
    label: "Airway intervention(s)",
  },
  breathingIntervention: {
    name: "BREATHING_INTERVENTION",
    label: "Breathing intervention(s)",
  },
  circulationIntervention: {
    name: "CIRCULATION_INTERVENTION",
    label: "Circulation intervention(s)",
  },
  intakeFluidType: (index: number) => ({
    name: `fluidEntries[${index}].intakeFluidType`,
    label: "Intake Fluid Type",
  }),
  intakeFluidAmount: (index: number) => ({
    name: `fluidEntries[${index}].intakeFluidAmount`,
    label: "Intake Fluid Amount",
  }),
  intakeFluidAmountOther: (index: number) => ({
    name: `fluidEntries[${index}].intakeFluidAmountOther`,
    label: "Specify Intake Fluid Amount",
  }),
  outputFluidType: (index: number) => ({
    name: `fluidEntries[${index}].outputFluidType`,
    label: "Output Fluid Type",
  }),
  outputFluidAmount: (index: number) => ({
    name: `fluidEntries[${index}].outputFluidAmount`,
    label: "Output Fluid Amount",
  }),
  outputFluidAmountOther: (index: number) => ({
    name: `fluidEntries[${index}].outputFluidAmountOther`,
    label: "Specify Output Fluid Amount",
  }),
  balance: (index: number) => ({
    name: `fluidEntries[${index}].balance`,
    label: "Fluid Balance",
  }),
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

  // Fluid Entries Validation
  fluidEntries: Yup.array().of(
    Yup.object().shape({
      [InterventionFormConfig.intakeFluidType(0).name.split('.').pop()]: Yup.string()
        .required(InterventionFormConfig.intakeFluidType(0).label),
      [InterventionFormConfig.intakeFluidAmount(0).name.split('.').pop()]: Yup.string()
        .required(InterventionFormConfig.intakeFluidAmount(0).label),
      [InterventionFormConfig.intakeFluidAmountOther(0).name.split('.').pop()]: Yup.string()
        .nullable(),
      [InterventionFormConfig.outputFluidType(0).name.split('.').pop()]: Yup.string()
        .required(InterventionFormConfig.outputFluidType(0).label),
      [InterventionFormConfig.outputFluidAmount(0).name.split('.').pop()]: Yup.string()
        .required(InterventionFormConfig.outputFluidAmount(0).label),
      [InterventionFormConfig.outputFluidAmountOther(0).name.split('.').pop()]: Yup.string()
        .nullable(),
      [InterventionFormConfig.balance(0).name.split('.').pop()]: Yup.number()
        .required(InterventionFormConfig.balance(0).label),
    })
  ),
});

export const InterventionsForm = ({ onSubmit }: Prop) => {
  const initialValues = getInitialValues(InterventionFormConfig);
  const [formValues, setFormValues] = useState<any>({});
  const [airwayOther, setAirwayOther] = useState(false);
  const [circulationIVFluids, setCirculationIVFluids] = useState(false);
  const [circulationTransfusion, setCirculationTransfusion] = useState(false);
  const [otherAmount, setOtherAmount] = useState(false);
  const [fluidEntries, setFluidEntries] = useState([
    { intakeFluidType: "", intakeFluidAmount: "", outputFluidType: "", outputFluidAmount: "", balance: 0 },
  ]);

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  const airwayList = [
    { id: "Positioning", label: "Positioning" },
    { id: "C-Spine Stablilization", label: "C-Spine Stablilization" },
    { id: "Suctioning", label: "Suctioning" },
    { id: "Foreign body removal", label: "Foreign body removal" },
    { id: 'Insertion of airway "Guedel"', label: 'Insertion of airway "Guedel"' },
    { id: "Other", label: "Other" },
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

  const fluidsList = [
    { id: "Whole blood", label: "Whole blood" },
    { id: "Packed Red cells", label: "Packed Red cells" },
    { id: "Platelets", label: "Platelets" },
    { id: "Fresh frozen plasma", label: "Fresh frozen plasma" },
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

  const volumeList = [
    { id: "1000ml", label: "1000ml" },
    { id: "500ml", label: "500ml" },
    { id: "Other", label: "Other" },
  ];

  const handleAddFluidEntry = () => {
    setFluidEntries([...fluidEntries, { intakeFluidType: "", intakeFluidAmount: "", outputFluidType: "", outputFluidAmount: "", balance: 0 }]);
  };

  const handleRemoveFluidEntry = (index: number) => {
    const updatedEntries = fluidEntries.filter((_, i) => i !== index);
    setFluidEntries(updatedEntries);
  };

  const calculateBalance = (intakeAmount: string, outputAmount: string) => {
    const intake = parseFloat(intakeAmount) || 0;
    const output = parseFloat(outputAmount) || 0;
    return intake - output;
  };

  const handleFluidChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...fluidEntries];
    updatedEntries[index][field] = value;

    const intakeAmount = updatedEntries[index].intakeFluidAmount;
    const outputAmount = updatedEntries[index].outputFluidAmount;
    updatedEntries[index].balance = calculateBalance(intakeAmount, outputAmount);

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
            const exists = value.some((item: { id: string }) => item.id === airwayList[5].label);
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

            const existsTrans = value.some((item: { id: string }) => item.id === circulationList[4].label);
            if (existsTrans) setCirculationTransfusion(true);
            else setCirculationTransfusion(false);
          }}
          label={InterventionFormConfig.circulationIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          disabled={false}
        />
        {circulationIVFluids && (
          <WrapperBox>
            {fluidEntries.map((entry, index) => (
              <><FieldsContainer key={index}>
                <WrapperBox>
                <GroupedSearchComboBox
                    name={`fluidEntries[${index}].intakeFluidType`}
                    label="Intake Fluid Type"
                    options={groupedOptions}
                    multiple={false}
                    sx={{ mb: "2ch" }}
                  />
                  <TextInputField
                      id={`fluidEntries[${index}].intakeFluidAmount`}
                      name={`fluidEntries[${index}].intakeFluidAmount`}
                      label="Intake Fluid Amount"
                      unitOfMeasure="ml" />
                      
                </WrapperBox>
                
                <WrapperBox>
                  <GroupedSearchComboBox
                    name={`fluidEntries[${index}].outputFluidType`}
                    label="Output Fluid Type"
                    options={outputFluidList}
                    multiple={false}
                    sx={{ mb: "2ch" }} />
                    <TextInputField
                      id={`fluidEntries[${index}].outputFluidAmount`}
                      name={`fluidEntries[${index}].outputFluidAmount`}
                      label="Output Fluid amount"
                      unitOfMeasure="ml" />
                </WrapperBox>
                <WrapperBox>
                  
                  <TextInputField
                    id={`Fluid balance[${index}]`}
                    name={`fluidEntries[${index}].balance`}
                    label="Fluid balance"
                    sx={{ mt: "0.3ch", ml: "0.2ch" }}
                    unitOfMeasure="ml" />
                </WrapperBox>
                <IconButton
                disabled={index==0?true:false}
                onClick={() => handleRemoveFluidEntry(index)}
                color="error"
              >
                  <FaMinus/>
                </IconButton><IconButton onClick={handleAddFluidEntry} color="primary">
                  <FaPlus />
                </IconButton>

                
              </FieldsContainer></>
            ))}
          </WrapperBox>
        )}
      </WrapperBox>
     
      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
      </WrapperBox>
    </FormikInit>
    </>
  );
};
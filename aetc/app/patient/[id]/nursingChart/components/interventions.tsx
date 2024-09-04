import { FieldsContainer, FormikInit, FormValuesListener, MainButton, SearchComboBox, TextInputField, WrapperBox } from "@/components";
import { getInitialValues } from "@/helpers";
import { Typography } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";

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
  circulationIntervention : {
    name: "CIRCULATION_INTERVENTION",
    label: "Circulation intervention(s)",
  },}

  const schema = Yup.object().shape({
    [InterventionFormConfig.airwayIntervention.name]: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        label: Yup.string().required(),
      })
    ).label(InterventionFormConfig.airwayIntervention.label),
    
    [InterventionFormConfig.breathingIntervention.name]: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        label: Yup.string().required(),
      })
    ).label(InterventionFormConfig.breathingIntervention.label),
    
    [InterventionFormConfig.circulationIntervention.name]: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        label: Yup.string().required(),
      })
    ).label(InterventionFormConfig.circulationIntervention.label),
  });

export const InterventionsForm = ({ onSubmit }: Prop) => {
    const initialValues = getInitialValues(InterventionFormConfig);
    const [formValues, setFormValues] = useState<any>({});
    const [airwayOther, setAirwayOther] = useState(false);
    const [circulationIVFluids, setCirculationIVFluids] = useState(false);
    const [circulationTransfusion, setCirculationTransfusion] = useState(false);
    const [otherAmount, setOtherAmount] = useState(false);
    const handleSubmit = (values: any) =>{
        onSubmit(values);
    }


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
      { id: "IV fluids", label: "IV fluids" },
      { id: "Hemorrhage control", label: "Hemorrhage control" },
      { id: "Blood sample", label: "Blood sample" },
      { id: "Catheter", label: "Catheter" },
      { id: "Transfusion", label: "Transfusion" },
      { id: "NG Insertion", label: "NG Insertion" },
      { id: "Suturing", label: "Suturing" },
      { id: "Keep warm", label: "Keep warm" },
      
    ];


    const fluidsList = [
      {id: "Lingers Lactate", label: "Lingers Lactate" },
      {id: "Saline 5%,", label: "Saline 5%" },
      {id: "Saline 3%,", label: "Saline 3%" },
      {id: "Saline 0.9%,", label: "Saline 0.9%" },
      {id: "Saline 0.45%,", label: "Saline 0.45%" },
      {id: "Dextrose 10%,", label: "Dextrose 10%" },
      {id: "Dextrose 5%,", label: "Dextrose 5%" },
      {id: "Haemacel", label: "Haemacel" },
    ];

    const volumeList = [
      {id: "1000ml", label: "1000ml" },
      {id: "500ml", label: "500ml" },
      {id: "Other", label: "Other" },
    ];



    return(
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
            getValue={(value: any)=>{const exists = value.some((item: { id: string }) => item.id === airwayList[5].label);
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
            getValue={(value: any)=>{const existsIV = value.some((item: { id: string }) => item.id === circulationList[0].label);
            if (existsIV) setCirculationIVFluids(true);
            else setCirculationIVFluids(false);

            const existsTrans = value.some((item: { id: string }) => item.id === circulationList[4].label)
            if (existsTrans) setCirculationTransfusion(true);
            else setCirculationTransfusion(false);
          }}
            label={InterventionFormConfig.circulationIntervention.label}
            sx={{ mb: "2ch" }}
            multiple={true}
            disabled={false}
          />
          {circulationIVFluids && (
            <><FieldsContainer>
              <SearchComboBox
                name="Intake Fluid type"
                label="Intake Fluid type"
                sx={{ mb: "2ch" }} options={fluidsList} />
                <SearchComboBox
                name="Intake Fluid amount"
                label="Intake Fluid amount"
                getValue={(value: any)=>{const exists = value.some((item: { id: string }) => item.id === volumeList[2].label);
                  if (exists) setOtherAmount(true);
                  else setOtherAmount(false);
                }}
                sx={{ mb: "2ch" }} options={volumeList} />
              
            </FieldsContainer>
            {otherAmount &&            <TextInputField
                id="Specify Intake Fluid amount"
                name="Specify Intake Fluid amount"
                label="Specify Intake Fluid amount"
                sx={{ mb: "2ch" }}
                unitOfMeasure="ml" />}
                <FieldsContainer>
                  <TextInputField
                  id="Output Fluid type"
                  name="Output Fluid type"
                  label="Output Fluid type"
                  sx={{ mb: "2ch" }} />
                <TextInputField
                  id="Output Fluid amount"
                  name="Output Fluid amount"
                  label="Output Fluid amount"
                  sx={{ mb: "2ch" }}
                  unitOfMeasure="ml" />
              </FieldsContainer>
              <TextInputField
                  id="Fluid balance"
                  name="Fluid balance"
                  label="Fluid balance"
                  sx={{ mb: "2ch" }}
                  unitOfMeasure="ml" />
                  </>
        )}{circulationTransfusion &&(<FieldsContainer><TextInputField id={"Transfusion quantity"} name={"Transfusion quantity"} label="Transfusion quantity" unitOfMeasure="pt"/></FieldsContainer>)}
          </WrapperBox>
          <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit}/>
      </WrapperBox>
        </FormikInit>
    )
}
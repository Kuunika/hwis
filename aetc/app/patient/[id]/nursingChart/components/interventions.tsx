import { FormikInit, MainButton, SearchComboBox, TextInputField, WrapperBox } from "@/components"
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import * as Yup from "yup";

type Prop = {
    onSubmit: (values: any) => void;
  };

  export const InterventionFormConfig = {
    airwayIntervention: {
      name: "AIRWAY_INTERVENTION",
      label: "airway intervention",
    },
    breathingIntervention: {
      name: "BREATHING_INTERVENTION",
      label: "breathing intervention",
    },
    circulationIntervention : {
      name: "CIRCULATION_INTERVENTION",
      label: "circulation intervention",
    },}

    const schema = Yup.object().shape({
        [InterventionFormConfig.airwayIntervention.name]: Yup.string().label(InterventionFormConfig.airwayIntervention.label),
        [InterventionFormConfig.breathingIntervention.name]: Yup.string().label(InterventionFormConfig.breathingIntervention.label),
        [InterventionFormConfig.circulationIntervention.name]: Yup.string().label(InterventionFormConfig.circulationIntervention.label),
    });

export const InterventionsForm = ({ onSubmit }: Prop) => {
    const initialValues = getInitialValues(InterventionFormConfig);
    const handleSubmit = (values: any) =>{
        onSubmit(values);
    }


    const breathingList = [
        { id: "Positioning", label: "Positioning" },
        { id: "C-Spine Stablilization", label: "C-Spine Stablilization" },
        { id: "Suctioning", label: "Suctioning" },
        { id: "Foreign body removal", label: "Foreign body removal" },
        { id: 'Insertion of airway "Guedel"', label: 'Insertion of airway "Guedel"' },
        
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
        <SearchComboBox
            name={InterventionFormConfig.breathingIntervention.name}
            options={breathingList}
            label={InterventionFormConfig.breathingIntervention.label}
            sx={{ my: "1ch" }}
            multiple={true}
            disabled={false}
          />
          <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" />
      </WrapperBox>
        </FormikInit>
    )
}
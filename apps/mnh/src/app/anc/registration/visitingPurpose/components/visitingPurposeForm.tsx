import { useState } from "react";
import { FormikInit, MainButton, MainTypography, SearchComboBox, defaultTheme } from "shared-ui/src";
import * as yup from "yup"

type props = {
  initialValues : any;
  onSubmit : (values: any) => void;
}

const form = {
  dangerSigns : {
    name: "dangerSigns",
    label: "Any of the danger signs present?"
  }
}

const schema = yup.object({
  [form.dangerSigns.name]: yup.string().required().label(form.dangerSigns.label)
})

const dangers = [{id:"1", label:"Severe headache"},
{id:"1", label:"Draining liqour"},
{id:"1", label:"Vaginal bleeding"},{id:"1", label:"Severe abdominal pain"},
{id:"1", label:"Blurred vision"},{id:"1", label:"Dizziness"},
{id:"1", label:"Oedema"},{id:"1", label:"History of convulsions"},
{id:"1", label:"Unconscious"},
{id:"1", label:"Swollen legs"},{id:"1", label:"Severe vomiting"},]

export function VisitingPurposeForm ({onSubmit,initialValues}:props) {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const handleComboBoxChange = (selectedOptions: string[]) => {
    setIsOptionSelected(selectedOptions.length > 0);
  };
    return(
        <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButtonText={"Proceed"}
        submitButton={!isOptionSelected}>
        <br/>
        <SearchComboBox 
         name={form.dangerSigns.name}
         options={dangers}
         multiple={true}
         label={form.dangerSigns.label}
         getValue={(selectedOption: string) => {
          handleComboBoxChange([selectedOption]);
        }}/>
         <br/>
         <br/>
         <br/>
         {isOptionSelected && (<MainTypography variant="h6" component="h6" color={defaultTheme.formInputLabel}>Refer client to ...</MainTypography>)}
         <br/>
         <br/>
         {isOptionSelected ? ( 
         <MainButton  sx={{ mt: 2 }}
            type={"button"}
            title={"Refer Client"}
            onClick={() => {}}/>) : null}
        </FormikInit>
    )
}

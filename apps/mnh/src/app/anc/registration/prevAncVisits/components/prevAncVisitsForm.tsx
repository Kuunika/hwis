import { FieldsContainer, FormikInit, MainTypography, RadioGroupInput, SelectInputField, defaultTheme } from "shared-ui/src";
import * as yup from "yup"


type props = {
    initialValues : any;
    onSubmit : (values : any) => void;
}

const form = {
    visitsCheckbox : {
        name: "visits",
        label: "Has the woman had any previous ANC visits before?"
    },
    numberOfVisits : {
        id:"1",
        name:"numberOfVisits",
        label:"Number of visits"
    }
}
const visits_number = [{name:1, value:1},{name:2, value:2},{name:3, value:3},{name:4, value:4},{name:5, value:5}];
const visitsOptions = [{label:"Yes", value:"visited"}, {label:"No", value:"hasn't visited"}];

const schema = yup.object({
    [form.visitsCheckbox.name]: yup.string().required().label(form.visitsCheckbox.label),
    [form.numberOfVisits.name]: yup.string().required().label(form.numberOfVisits.label),
});

export function PreviousAncVisitsForm({initialValues, onSubmit} : props) {
    return(
        <FormikInit onSubmit={onSubmit} 
        validationSchema={schema} 
        initialValues={initialValues}>
            <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
            <RadioGroupInput
             name={form.visitsCheckbox.name}
             label={form.visitsCheckbox.label}
             options={visitsOptions}
             getValue={()=>{}}/>
            <SelectInputField id={form.numberOfVisits.id} width="75%" name={form.numberOfVisits.name} label={form.numberOfVisits.label} selectItems={visits_number}/>
            </FieldsContainer>
            <br/>
            <MainTypography variant="subtitle1" component="h2" color={defaultTheme.formInputLabel}>Select date for first ANC Visit:</MainTypography>
        </FormikInit>
    )
}
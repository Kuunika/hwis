import { FieldsContainer, FormikInit, RadioGroupInput, SelectInputField} from "shared-ui/src";
import * as yup from "yup";


type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};


const form = {
  gravidaField: {
    id:"1",
    name: "gravida",
    label: "Gravida no.",
  },
  paraField: {
    id:"2",
    name: "para",
    label: "Para",
  },
  abortionsField: {
    id:"3",
    name: "abortions",
    label: "Abortions",
  },
  stillBirthsCheckbox: {
    name: "stillBirths",
    label: " Still Births?",
  },
  cSectionsCheckbox: {
    name: "cSections",
    label: " C-Sections?",
  },
  vacuumExtractionCheckbox: {
    name: "vacuumExtraction",
    label: " Vacuum Extraction?",
  },
  symphysiotomyCheckbox: {
    name: "symphysiotomy",
    label: " Symphysiotomy?",
  },
  haemorrhageField: {
    id:"4",
    name: "haemorrhage",
    label: "Haemorrhage?",
  },
  eclampsiaCheckbox: {
    name: "eclampsia",
    label: "Eclampsia?",
  }
};

const gravidaItems = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const paraItems = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const abortionsItems = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const haemorrhageItems = [{name: "None" , value:1}, {name: "APD" , value:2},{name: "DPD", value:3},]

const cSectionOptions = [{label:"Yes", value:"1"}, {label:"No", value:"0"}]
const stillBirthOptions = [{label:"Yes", value:"1"}, {label:"No", value:"0"}]
const vacuumExtractionOptions = [{label:"Yes", value:"1"}, {label:"No", value:"0"}]
const symphysiotomyOptions = [{label:"Yes", value:"1"}, {label:"No", value:"0"}]
const eclampsiaOptions = [{label:"Yes", value:"1"}, {label:"No", value:"0"}]


const schema = yup.object({
    [form.stillBirthsCheckbox.name]: yup.string().required().label(form.stillBirthsCheckbox.label),
    [form.cSectionsCheckbox.name]: yup.string().required().label(form.cSectionsCheckbox.label),
    [form.symphysiotomyCheckbox.name]: yup.string().required().label(form.symphysiotomyCheckbox.label),
    [form.eclampsiaCheckbox.name]: yup.string().required().label(form.eclampsiaCheckbox.label),
    [form.vacuumExtractionCheckbox.name]: yup.string().required().label(form.vacuumExtractionCheckbox.label),
    [form.gravidaField.name]: yup.string().label(form.gravidaField.label),
    [form.paraField.name]: yup.string().label(form.paraField.label),
    [form.abortionsField.name]: yup.string().label(form.abortionsField.label),
    [form.haemorrhageField.name]: yup.string().label(form.haemorrhageField.label),
});

export function ObstreticHistoryForm ({initialValues,onSubmit}:props){
    return(
        <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
     <br/>
      <FieldsContainer>
      <SelectInputField id={form.gravidaField.id} name={form.gravidaField.name} label={form.gravidaField.label} selectItems={gravidaItems}/>
      <SelectInputField id={form.paraField.id} name={form.paraField.name} label={form.paraField.label} selectItems={paraItems}/>
      </FieldsContainer>
      <br/>
      <br/> 
      <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
      <SelectInputField id={form.abortionsField.id} name={form.abortionsField.name} label={form.abortionsField.label} selectItems={abortionsItems}/>
      <SelectInputField id={form.haemorrhageField.id} name={form.haemorrhageField.name} label={form.haemorrhageField.label} selectItems={haemorrhageItems}/>
      
      </FieldsContainer>
      <br/>
      <br/> 
      <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
      <RadioGroupInput label={form.stillBirthsCheckbox.label} name={form.stillBirthsCheckbox.name} options={stillBirthOptions} row={true}/>
      <RadioGroupInput sx={{alignItems:"center"}} label={form.cSectionsCheckbox.label} name={form.cSectionsCheckbox.name} options={cSectionOptions} row={true}/>
      </FieldsContainer>
      <br/>
      <br/>
      <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
      <RadioGroupInput  label={form.vacuumExtractionCheckbox.label} name={form.vacuumExtractionCheckbox.name} options={vacuumExtractionOptions} row={true}/>
      <RadioGroupInput  sx={{alignItems:"center"}} label={form.symphysiotomyCheckbox.label} name={form.symphysiotomyCheckbox.name} options={symphysiotomyOptions} row={true}/>  
      </FieldsContainer>
      <br/> 
      <br/> 
      <FieldsContainer>
      <RadioGroupInput label={form.eclampsiaCheckbox.label} name={form.eclampsiaCheckbox.name} options={eclampsiaOptions} row={true}/>      </FieldsContainer>
      <br/>
      <br/>
        </FormikInit>

        
    )
}
import { FieldsContainer, FormikInit, RadioGroupInput, SelectInputField} from "shared-ui/src";

const gravida = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const para = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const abortions = [{name: 1 , value:1}, {name: 2 , value:2},{name: 3 , value:3},]
const stillBirths = [{label:"Yes", value:"1"}, {label:"No", value:"1"}]
const haemorrhage = [{name: "None" , value:1}, {name: "APD" , value:2},{name: "DPD", value:3},]

export function ObstreticHistoryForm (){
    return(
        <FormikInit
        validationSchema={""}
        initialValues={{}}
        onSubmit={()=>{}}
      >
     <br/>
      <FieldsContainer>
      <SelectInputField id={"1"} name={"Gravida"} label={"Gravida no."} selectItems={gravida}/>
      <SelectInputField id={"1"} name={"Para"} label={"Para"} selectItems={para}/>
      <SelectInputField id={"1"} name={"Abortions"} label={"Abortions"} selectItems={abortions}/>
      </FieldsContainer>
      <br/>
      <br/> 
      <br/>
      <br/> 
      <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
      <RadioGroupInput fullWidth={false} sx={{marginLeft:"10", alignContent:"flex-end"}} label={"Still births"} name={""} options={stillBirths} row={true}/>
      <RadioGroupInput fullWidth={false} label={"C-sections"} name={""} options={[{label:"Yes", value:"1"}, {label:"No", value:"1"}]} row={true}/>
      <RadioGroupInput fullWidth={false} label={"Vacuum Extractions"} name={""} options={[{label:"Yes", value:"1"}, {label:"No", value:"1"}]} row={true}/>
      </FieldsContainer>
      <br/>
      <br/>
      <br/>
      <br/> 
      <FieldsContainer sx={{justifyContent:"space-between", alignItems:"center"}}>
        <RadioGroupInput fullWidth={false} label={"Symphysiotomy"} name={""} options={[{label:"Yes", value:"1"}, {label:"No", value:"1"}]} row={true}/>  
        <SelectInputField id={"1"} width="32%" name={"Haemorrhage"} label={"Haemorrhage"} selectItems={haemorrhage}/>
        <RadioGroupInput fullWidth={false} label={"Eclampsia"} name={""} options={[{label:"Yes", value:"1"}, {label:"No", value:"1"}]} row={true}/>
      </FieldsContainer>
      <br/>
      <br/> 
        </FormikInit>

        
    )
}
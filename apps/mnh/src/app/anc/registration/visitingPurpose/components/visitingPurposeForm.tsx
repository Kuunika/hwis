import { FormikInit, SearchComboBox } from "shared-ui/src";

const dangers = [{id:"1", label:"Severe headache"},
{id:"1", label:"Draining liqour"},
{id:"1", label:"Vaginal bleeding"},{id:"1", label:"Severe abdominal pain"},
{id:"1", label:"Blurred vision"},{id:"1", label:"Dizziness"},
{id:"1", label:"Oedema"},{id:"1", label:"History of convulsions"},
{id:"1", label:"Unconscious"},
{id:"1", label:"Swollen legs"},{id:"1", label:"Severe vomiting"},]

export function VisitingPurposeForm () {
    return(
        <FormikInit
        validationSchema={""}
        initialValues={{}}
        onSubmit={()=>{}}>
        <br/>
        <SearchComboBox name={""}
         options={dangers}
         multiple={true}
         label={"Any of the danger signs present?"}/>
         <br/>
         <br/>

        </FormikInit>
    )
}

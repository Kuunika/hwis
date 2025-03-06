import { concepts } from "@/constants";
import { getDateTime } from "./dateTime";

export const getInitialValues = (values: any) => {
  const keys = Object.keys(values);

  return keys.reduce((initialValues: any, currentValue) => {
    const name = values[currentValue].name;
    initialValues[name] = "";
    return initialValues;
  }, {});
};
export const getObservations = (values: any, dateTime: any) => {
  const keys = Object.keys(values);
  return keys.map((key) => ({
    concept: key,
    value: values[key],
    obsDatetime: dateTime,
  }));
};


export const getFormLabels = (formConceptLabels:any, selectOptionsFormLabels:Array<{label:string,id:string}>, radioOptionFormLabels:Array<{label:string,value:string}> )=>{
 let form=Object.keys(formConceptLabels).map((key:string)=>{
  return {
    concept:formConceptLabels[key].name,
    label: formConceptLabels[key].label,
  }
 })


 const selects= selectOptionsFormLabels.map(op=>{
    return {
      concept: op.id,
      label: op.label
    }
})

  const radios =radioOptionFormLabels.map(op=>{
    return {
      concept: op.value,
      label: op.label
    }
})

return [...form, ...radios, ...selects]
}

export const flattenImagesObs = (formImageEncounters: Array<{formData: {obs:any}, label:string}>)=>{

 return formImageEncounters.map(enc=>{
    return  {
      concept: concepts.IMAGE_PART_NAME,
      value:  enc.label,
      obsDateTime: getDateTime(),
      groupMembers: enc.formData.obs
    }
  });

// console.log({obs});


// return formImageEncounters.flatMap((enc)=>{
//   return enc.formData.obs
// })

}

export const mapSearchComboOptionsToConcepts = (options: Array<any>, concept:string, obsDatetime:any, coded:boolean=false)=>{
return Array.isArray(options)
? options.map((opt: any) => ({
    concept,
    value: opt.id,
    obsDatetime,
    coded
  }))
: [];
}

type FormType = {
  [key: string]: { name: string; label: string; coded?: boolean };
};

type SubmissionType = { [key: string]: any };

export const mapSubmissionToCodedArray = (
  formDefinition: FormType,
  submission: SubmissionType
) => {
  return Object.entries(submission)
    .map(([key, value]) => {
      // Find the matching form key where `name` matches the submitted key
      const matchedKey = Object.keys(formDefinition).find(
        (formKey) => formDefinition[formKey].name === key
      );

      if (!matchedKey) return null; // Skip unmatched keys

      const conceptName = formDefinition[matchedKey].name;
      const coded = formDefinition[matchedKey].coded;

      // If value is an array of objects with `{ id: string }`, map each separately
      if (Array.isArray(value) && value.every((v) => v && v.id !== undefined)) {
        return value.map((v) => ({
          key: conceptName,
          value: v.id,
          coded,
        }));
      }

      // Return as a single object if not an array
      return {
        concept: conceptName,
        value,
        coded,
        obsDatetime: getDateTime(),
      };
    })
    .flat() // Flatten in case of nested arrays
    .filter(Boolean); 

 
};
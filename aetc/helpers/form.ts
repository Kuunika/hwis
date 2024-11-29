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

export const flattenImagesObs = (formImageEncounters: Array<{formData: {obs:any}}>)=>{

return formImageEncounters.flatMap((enc)=>{
  return enc.formData.obs
})

}
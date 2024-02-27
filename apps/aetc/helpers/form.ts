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

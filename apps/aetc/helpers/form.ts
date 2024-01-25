export const getInitialValues = (values: any) => {
  const keys = Object.keys(values);
  console.log({ keys });
  return keys.reduce((initialValues: any, currentValue) => {
    const name = values[currentValue].name;
    initialValues[name] = "";
    return initialValues;
  }, {});
};

import { Field } from "./formBuilder/builder";
import {
  SelectInputField,
  TextInputField,
  RadioGroupInput,
  SearchComboBox,

} from ".";

type Prop = {
  field: Field;
};

export const FormInput = ({ field }: Prop) => {
  const label = field.label;
  const name = field.name;
  const placeHolder = field.placeHolder;
  const type = field.formInputType;
  const options = field.options;

  if (type == "text") {
    return (
      <TextInputField
        label={label}
        id={name}
        placeholder={placeHolder}
        name={name}
      />
    );
  }

  if (type == "radio") {
    return (
      <RadioGroupInput
        label={label}
        name={name}
        options={(options && options) || []}
      />
    );
  }
  if (type == "select") {
    return (
      <SelectInputField
        label={label}
        name={name}
        id={name}
        selectItems={
          (options &&
            options.map((op) => ({ name: op.label, value: op.value }))) ||
          []
        }
      />
    );
  }

  if (type == "search") {
    return (
      <SearchComboBox
        label={label}
        name={name}
        options={
          (options &&
            options.map((op) => ({ id: op.value, label: op.value }))) ||
          []
        }
      />
    );
  }
};

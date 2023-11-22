import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import {
  BasePopover,
  FieldsContainer,
  FormikInit,
  MainButton,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";
import { InformationRow } from "./infoSelectionBox";
import { SxProps } from "@mui/material";
import { Console } from "console";


type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
  children: ReactNode;
  validationSchema: any;
  width?: string;
  submitButton?: boolean;
  title?: string;
  submitStyles?: SxProps;
  submitButtonText?: string;
  sx?: SxProps;
  loading?: boolean;
  submitVariant?: "primary" | "secondary" | "text";
  enableReinitialize?: boolean;
};

const form = {
  referredCheckbox: {
    name: "referredCheckbox",
    label: " Is the patient referred?",
  },
  urgentCheckbox: {
    name: "urgentCheckbox",
    label: " Is the situation urgent?",
  },
  Referred: {
    name: "referred",
    label: "Patient Referred to",
  },
};

const schema = yup.object({
  [form.referredCheckbox.name]: yup.string().required().label(form.referredCheckbox.label),
  [form.urgentCheckbox.name]: yup.string().required().label(form.urgentCheckbox.label),
  [form.Referred.name]: yup.string().label(form.Referred.label),
});

const referrences = [
  { id: "Lab", label: "Lab" },
  { id: "Lab", label: "Lab" },
  { id: "Lab", label: "Lab" },
  { id: "OPD2", label: "OPD2" },
  { id: "OPD2", label: "OPD2" },
  { id: "OPD2", label: "OPD2" },
];



export function PrescreeningForm ({ initialValues, onSubmit,submitVariant= "primary", submitButtonText= "Proceed",loading}: props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [referredCheckboxValue, setReferredCheckboxValue] = useState<string | null>(null);
  const [urgentCheckboxValue, setUrgentCheckboxValue] = useState<string | null>(null);
  const [showSecondButton, setShowSecondButton] = useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);
  const [showSearchComboBox, setShowSearchComboBox] = useState<boolean>(false);

  useEffect(() => {
    setShowSecondButton(!(urgentCheckboxValue === "not urgent" || referredCheckboxValue === null));
  }, [urgentCheckboxValue, referredCheckboxValue]);

  useEffect(() => {
    if (urgentCheckboxValue !== null && referredCheckboxValue !== null) {
      setShowSubmitButton(urgentCheckboxValue === "not urgent");
    }
  }, [urgentCheckboxValue, referredCheckboxValue]);

  useEffect(() => {
    if (urgentCheckboxValue !== null && referredCheckboxValue !== null) {
      setShowSearchComboBox(urgentCheckboxValue === "not urgent");
    }
  }, [urgentCheckboxValue, referredCheckboxValue]);
  
  useEffect(() => {
    setShowSearchComboBox(false);
  }, []);
  
  useEffect(() => {
    setShowSubmitButton(false);
  }, []);


  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{referredCheckbox:"",urgentCheckbox:"",referred:""}}
      onSubmit={onSubmit}
      submitButton= {showSubmitButton}
    >
      <RadioGroupInput
        name={form.referredCheckbox.name}
        label={form.referredCheckbox.label}
        options= {[{ label: "Yes", value: "referred" },
        { label: "No", value: "not referred" },]}
        row={true}
        getValue={(value)=> { console.log(value)
         setReferredCheckboxValue(value);}}
      />
      <br />
      <br />

      <RadioGroupInput
        name={form.urgentCheckbox.name}
        label={form.urgentCheckbox.label}
        options={[{ label: "Yes", value: "urgent" },
        { label: "No", value: "not urgent" },]}
        row={true}
        getValue={(value)=> { console.log(value);
          setUrgentCheckboxValue(value)}}
      />
      <br />
      <br />
      <BasePopover onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <InformationRow />
      </BasePopover>
 
       {showSearchComboBox && (<SearchComboBox
          name={form.Referred.name}
          label={form.Referred.label}
          options={referrences}
          multiple={false}
          sx={{ mr: "1ch" }}
        />)}
        {showSecondButton && (<MainButton
            sx={{ mt: 2 }}
            variant={submitVariant}
            type={"button"}
            title={
              loading ? (
                <i style={{ textTransform: "lowercase" }}>loading...</i>
              ) : (
                submitButtonText
              )
            }
            onClick={() => {}}
          />)}
      <br />
    </FormikInit>
  );
}

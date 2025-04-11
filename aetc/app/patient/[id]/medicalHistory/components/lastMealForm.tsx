import { FormDatePicker, FormFieldContainer, MainButton, MainTypography, TextInputField, WrapperBox } from "@/components";
import { useEffect, useState } from "react";
import { FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { Field, getIn } from "formik";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
  onPrevious: () => void;
};

const lastMealFormConfig = {
    lastMeal: {
      name: "dateOfMeal",
      label: "When did the patient eat last?"
    },
    description: {
      name: "descriptionOfLastMeal",
      label: "What did the patient eat?",
    }
  }
  
  const schema = yup.object().shape({
      [lastMealFormConfig.lastMeal.name] : yup
        .string()
        .when("didNotEat", {
          is: false,
          then: (schema) => schema.required('If they did not eat check "Patient did not eat" below, Otherwise please select a time of last meal.')
        }),
        [lastMealFormConfig.description.name]: yup.string().when("didNotEat", {
            is: false,
            then: (schema) => schema.required("Unless they did not eat a description of the last meal is required.")
          }),  
  });
    const initialValues = {
        [lastMealFormConfig.lastMeal.name]: undefined,
        [lastMealFormConfig.description.name]: "",
        didNotEat: false,
    };

export const LastMealForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});

  const handleSubmit = async () => {
    if(formValues.didNotEat){
      onSkip();
      return;
    }

    onSubmit(formValues);

  };

  return (
    <>

      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButton={false}
      >
        
        <FormValuesListener getValues={setFormValues} />
            <FormFieldContainer direction="column">
            <div style={{ marginRight: "2ch" }}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Field name={lastMealFormConfig.lastMeal.name}>
      {({ form }: { form: any }) => {
        const error = getIn(form.errors, lastMealFormConfig.lastMeal.name);
        return (
          <>
            <DateTimePicker
              disableFuture
              label={lastMealFormConfig.lastMeal.label}
              onChange={(newValue: any) => {
                form.setFieldValue(lastMealFormConfig.lastMeal.name, newValue?.$d.toLocaleString());
              }}
              sx={{
                width: "300px",
                mt: "1.8ch",
                backgroundColor: "white",
                borderRadius: "5px",
                border: error ? "1px solid red" : "1px solid #ccc",
              }}
            />
            { error && (
              <MainTypography color="red" variant="subtitle2" width={"300px"}>
                {error}
              </MainTypography>
            )}
          </>
        );
      }}
    </Field>
  </LocalizationProvider>
</div>
               
                       <TextInputField
                         id={lastMealFormConfig.description.name}
                         label={lastMealFormConfig.description.label}
                         name={lastMealFormConfig.description.name}
                         placeholder="e.g., rice and beans"
                         multiline
                         rows={4}
                         sx={{width:"100%", mt:"2ch"}}
                        disabled={formValues.didNotEat}
                       />
                              
                       </FormFieldContainer>
                       <LabelledCheckbox
          name="didNotEat"
          label="Patient did not eat"
        />
        <WrapperBox sx={{ mt: "2ch" }}>
          <MainButton
            variant="secondary"
            title="Previous"
            type="button"
            onClick={onPrevious}
            sx={{ flex: 1, marginRight: "8px" }}
          />
          <MainButton
            onClick={() => {}}
            variant="primary"
            title="Next"
            type="submit"
            sx={{ flex: 1 }}
          />
        </WrapperBox>
      </FormikInit>
    </>
  );
};

export default LastMealForm;
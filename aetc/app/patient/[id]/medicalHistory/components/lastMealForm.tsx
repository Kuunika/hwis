import { FormDatePicker, FormFieldContainer, MainButton, TextInputField, WrapperBox } from "@/components";
import { useEffect, useState } from "react";
import { FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
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
  
      ["lastMeal"] : yup
        .date()
        .required("Last meal is required.")
        .max(new Date(), "Last meal cannot be in the future.")
  });
    const initialValues = {
      lastMeal: "",
    };

export const LastMealForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});

  const handleSubmit = async () => {

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
<FormFieldContainer direction="row">
               <FormDatePicker
                 label={lastMealFormConfig.lastMeal.label}
                 name={lastMealFormConfig.lastMeal.name}
                 sx={{ background: "white"}}
               />
                       <TextInputField
                         id={lastMealFormConfig.description.name}
                         label={lastMealFormConfig.description.label}
                         name={lastMealFormConfig.description.name}
                         placeholder="e.g., rice and beans"
                         multiline
                         rows={4}

                       />
                       </FormFieldContainer>
        <WrapperBox sx={{ mt: "2ch" }}>
          <MainButton
            variant="secondary"
            title="Previous"
            type="button"
            onClick={onSkip}
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
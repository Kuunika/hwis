import { estimateBirthdate } from "@/helpers/dateTime";
import { useState } from "react";
import { FormDatePicker, FormValuesListener, FormikInit, MainTypography, RadioGroupInput, TextInputField, WrapperBox } from "@/components";
import * as Yup from "yup";
import { TrackFormikContext } from "@/app/registration/components";

const form = {
    identificationNumber: {
        name: "identificationNumber",
        label: "National Identification Number",
    },
    firstName: {
        name: "firstName",
        label: "First Name",
    },
    phoneNumber: {
        name: "phoneNumber",
        label: "Phone Number",
    },
    lastName: {
        name: "lastName",
        label: "Last Name",
    },
    dob: {
        name: "birthDate",
        label: "Date of Birth",
    },
    gender: {
        name: "gender",
        label: "Gender",
    },
    birthDateEstimated: {
        name: "birthdateEstimated",
        label: "Birthdate Estimated",
    }, age: {
        name: "age",
        label: "Estimated Age",
    },
}

const phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = Yup.object().shape({
    [form.identificationNumber.name]: Yup.string().label(
        form.identificationNumber.label
    ),
    [form.firstName.name]: Yup.string().required().label(form.firstName.label),
    [form.phoneNumber.name]: Yup.string()
        .matches(phoneRegex, "phone number not valid")
        .min(10)
        .label(form.phoneNumber.label),
    [form.lastName.name]: Yup.string().required().label(form.lastName.label),
    [form.dob.name]: Yup.date()
        .when(form.birthDateEstimated.name, {
            is: (value: any) => value == 'true',
            then: () => Yup.date().required(),
        })
        .test('valid-age', 'Age must be at least 14 years and not in the future', function (value) {
            if (!value) return true;
            const selectedDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }
            return age >= 14 && age >= 0;
        }),
    [form.gender.name]: Yup.string().required().label(form.gender.label),
})


type Prop = {
    initialValues: any;
    onSubmit: (values: any) => void;
    onFormValueChange?:(values:any)=>void;
    submitButton?: boolean;
    setContext?: (context: any) => void;
}


export const EditDemographicsForm = ({ initialValues, onSubmit, onFormValueChange=()=>{}, submitButton=true, setContext=(values)=>{} }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});

    return <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButtonText="update"
        getFormValues={onFormValueChange}
        enableReinitialize={true}
        submitButton={submitButton}
    >
          <TrackFormikContext
          setFormContext={setContext}
        />
        <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <FormValuesListener getValues={setFormValues} />
            <TextInputField
                name={form.identificationNumber.name}
                id={form.identificationNumber.name}
                label={form.identificationNumber.label}
            />
            <TextInputField
                name={form.firstName.name}
                id={form.firstName.name}
                label={form.firstName.label}
            />
            <TextInputField
                name={form.lastName.name}
                id={form.lastName.name}
                label={form.lastName.label}
            />
            <RadioGroupInput
                name={form.gender.name}
                label={form.gender.label}
                options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                ]}
            />
            <RadioGroupInput
                name={form.birthDateEstimated.name}
                label={form.birthDateEstimated.label}
                options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                ]}
            />
            <TextInputField
                sx={{
                    display: formValues[form.birthDateEstimated.name] == 'true' ? 'flex' : 'none'
                }}
                name={form.age.name}
                id={form.age.name}
                label={form.age.label}
            />

            {formValues[form.age.name] > 0 && formValues[form.birthDateEstimated.name] == 'true' && <>
                <br />
                <MainTypography variant="body1">
                    Estimated birth date  <b>{estimateBirthdate(formValues[form.age.name])?.readable}</b>
                </MainTypography>
                <br />

            </>}
            <FormDatePicker
                sx={{
                    display: (formValues[form.birthDateEstimated.name] == false || formValues[form.birthDateEstimated.name] == 'false') ? 'flex' : 'none',
                    width: "100%",

                }}
                width={"100%"}
                label={form.dob.label}
                name={form.dob.name}
            />
            <TextInputField
                name={form.phoneNumber.name}
                id={form.phoneNumber.name}
                label={form.phoneNumber.label}
            />
        </WrapperBox>
    </FormikInit>
}
import {
    FieldsContainer,
    FormikInit,
    MainButton,
    SearchComboBox,
    TextInputField,
    WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";

type props = {
    initialValues: any;
    onSubmit: (values: any, options: any) => void;
};

const form = {
    userName: {
        name: "userName",
        label: "Username",
    },
    firstName: {
        name: "firstName",
        label: "First Name",
    },
    lastName: {
        name: "lastName",
        label: "Last Name",
    },
    password: {
        name: "password",
        label: "Password",
    },
    passwordConfirmation: {
        name: "passwordConfirmation",
        label: "Password Confirmation",
    },
};

const schema = yup.object({
    [form.userName.name]: yup.string().required().label(form.userName.label),
    [form.firstName.name]: yup.string().required().label(form.firstName.label),
    [form.lastName.name]: yup.string().required().label(form.lastName.label),
    [form.password.name]: yup.string().required().label(form.password.label),
    [form.passwordConfirmation.name]: yup.string().oneOf([yup.ref(form.password.name), null], 'Passwords must match').label(form.passwordConfirmation.label),
});

export const UserForm = ({ initialValues, onSubmit }: props) => {
    return (
        <FormikInit
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={onSubmit}
            submitButton={false}
        >
            <TextInputField
                name={form.userName.name}
                label={form.userName.label}
                id={form.userName.name}
                sx={{ width: "100%" }}
            />
            <WrapperBox sx={{ display: "flex" }}>
                <TextInputField
                    name={form.password.name}
                    label={form.password.label}
                    id={form.password.name}
                    type="password"
                    sx={{ width: "100%", mr: "1ch" }}
                />
                <TextInputField
                    name={form.passwordConfirmation.name}
                    label={form.passwordConfirmation.label}
                    id={form.passwordConfirmation.name}
                    type="password"
                    sx={{ width: "100%", }}

                />
            </WrapperBox>

            <WrapperBox sx={{ display: "flex" }}>
                <TextInputField
                    name={form.firstName.name}
                    label={form.firstName.label}
                    id={form.firstName.name}
                    sx={{ width: "100%", mr: "1ch" }}
                />
                <TextInputField
                    name={form.lastName.name}
                    label={form.lastName.label}
                    id={form.lastName.name}
                    sx={{ width: "100%" }}
                />
            </WrapperBox>
            <MainButton type="submit" title={"Submit"} onClick={() => { }} />
        </FormikInit>
    );
};

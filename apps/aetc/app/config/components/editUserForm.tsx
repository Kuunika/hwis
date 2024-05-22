import { getRoles } from "@/hooks/role";
import { FormikInit, MainButton, SearchComboBox, TextInputField, WrapperBox } from "shared-ui/src";
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
    password: {
        name: "password",
        label: "Password",
    },
    passwordConfirmation: {
        name: "passwordConfirmation",
        label: "Password Confirmation",
    },
    role: {
        name: "role",
        label: "Roles"
    }
};

const schema = yup.object({
    [form.userName.name]: yup.string(),
    [form.password.name]: yup.string(),
    [form.role.name]: yup.array().required().label(form.role.label),
    [form.passwordConfirmation.name]: yup.string().oneOf([yup.ref(form.password.name)], 'Passwords must match')
});

export const EditUserForm = ({ initialValues, onSubmit }: props) => {
    const { isLoading, data } = getRoles();

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
                sx={{ width: "100%"}}
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
            <SearchComboBox
                label="Roles"
                name={form.role.name}
                options={data ? data.map(d => {
                    return { id: d.role, label: d.role }
                }) : []} 
                />

            <MainButton type="submit" title={"Submit"} onClick={() => { }} />
        </FormikInit>
    );
};

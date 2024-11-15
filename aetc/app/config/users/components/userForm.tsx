import { getRoles } from "@/hooks/role";
import { checkUsername } from "@/hooks/users";
import { useEffect, useState } from "react";
import {
    FormikInit,
    MainButton,
    MainTypography,
    SearchComboBox,
    TextInputField,
    WrapperBox,
} from "@/components";
import * as yup from "yup";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Typography } from "@mui/material";

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
    role: {
        name: "role",
        label: "Roles"
    }
};

const schema = yup.object({
    [form.userName.name]: yup.string().required().label(form.userName.label),
    [form.firstName.name]: yup.string().required().label(form.firstName.label),
    [form.lastName.name]: yup.string().required().label(form.lastName.label),
    [form.password.name]: yup.string().required().label(form.password.label),
    [form.role.name]: yup.array().required().label(form.role.label),
    [form.passwordConfirmation.name]: yup.string().required().oneOf([yup.ref(form.password.name)], 'Passwords must match').label(form.passwordConfirmation.label),
});

export const UserForm = ({ initialValues, onSubmit }: props) => {
    const { isLoading, data } = getRoles();
    const [username, setUsername] = useState("")
    const { refetch, data: usernameResponse, isFetching } = checkUsername(username);

    useEffect(() => {
        if (Boolean(username)) {
            refetch()
        }
    }, [username])


    const usernameResponseMessage = usernameResponse?.length == 0 ? 'username is available' : 'username already taken'
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
                getValue={value => setUsername(value)}
            />
            {isFetching && <CircularIndeterminate />}
           {username?.length>0 && !isFetching && <Typography fontWeight={600}  variant="body1" my={"1ch"}>{usernameResponseMessage}</Typography>}
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

            <SearchComboBox
                label="Roles"
                name={form.role.name}
                options={data ? data.map(d => {
                    return { id: d.role, label: d.role }
                }) : []} 
                />

            <Button variant="contained" disabled={usernameResponse && usernameResponse?.length > 0 } type="submit">Submit</Button>
        </FormikInit>
    );
};


function CircularIndeterminate() {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }
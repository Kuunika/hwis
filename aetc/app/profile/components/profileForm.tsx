"use client";
import { useState } from "react";
import { metadata } from "@/app/layout";
import {
  FormikInit,
  MainButton,
  TextInputField,
  WrapperBox,
} from "@/components";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { Password } from "@mui/icons-material";
import { changePassword } from "@/hooks/users";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { OverlayLoader } from "@/components/backdrop";
import { TextInputDisplay } from "@/components/form/textInputDisplay";

const schema = yup.object({
  firstName: yup
    .string()
    .label("first name")
    .required("first name is required")
    .min(3),
  lastName: yup
    .string()
    .label("last name")
    .required("last name is required")
    .min(3),
  userName: yup.string().label("user name").required().min(4),
  userRole: yup.string().label("user role").required().min(4),
});

const Profile = () => {

  const [successMessage, setSuccessMessage] = useState("");

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("roles");

  return (
    <ContainerLoaderOverlay loading={false}>
      <WrapperBox
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1ch",
          marginTop: "100px",
          position: "relative", //added
        }}
      >

        <FormikInit
          initialValues={{
            firstName: "",
            lastName: "",
            userName: userName,
            userRole: userRole,
          }}
          validationSchema={schema}
          submitButton={false}
          onSubmit={async (data: any, { setFieldError }) => {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
              const decodeToken: {
                userName: any;
                user_id: string;
              } = jwtDecode(accessToken);

              console.log(decodeToken);
            }

            console.log("access token", accessToken);
            console.log("username", userName);
            console.log("user role", userRole);
          }}
        >
          <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <h1>profile</h1>

            <TextInputField
              id="firstName"
              name="firstName"
              label="first name"
              type="text"
            />
            <TextInputField
              id="lastName"
              name="lastName"
              label="last name"
              type="text"
            />
            <TextInputField
              id="userName"
              name="userName"
              label="user name"
              type="text"
            />
            <TextInputField
              id="userRole"
              name="userRole"
              label="user role"
              type="text"
            />
          </WrapperBox>
        </FormikInit>
      </WrapperBox>
    </ContainerLoaderOverlay>
  );
};

export default Profile;

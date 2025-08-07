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

const schema = yup.object({
  currentPassword: yup.string().label("Current password").required().min(4),
  newPassword: yup.string().label("New password").required().min(4), //.matches(/[!@#$%&*?~]/, "must include atleast one special character")
  confirmPassword: yup
    .string()
    .label("Confirm password")
    .required()
    .min(4)
    .oneOf([yup.ref("newPassword")], "Password not matching "),
});

const ChangePassword = () => {
  const { mutateAsync, isPending, isSuccess, error } = changePassword();

  const [successMessage, setSuccessMessage] = useState("");

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
        <OverlayLoader open={isPending} />

        {successMessage && (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            {successMessage}
          </div>
        )}

        <FormikInit
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={schema}
          submitButton={false}
          onSubmit={async (data: any, { setFieldError }) => {
            const accessToken = localStorage.getItem("accessToken");
            const userName = localStorage.getItem("userName");
            const userRole = localStorage.getItem("roles");

            if (accessToken) {
              const decodeToken: {
                userName: any;
                user_id: string;
              } = jwtDecode(accessToken);

              try {
                const response = await mutateAsync({
                  password: data.currentPassword,
                  newPassword: data.newPassword,
                  userId: decodeToken?.user_id,
                  userName: userName,
                });

                if (response?.status === 422) {
                  const errorMessage =
                    response?.response?.data?.error ||
                    "Current password incorrect";
                  setFieldError("currentPassword", errorMessage);
                } else if (response?.message) {
                  setSuccessMessage(response.message);
                }
              } catch (error: any) {
                const apiError =
                  error?.response?.data?.error || "Current password incorrect";
                setFieldError("currentPassword", apiError);
              }
            }
          }}
        >
          <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <h1>CHANGE PASSWORD </h1>
            <TextInputField
              id="currentPassword"
              name="currentPassword"
              label="Current password"
              type="password"
            />
            <TextInputField
              id="newPassword"
              name="newPassword"
              label="New password"
              type="password"
            />
            <TextInputField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
            <MainButton type="submit" title={"Change"} onClick={() => {}} />
          </WrapperBox>
        </FormikInit>
      </WrapperBox>
    </ContainerLoaderOverlay>
  );
};

export default ChangePassword;

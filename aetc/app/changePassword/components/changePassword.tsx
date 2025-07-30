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
import { CircularProgress } from "@mui/material";

const schema = yup.object({
  CurrentPassword: yup.string().label("Current password").required().min(4),
  NewPassword: yup.string().label("New password").required().min(4), //.matches(/[!@#$%&*?~]/, "must include atleast one special character")
  ConfirmPassword: yup
    .string()
    .label("Confirm password")
    .required()
    .min(4)
    .oneOf([yup.ref("NewPassword")], "Password not matching "),
});

const ChangePassword = () => {
  const { mutateAsync, isPending, isSuccess, error } = changePassword();

  const [successMessage, setSuccessMessage] = useState("");
  console.log(isPending);
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
            CurrentPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
          }}
          validationSchema={schema}
          submitButton={false}
          onSubmit={async (data: any, { setFieldError }) => {
            const accessToken = localStorage.getItem("accessToken");
            const userName = localStorage.getItem("userName");
            const userRole = localStorage.getItem("roles");
            console.log("User Roles:", userRole);

            if (accessToken) {
              const decodeToken: {
                userName: any;
                user_id: string;
              } = jwtDecode(accessToken);

              try {
                const response = await mutateAsync({
                  password: data.CurrentPassword,
                  newPassword: data.NewPassword,
                  userId: decodeToken?.user_id,
                  userName: userName,
                });

                console.log("Success response:", response);

                if (response?.status === 422) {
                  console.log(
                    "Validation error:",
                    response?.response?.data?.error
                  );

                  const errorMessage =
                    response?.response?.data?.error ||
                    "Current password incorrect";
                  setFieldError("CurrentPassword", errorMessage);
                } else if (response?.message) {
                  setSuccessMessage(response.message);
                }
              } catch (error: any) {
                console.log("Error message:", error?.response?.data);

                const apiError =
                  error?.response?.data?.error || "Current password incorrect";
                setFieldError("CurrentPassword", apiError);
                console.log(apiError);
              }
            }
          }}
        >
          <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <h1>CHANGE PASSWORD </h1>
            <TextInputField
              id="CurrentPassword"
              name="CurrentPassword"
              label="Current password"
              type="password"
            />
            <TextInputField
              id="NewPassword"
              name="NewPassword"
              label="New password"
              type="password"
            />
            <TextInputField
              id="ConfirmPassword"
              name="ConfirmPassword"
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

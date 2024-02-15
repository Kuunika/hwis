"use client";
import {
  FormikInit,
  MainButton,
  MainGrid,
  MainPaper,
  MainTypography,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";
import Image from "next/image";
import { Login } from "@/hooks/login";
import { useNavigation } from "@/hooks";
import { useEffect } from "react";

const schema = yup.object({
  username: yup.string().label("Username"),
  password: yup.string().label("Password"),
});

type props = {
  submit: (data: any) => void;
};

export const LoginForm = () => {
  const { mutate, isPending, isError, isSuccess, data } = Login();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (isSuccess) {
      console.log({ data });
      navigateTo("/");
    }
  }, [isSuccess]);

  return (
    <MainGrid container>
      <MainGrid item lg={4}></MainGrid>
      <MainGrid item lg={4}>
        <br />
        <br />
        <WrapperBox
          sx={{
            p: "2ch",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "1ch",
          }}
        >
          <Image src={"/logo.png"} alt="logo" width={100} height={100} />
          <br />
          <MainTypography variant="h3">Mahis</MainTypography>
          <br />
          <FormikInit
            initialValues={{ username: "", password: "" }}
            validationSchema={schema}
            onSubmit={async (data: any) => mutate(data)}
            submitButtonText="Login"
            submitButton={false}
          >
            <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
              <TextInputField
                width={"100%"}
                sx={{ mx: 0 }}
                id="username"
                name="username"
                label="Username"
              />
              <TextInputField
                width={"100%"}
                sx={{ mx: 0 }}
                id="password"
                name="password"
                label="Password"
                type="password"
              />
              <MainButton type="submit" title={"Login"} onClick={() => {}} />
            </WrapperBox>
          </FormikInit>
        </WrapperBox>
      </MainGrid>
      <MainGrid item lg={4}></MainGrid>
    </MainGrid>
  );
};

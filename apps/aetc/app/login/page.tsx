"use client";
import { useNavigation } from "@/hooks";
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
import { ApiCore } from "mahis-api-client";
import { notify } from "@/helpers";

const schema = yup.object({
  username: yup.string().label("Username"),
  password: yup.string().label("Password"),
});

export default function LoginPage() {
  const { navigateTo } = useNavigation();

  const handleSubmit = async (values: any) => {
    ApiCore.setHost("http://192.168.43.36:3000");
    const authentication = await ApiCore.login(
      values.username,
      values.password
    );

    if (authentication.ok) {
      notify("success", "loggedIn successfully");
      navigateTo("/");
    } else {
      notify("error", ` ${authentication.errorState}`);
    }
  };
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
            onSubmit={handleSubmit}
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
              <MainButton title={"Login"} onClick={() => navigateTo("/")} />
            </WrapperBox>
          </FormikInit>
        </WrapperBox>
      </MainGrid>
      <MainGrid item lg={4}></MainGrid>
    </MainGrid>
  );
}

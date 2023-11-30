"use client";
import { useNavigation } from "@/hooks";
import {
  FormikInit,
  MainGrid,
  MainPaper,
  MainTypography,
  TextInputField,
} from "shared-ui/src";
import * as yup from "yup";
import Image from "next/image";
import { ApiCore } from "mahis-api-client";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object({
  username: yup.string().label("Username"),
  password: yup.string().label("Password"),
});

export default function LoginPage() {
  const { navigateTo } = useNavigation();

  const handleSubmit = async (values: any) => {
    const authentication = await ApiCore.login(
      values.username,
      values.password
    );

    if (authentication.ok) {
      const notify = () =>
        toast.success(`login successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

      notify();
      navigateTo("/");
    } else {
      const notify = () =>
        toast.error(`${authentication.errorState}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

      notify();
    }
  };
  return (
    <MainGrid container>
      <MainGrid item lg={4}></MainGrid>
      <MainGrid item lg={4}>
        <br />
        <br />
        <br />
        <br />
        <MainPaper
          sx={{
            p: "5ch",
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
          >
            <TextInputField id="username" name="username" label="Username" />
            <TextInputField
              id="password"
              name="password"
              label="Password"
              type="password"
            />
          </FormikInit>
        </MainPaper>
      </MainGrid>
      <MainGrid item lg={4}></MainGrid>
    </MainGrid>
  );
}

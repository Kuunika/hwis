"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationForm } from "./components";
import { useNavigation } from "@/hooks";
import { successDialog } from "@/helpers";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "../registration/components/common";
import { Navigation } from "../registration/scanner/page";

export default function InitialRegistration() {
  const { navigateTo } = useNavigation();
  const initialValues = { firstName: "", lastName: "" };

  const handleSubmit = (values: any, options: any) => {
    options.resetForm();

    successDialog({
      title: "Patient Added successfully",
      text: "Patient Added to prescreening list",
      icon: "success",
      onConfirm: () => {},
      confirmButtonText: "Register More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
  };
  return (
    <>
      <Navigation title="Initial Registration" link="/" />
      <MainGrid container>
        <MainGrid lg={4} item></MainGrid>
        <MainGrid
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>Initial Registration</RegistrationMainHeader>
          <RegistrationDescriptionText>
            The demographics form has been thoughtfully crafted to collect
            patient information, including personal details, contact information
          </RegistrationDescriptionText>
          <RegistrationCard>
            <InitialRegistrationForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={4} item></MainGrid>
      </MainGrid>
    </>
  );
}

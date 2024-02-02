"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "../components/preScreeningForm";
import { successDialog } from "@/helpers";
import { useNavigation } from "@/hooks";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "@/app/registration/components/common";
import { Navigation } from "@/app/registration/scanner/page";
import { MainGrid } from "shared-ui/src";

export default function Prescreening() {
  const { navigateTo } = useNavigation();
  const handleSubmit = (values: any) => {
    successDialog({
      title: "Prescreening Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/initial-registration/list"),
      confirmButtonText: "Prescreen More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
  };
  return (
    <>
      <Navigation title="Prescreening" link="/initial-registration/list" />
      <MainGrid container>
        <MainGrid lg={3} item></MainGrid>
        <MainGrid
          lg={6}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>Screening</RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through initial
            registration successfully and waiting for prescreening.
          </RegistrationDescriptionText>
          <RegistrationCard>
            <PrescreeningForm onSubmit={handleSubmit} />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={3} item></MainGrid>
      </MainGrid>
    </>
  );
}

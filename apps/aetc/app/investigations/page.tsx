"use client";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { InvestigationsForm } from "./components";
import { BackButton } from "@/components/buttons";

export default function Investigations() {
  const initialValues = {};

  const handleSubmit = () => {};
  return (
    <MainGrid container spacing={1}>
      <MainGrid item lg={2}></MainGrid>
      <MainGrid item lg={7}>
        <MainPaper elevation={0} sx={{ padding: "2ch", mt: "1ch" }}>
          <BackButton />
          <br />
          <MainTypography variant="h3" color={"gray"}>
            Investigations
          </MainTypography>
          <br />
          <InvestigationsForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </MainPaper>
      </MainGrid>
    </MainGrid>
  );
}

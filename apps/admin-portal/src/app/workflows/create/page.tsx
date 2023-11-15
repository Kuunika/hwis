"use client";
import { useContext } from "react";
import { SectionForm } from "@/components";
import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { WorkFlowContext, WorkFlowContextType } from "@/contexts/workflow";
import { useNavigation } from "@/helpers";
import { BackButton } from "@/components/common";

export default function Page() {
  const { navigateTo } = useNavigation();
  const { addWorkFlow } = useContext(WorkFlowContext) as WorkFlowContextType;
  const handleSubmit = (values: any) => {
    addWorkFlow(values);
    navigateTo("view");
  };

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <MainTypography variant="h4">Create Work Flow</MainTypography>
      <br />
      <SectionForm onSubmit={handleSubmit} />
    </MainPaper>
  );
}

"use client";
import { useContext } from "react";
import { ViewForm } from "@/components";
import { WorkFlowContext, WorkFlowContextType } from "@/contexts/";
import { MainButton, MainPaper } from "shared-ui/src";
import { useAddWorkflow, useWorkflow } from "@/hooks";
import { ActionComplete, BackButton } from "@/components/common";
import { useNavigation } from "@/helpers";

export default function Page() {
  const { navigateTo } = useNavigation();
  const { mutate, isLoading, isSuccess } = useAddWorkflow();
  const { workflow } = useContext(WorkFlowContext) as WorkFlowContextType;

  if (isSuccess) {
    return (
      <ActionComplete
        message="Form created successfully"
        previousActionMessage="Add more forms"
        onPreviousClick={() => navigateTo("workflows/create")}
        nextActionMessage="Go to home"
        onNextClick={() => navigateTo("/")}
      />
    );
  }

  const handleSubmit = () => {
    mutate(workflow);
  };

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />
      <MainButton
        title={isLoading ? "saving form..." : "save workflow"}
        onClick={handleSubmit}
      />
      <br />
      <br />
      <ViewForm workflow={workflow} />
    </MainPaper>
  );
}

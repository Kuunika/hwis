"use client";
import { useContext } from "react";
import { SectionForm } from "@/components";
import { WorkFlowContext, WorkFlowContextType } from "@/contexts";
import { useNavigation, useParameters } from "@/helpers";
import { getWorkflows, useWorkflow } from "@/hooks";
import { MainPaper, MainTypography } from "shared-ui/src";

export default function Page() {
  const { data: workflows } = getWorkflows();
  const { params } = useParameters();
  const { addWorkFlow } = useContext(WorkFlowContext) as WorkFlowContextType;
  const { navigateTo } = useNavigation();

  const workflow = workflows?.find((w) => w.id == params.id);

  if (!workflow) {
    return <></>;
  }

  const initialValues = {
    flowName: workflow.name,
    forms: workflow.forms.map((f) => ({ id: f.id, label: f.fragmentName })),
  };

  const handleSubmit = (values: any) => {
    addWorkFlow(values);
    navigateTo(`view`);
  };

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <br />
      <MainTypography variant="h4">Update Work Flow</MainTypography>
      <br />
      <SectionForm initialValues={initialValues} onSubmit={handleSubmit} />
    </MainPaper>
  );
}

"use client";
import { useContext } from "react";
import { ViewForm } from "@/components";
import { WorkFlowContext, WorkFlowContextType } from "@/contexts/";
import { MainButton, MainPaper } from "shared-ui/src";
import { updateWorkflow, useAddWorkflow, useWorkflow } from "@/hooks";
import { ActionComplete, BackButton } from "@/components/common";
import { useNavigation, useParameters } from "@/helpers";

export default function ViewWorkFlow() {
  const { navigateTo } = useNavigation();
  const {
    mutate: create,
    isLoading: creating,
    isSuccess: created,
  } = useAddWorkflow();

  const {
    mutate: update,
    isLoading: updating,
    isSuccess: updated,
  } = updateWorkflow();
  const { workflow } = useContext(WorkFlowContext) as WorkFlowContextType;

  const { params } = useParameters();

  if (created || updated) {
    return (
      <ActionComplete
        message={`workflow ${params.id ? "updated" : "created"} successfully`}
        previousActionMessage={`${
          params.id ? "workflow listing" : "Add more forms"
        } `}
        onPreviousClick={() =>
          navigateTo(`${params.id ? "/workflows" : "workflows/create"}`)
        }
        nextActionMessage="Go to home"
        onNextClick={() => navigateTo("/")}
      />
    );
  }

  const handleSubmit = () => {
    if (params.id) {
      update({ ...workflow, id: params.id });
      return;
    }

    const forms = workflow.forms;
    const name = workflow.name;
    create({ forms, name });
  };

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />
      <MainButton
        title={
          creating
            ? "saving workflow..."
            : `${params.id ? "update" : "save"} workflow`
        }
        onClick={handleSubmit}
      />
      <br />
      <br />
      <ViewForm workflow={workflow} />
    </MainPaper>
  );
}

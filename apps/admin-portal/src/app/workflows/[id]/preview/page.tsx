"use client";
import { ViewForm } from "@/components";
import { BackButton } from "@/components/common";
import { useParameters } from "@/helpers";
import { getWorkflows } from "@/hooks";
import { MainPaper } from "shared-ui/src";

export default function Page() {
  const { data: workflows } = getWorkflows();
  const { params } = useParameters();

  const workflow = workflows?.find((w) => w.id == params.id);

  if (!workflow) {
    return <></>;
  }

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />
      <ViewForm workflow={workflow} />
    </MainPaper>
  );
}

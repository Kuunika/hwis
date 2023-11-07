"use client";
import { useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { ViewFormFragment } from "@/components";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainButton, MainPaper } from "shared-ui/src";
import { ActionComplete, BackButton } from "@/components/common";
import { useForm } from "@/hooks";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { mutate, isLoading, isSuccess } = useForm().useAddForm();
  const { formDataElements, formName, resetContext } = useContext(
    SectionContext
  ) as SectionContextType;

  const form = { fragmentName: formName, formDataElements };

  if (isSuccess) {
    return (
      <ActionComplete
        message="Form created successfully"
        previousActionMessage="Add more forms"
        onPreviousClick={() => router.back()}
        nextActionMessage="Go to home"
        onNextClick={() => router.push("/")}
      />
    );
  }

  const handleSubmit = () => {
    mutate(form);
    resetContext();
  };
  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />

      <MainButton
        title={isLoading ? "saving form..." : "save form"}
        onClick={handleSubmit}
      />
      <br />
      <br />
      <ViewFormFragment onSubmit={() => {}} frag={form} />
    </MainPaper>
  );
}

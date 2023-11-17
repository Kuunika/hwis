"use client";
import { useContext } from "react";
import { ViewFormFragment } from "@/components";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainButton, MainPaper } from "shared-ui/src";
import { ActionComplete, BackButton } from "@/components/common";
import { addForm, updateForm } from "@/hooks";

import { useNavigation, useParameters } from "@/helpers";

export default function ViewForm() {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { mutate: create, isLoading: creating, isSuccess: created } = addForm();
  const {
    mutate: update,
    isLoading: updating,
    isSuccess: updated,
  } = updateForm();

  const formId = params.id;

  // const { addForm, updateForm } = useForm();
  const { formDataElements, formName, resetContext } = useContext(
    SectionContext
  ) as SectionContextType;

  const form = { id: "", formName, formInputs: formDataElements };

  if (created || updated) {
    return (
      <ActionComplete
        message={`Form ${formId ? "updated" : "created"} successfully`}
        previousActionMessage={formId ? "Form listings" : "Add more forms"}
        onPreviousClick={() => navigateTo(formId ? "/forms" : "/forms/create")}
        nextActionMessage="Go to home"
        onNextClick={() => navigateTo("/")}
      />
    );
  }

  const handleSubmit = () => {
    console.log({ form });

    if (formId) {
      // update
      update({ ...form, id: formId });
      return;
    }

    create({ formInputs: form.formInputs, formName: form.formName });
    resetContext();
  };
  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />

      <MainButton
        title={
          creating || updating
            ? "saving form..."
            : `${params.id ? "update" : "save"} form`
        }
        onClick={handleSubmit}
      />
      <br />
      <br />
      <ViewFormFragment
        onSubmit={(values) => console.log({ values })}
        frag={form}
      />
    </MainPaper>
  );
}

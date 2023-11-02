"use client";
import { useState, useContext, useEffect } from "react";

import {
  MainButton,
  MainCard,
  MainTypography,
  StepperContainer,
  WrapperBox,
} from "shared-ui/src";
import { FormFragment } from "./formFragment";
import {
  FormBuilderContext,
  FormBuilderContextType,
  Section,
  SectionContext,
  SectionContextType,
} from "@/contexts";
import { useRouter } from "next/navigation";
import { useForm } from "@/hooks";
import { ViewForm } from "@/components";

export default function FormStepper() {
  const { mutate } = useForm().useAddForm();
  const { sections, formName } = useContext(
    SectionContext
  ) as SectionContextType;
  const router = useRouter();

  const draftSections = JSON.parse(JSON.stringify(sections)) as Section[];

  const handleSubmit = async (values: any) => {
    const mappedSections = JSON.parse(JSON.stringify(sections)) as Section[];

    mappedSections.map((s) => {
      delete s.dataElements;
      delete s.id;
      return {
        ...s,
        formDataElements: s.formDataElements.map((fd) => {
          delete fd.id;
          const rules = fd.rules.map((r) => {
            delete r.id;
            return r;
          });

          fd.rules = rules;
          return fd;
        }),
      };
    });
    await mutate({
      departmentId: 1,
      name: formName,
      fragments: mappedSections,
    });
  };

  return (
    <>
      <WrapperBox>
        <MainButton
          title="Return to Editing"
          variant="secondary"
          onClick={() => router.back()}
        />
        <MainButton title="Save" variant="primary" onClick={handleSubmit} />
      </WrapperBox>
      <br />
      <MainCard
        elevation={2}
        sx={{
          mx: "2ch",
          my: "2ch",
          alignItems: "center",
        }}
      >
        <ViewForm form={{ id: "", fragments: draftSections, name: formName }} />
      </MainCard>
    </>
  );
}

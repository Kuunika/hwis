"use client";

import { ViewFormFragment } from "@/components";

import { MainPaper } from "shared-ui/src";
import { BackButton } from "@/components/common";
import { useForm } from "@/hooks";
import { useParameters } from "@/helpers";
import { Form } from "@/services";

export default function Page() {
  const { params } = useParameters();
  const { data: forms } = useForm().getForms();

  const form = forms?.find((f) => f.id == params.id);

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <br />

      <ViewFormFragment
        onSubmit={(values) => console.log({ values })}
        frag={form ? form : ({} as Form)}
      />
    </MainPaper>
  );
}

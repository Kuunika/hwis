"use client";
import { ViewForm } from "@/components";
import { useForm } from "@/hooks";
import { Form } from "@/services";
import { useParams } from "next/navigation";
import { MainCard } from "shared-ui/src";

export default function Page() {
  const params = useParams();
  const { data: forms } = useForm().getForms();

  const form = forms?.find((f) => f.id == params.id);

  if (!form) {
    return <></>;
  }

  return (
    <MainCard
      elevation={2}
      sx={{
        mx: "2ch",
        my: "2ch",
        alignItems: "center",
      }}
    >
      <ViewForm form={form ? form : ({} as Form)} />
    </MainCard>
  );
}

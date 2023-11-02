import { useContext } from "react";
import { TextPill } from "@/components/common";
import { Container } from "@/components/drag/container";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainTypography, WrapperBox, MainButton } from "shared-ui/src";
import { useRouter } from "next/navigation";

export const ListFormDataElements = () => {
  const router = useRouter();
  const { sections, orderFormDataElements } = useContext(
    SectionContext
  ) as SectionContextType;

  const section = sections.find((s) => s.active);

  if (!section) return;

  const formDataElements = section.formDataElements?.map((d) => ({
    id: d.id,
    component: (
      <TextPill key={d.id}>
        <MainTypography>{d.label}</MainTypography>
      </TextPill>
    ),
  }));

  return (
    <WrapperBox>
      <MainButton
        onClick={() => router.push("/build-form/view")}
        title="Preview Form"
      />
      {section.id ? (
        <Container
          items={formDataElements}
          onMove={(formDataElementId: string, index: number, index2: number) =>
            orderFormDataElements(section.id, formDataElementId, index, index2)
          }
        />
      ) : null}
    </WrapperBox>
  );
};

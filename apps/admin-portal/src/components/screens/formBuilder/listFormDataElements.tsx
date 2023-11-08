import { useContext } from "react";
import { TextPill } from "@/components/common";
import { Container } from "@/components/drag/container";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainTypography, WrapperBox, MainButton } from "shared-ui/src";

import { useNavigation, useParameters } from "@/helpers";

export const ListFormDataElements = () => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { formDataElements, orderFormDataElements } = useContext(
    SectionContext
  ) as SectionContextType;

  const dataElements = formDataElements.map((d) => ({
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
        onClick={() => navigateTo(params.id ? "view" : "/forms/view")}
        title="Preview Form"
      />

      {dataElements.length > 0 ? (
        <Container
          items={dataElements}
          onMove={(formDataElementId: string, index: number, index2: number) =>
            orderFormDataElements(formDataElementId, index, index2)
          }
        />
      ) : null}
    </WrapperBox>
  );
};

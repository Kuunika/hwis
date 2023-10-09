import { FC, useContext, useState, useEffect } from "react";
import {
  AddFormDataElement,
  AddOptionSet,
  AddRuleForm,
  RuleList,
  SideSectionList,
} from "..";
import {
  BaseRadioInput,
  MainGrid,
  MainTypography,
  WrapperBox,
  MainPaper,
  MainButton,
} from "shared-ui/src";
import {
  FormDataElement,
  Section,
  SectionContext,
  SectionContextType,
} from "@/contexts";
import { TextPill } from "../common";
import { Container } from "../drag/container";

export const ConfigureSectionScreen: FC = () => {
  const { sections } = useContext(SectionContext) as SectionContextType;

  const section = sections.find((s) => s.active);
  return (
    <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      <MainTypography variant="h4" alignSelf={"center"} mb={"2ch"}>
        {section?.fragmentName} Section
      </MainTypography>
      <MainGrid container spacing={1}>
        <MainGrid item lg={2}>
          <SideSectionList />
        </MainGrid>
        <MainGrid item lg={8}>
          <MainSection />
        </MainGrid>
        <MainGrid item lg={2}>
          <ListFormDataElements />
        </MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};

const MainSection = () => {
  const { addElement } = useContext(SectionContext) as SectionContextType;

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        px: "1ch",
      }}
    >
      <AddFormDataElement onSubmit={(values: any) => addElement(values)} />
      <FormDataElements />
    </WrapperBox>
  );
};

const FormDataElements = () => {
  const [section, setSection] = useState<Section>();
  const { getActiveSection, sections } = useContext(
    SectionContext
  ) as SectionContextType;

  useEffect(() => {
    const sect = getActiveSection();

    if (!sect) return;

    setSection(sect);
  }, [sections]);

  return (
    <WrapperBox sx={{ width: "100%" }}>
      <br />
      <MainTypography variant="h5">Form Data Elements</MainTypography>
      <br />
      {section?.formDataElements?.map((dataElement) => (
        <FormDataElement key={dataElement.id} formDataElement={dataElement} />
      ))}
    </WrapperBox>
  );
};

const FormDataElement: FC<{ formDataElement: FormDataElement }> = ({
  formDataElement,
}) => {
  const { addRule, updateValidation, getValidations, updateProp } = useContext(
    SectionContext
  ) as SectionContextType;

  return (
    <MainPaper
      elevation={3}
      sx={{
        display: "flex",
        my: "1ch",
        p: "2ch",
        justifyContent: "space-between",
      }}
    >
      <WrapperBox>
        <MainTypography variant="h6">{formDataElement.label}</MainTypography>
        <br />
        <WrapperBox>
          <MainTypography fontStyle={"italic"}>
            Form Input: {formDataElement.type}
          </MainTypography>
          <MainTypography fontStyle={"italic"}>
            Data Type: {formDataElement.dataType}
          </MainTypography>
        </WrapperBox>
      </WrapperBox>

      <WrapperBox
        display={"flex"}
        flexDirection={"column"}
        sx={{ width: "17ch" }}
      >
        <BaseRadioInput
          label="Is this field Required?"
          value={getValidations(formDataElement.id, "isRequired")}
          name="required"
          hasError={false}
          handleChange={(value: any) =>
            updateValidation(formDataElement.id, {
              rule: "isRequired",
              value: value.target.value,
            })
          }
          options={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
        />
        <BaseRadioInput
          label="Is visible on load?"
          value={formDataElement.isVisible}
          name="visibleOnload"
          hasError={false}
          handleChange={(value: any) =>
            updateProp(formDataElement.id, value.target.value, "isVisible")
          }
          options={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
        />
      </WrapperBox>
      <WrapperBox
        display={"flex"}
        flexDirection={"column"}
        sx={{ width: "35ch" }}
      >
        <WrapperBox
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"flex-end"}
        >
          <AddRuleForm
            onSubmit={(values: any, { resetForm }) => {
              addRule(formDataElement.id, values);
              resetForm();
            }}
          />

          {formDataElement.type != "text" && (
            <AddOptionSet
              onSubmit={(value: any) =>
                updateProp(formDataElement.id, value.optionSet, "optionSetId")
              }
            />
          )}
        </WrapperBox>
        {formDataElement.optionSetId && (
          <>
            <MainTypography fontWeight={"800"} fontStyle={"italic"}>
              Option Set
            </MainTypography>
            <TextPill>
              <MainTypography>{formDataElement.optionSetId}</MainTypography>
            </TextPill>
            <br />
          </>
        )}

        {formDataElement.rules.length > 0 && (
          <MainTypography fontWeight={"800"} fontStyle={"italic"}>
            Rules
          </MainTypography>
        )}
        <RuleList rules={formDataElement.rules} />
      </WrapperBox>
    </MainPaper>
  );
};

const ListFormDataElements = () => {
  const { sections, formName, orderFormDataElements } = useContext(
    SectionContext
  ) as SectionContextType;

  const saveData = async (data: any) => {
    fetch("http://localhost:3000/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((d) => {
      // console.log({ d });
    });
  };

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
        onClick={() => saveData({ name: formName, fragments: sections })}
        title="SYNC CONFIGURATION"
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

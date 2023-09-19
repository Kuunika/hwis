import { FC, useContext, useState } from "react";
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
  SectionContext,
  SectionContextType,
} from "@/app/contexts";
import { TextPill } from "../common";

export const ConfigureSectionScreen: FC = () => {
  return (
    <WrapperBox sx={{ display: "flex", width: "90%" }}>
      <MainGrid container spacing={1}>
        <MainGrid item lg={2}>
          <SideSectionList />
        </MainGrid>
        <MainGrid item lg={7}>
          <MainSection />
        </MainGrid>
        <MainGrid item lg={3}>
          <ListFormDataElements />
        </MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};

const MainSection = () => {
  const { section, addElement } = useContext(
    SectionContext
  ) as SectionContextType;

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        px: "1ch",
      }}
    >
      <MainTypography variant="h4" alignSelf={"center"} mb={"2ch"}>
        {section.fragmentName} Section
      </MainTypography>
      <AddFormDataElement onSubmit={(values: any) => addElement(values)} />
      <FormDataElements />
    </WrapperBox>
  );
};

const FormDataElements = () => {
  const { section } = useContext(SectionContext) as SectionContextType;

  return (
    <WrapperBox sx={{ width: "100%" }}>
      {section.formDataElements?.map((dataElement) => (
        <FormDataElement key={dataElement.id} formDataElement={dataElement} />
      ))}
    </WrapperBox>
  );
};

const FormDataElement: FC<{ formDataElement: FormDataElement }> = ({
  formDataElement,
}) => {
  const { addRule, updateValidation, getValidations, updateProp, section } =
    useContext(SectionContext) as SectionContextType;

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

      <WrapperBox display={"flex"} flexDirection={"column"}>
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
        // alignItems={"flex-start"}
        // justifyContent={"flex-end"}
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
  const { section, sections, formName } = useContext(
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
      console.log({ d });
    });
  };
  return (
    <WrapperBox>
      <MainButton
        onClick={() => saveData({ name: formName, fragments: sections })}
        title="SYNC CONFIGURATION"
      />
      {section.formDataElements?.map((d) => (
        <TextPill key={d.id}>
          <MainTypography>{d.label}</MainTypography>
        </TextPill>
      ))}
    </WrapperBox>
  );
};

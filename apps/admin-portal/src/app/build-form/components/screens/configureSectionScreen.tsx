import { FC, useContext, useState } from "react";
import { AddFormDataElement, AddRuleForm, RuleList, SideSectionList } from "..";
import {
  BaseRadioInput,
  MainGrid,
  MainTypography,
  WrapperBox,
  MainPaper,
} from "shared-ui/src";
import {
  FormDataElement,
  SectionContext,
  SectionContextType,
} from "@/app/contexts";

const rules = [
  {
    id: "1",
    formElementId: "1",
    operator: "=",
    value: "80",
    routeTo: "Last Name",
  },
  {
    id: "2",
    formElementId: "1",
    operator: "=",
    value: "80",
    routeTo: "Gender",
  },
];

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
        <MainGrid item lg={3}></MainGrid>
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
  const [isRequired, setIsRequired] = useState("1");
  const [isVisibleOnload, setIsVisibleOnload] = useState("1");
  const { addRule } = useContext(SectionContext) as SectionContextType;

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
          value={isRequired}
          name="required"
          hasError={false}
          handleChange={(value: any) => setIsRequired(value.target.value)}
          options={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
        />
        <BaseRadioInput
          label="Is visible on load?"
          value={isVisibleOnload}
          name="visibleOnload"
          hasError={false}
          handleChange={(value: any) => setIsVisibleOnload(value.target.value)}
          options={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
        />
      </WrapperBox>
      <WrapperBox
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-end"}
      >
        <AddRuleForm
          onSubmit={(values: any, { resetForm }) => {
            addRule(formDataElement.id, values);
            resetForm();
          }}
        />
        <RuleList rules={formDataElement.rules} />
      </WrapperBox>
    </MainPaper>
  );
};

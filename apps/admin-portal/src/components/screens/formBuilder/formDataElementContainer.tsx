import { FC, useContext } from "react";
import { AddRuleForm, RuleList } from "@/components";

import {
  SectionContext,
  SectionContextType,
  FormDataElement,
} from "@/contexts";
import { useOptionSet } from "@/hooks";
import {
  MainPaper,
  WrapperBox,
  MainTypography,
  BaseRadioInput,
} from "shared-ui/src";
import { useConcepts } from "@/hooks/useConcepts";

export const FormDataElementContainer: FC<{
  formDataElement: FormDataElement;
}> = ({ formDataElement }) => {
  const { data: concepts } = useConcepts().getConcepts();
  const { addRule, updateValidation, getValidations, updateProp } = useContext(
    SectionContext
  ) as SectionContextType;

  return (
    <MainPaper
      elevation={0}
      sx={{
        display: "flex",
        my: "1ch",
        p: "2ch",
        justifyContent: "space-between",
        backgroundColor: "#F4F4F4",
        borderRadius: "2ch",
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
            Concept:{" "}
            {
              concepts?.find((c) => c.uuid == formDataElement.dataElement)
                ?.names[0].name
            }
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
        </WrapperBox>

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

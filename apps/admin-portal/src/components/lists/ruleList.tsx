import { Rule } from "@/contexts";
import { FC } from "react";
import { MainTypography, WrapperBox } from "shared-ui/src";

export const RuleList: FC<{ rules: Rule[] }> = ({ rules }) => {
  return (
    <WrapperBox>
      {rules.map((rule) => (
        <Rule key={rule.id} rule={rule} />
      ))}
    </WrapperBox>
  );
};

const Rule: FC<{ rule: Rule }> = ({ rule }) => {
  return (
    <WrapperBox
      display={"flex"}
      alignItems={"center"}
      sx={{
        py: 1,
        px: 1,
        backgroundColor: "#F4F4F4",
        borderRadius: "5px",
        my: 1,
        cursor: "pointer",
      }}
    >
      <MainTypography variant="h5" fontWeight="800">
        &nbsp;{rule.operator}&nbsp;
      </MainTypography>
      <MainTypography fontWeight={"800"}>{rule.value} &nbsp;</MainTypography>
      <MainTypography>show&nbsp;</MainTypography>
      <MainTypography fontWeight={"800"}>{rule.routeTo}</MainTypography>
    </WrapperBox>
  );
};

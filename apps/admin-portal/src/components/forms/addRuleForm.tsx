import { FC, useContext } from "react";
import {
  FormikInit,
  MainButton,
  MainTypography,
  SelectInputField,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";

import * as React from "react";
import { BasePopover } from "../common/popover";
import { SectionContext, SectionContextType } from "@/contexts";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
};

const schema = Yup.object().shape({
  operator: Yup.string().required().label("Operator"),
  value: Yup.string().required().label("value"),
  dataElementId: Yup.string().required().label("Data Element"),
});

const initialValues = {
  operator: "",
  value: "",
  dataElementId: "",
};

const operators = [
  { name: "Equal (=)", value: "=" },
  { name: "Greater (>)", value: ">" },
  { name: "Less (<)", value: "<" },
];

const dataTypes = [
  { name: "Number", value: "number" },
  { name: "Text", value: "text" },
  { name: "Boolean", value: "bool" },
];

export const AddRuleForm: FC<Prop> = ({ onSubmit }) => {
  const { sections } = useContext(SectionContext) as SectionContextType;

  const section = sections.find((s) => s.active);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MainButton onClick={handleClick} title="Add Rule" variant="text" />
      <BasePopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <FormikInit
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={schema}
          submitButton={false}
        >
          <WrapperBox p="1ch">
            <SelectInputField
              id="dataElement"
              label="Data Element"
              selectItems={
                section
                  ? section?.dataElements?.map((d) => ({
                      value: d.id,
                      name: d.label,
                    }))
                  : []
              }
              name="dataElementId"
              sx={{ mx: 0 }}
            />
            <SelectInputField
              id="operator"
              label="Operator"
              selectItems={operators}
              name="operator"
              sx={{ mx: 0 }}
            />

            <TextInputField name="value" id="value" label="Value" />

            <MainButton
              sx={{ py: "1ch", my: "2ch" }}
              type="submit"
              variant="primary"
              onClick={() => {}}
              title="create"
            />
          </WrapperBox>
        </FormikInit>
      </BasePopover>
    </>
  );
};

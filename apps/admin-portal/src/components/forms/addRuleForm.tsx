import { FC, useContext } from "react";
import {
  FormikInit,
  MainButton,
  MainTypography,
  SelectInputField,
  TextInputField,
  WrapperBox,
  SearchComboBox,
} from "shared-ui/src";
import * as Yup from "yup";

import * as React from "react";
import { BasePopover } from "../common/popover";
import { SectionContext, SectionContextType } from "@/contexts";
import { useDataElements } from "@/hooks";

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

export const AddRuleForm: FC<Prop> = ({ onSubmit }) => {
  const { data: dataElements } = useDataElements().getDataElements();

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
            <SearchComboBox
              name="dataElementId"
              multiple={false}
              sx={{ mr: "1ch" }}
              options={
                dataElements
                  ? dataElements.map((d) => ({ id: d.id, label: d.label }))
                  : []
              }
              label="Data Element"
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

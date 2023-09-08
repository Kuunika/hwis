import { FC } from "react";
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
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
};

const schema = Yup.object().shape({
  operator: Yup.string().required().label("Operator"),
  value: Yup.string().required().label("value"),
  routeTo: Yup.string().required().label("Data Element"),
});

const initialValues = {
  operator: "",
  value: "",
  routeTo: "",
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <MainButton onClick={handleClick} title="Add Rule" variant="secondary" />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FormikInit
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={schema}
          submitButton={false}
        >
          <WrapperBox p="1ch">
            <SelectInputField
              id="operator"
              label="Operator"
              selectItems={operators}
              name="operator"
              sx={{ m: 0 }}
            />
            <TextInputField name="value" id="value" label="Value" />

            <SelectInputField
              id="dataType"
              label="DataType"
              selectItems={dataTypes}
              name="dataType"
              sx={{ m: 0 }}
            />
            <MainButton
              sx={{ width: "30ch", py: "2ch", my: "2ch" }}
              type="submit"
              variant="primary"
              onClick={() => {}}
              title="Create"
            />
          </WrapperBox>
        </FormikInit>
      </Popover>
    </>
  );
};

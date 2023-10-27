import React, { FC } from "react";
import {
  FormikInit,
  MainButton,
  SelectInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";
import { BasePopover } from "../common/popover";
import { useOptionSet } from "@/hooks";
type Prop = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  optionSet: Yup.string().required().label("Form Name"),
});

const initValues = {
  optionSet: "",
};

const options = [
  { name: "Districts", value: "districts" },
  { name: "Gender", value: "gender" },
  { name: "Insurance Provider", value: "insuranceProvider" },
  { name: "Insurance Schema", value: "insuranceSchema" },
  { name: "Marital Status", value: "maritalStatus" },
  { name: "Occupation Status", value: "occupationStatus" },
  { name: "Method Of Transportation", value: "methodOfTransportation" },
  { name: "Religion", value: "religion" },
  { name: "Highest Education", value: "highestEducation" },
  { name: "Health Facilities", value: "healthFacilities" },
  { name: "Mode Of Payment", value: "modeOfPayment" },
];
export const AddOptionSet: FC<Prop> = ({
  onSubmit,
  initialValues = initValues,
}) => {
  const { data: options } = useOptionSet().getOptionSets();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <MainButton onClick={handleClick} title="Add Options" variant="text" />
      <BasePopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <WrapperBox p="1ch" width={"25ch"}>
          <FormikInit
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={schema}
            submitButton={false}
          >
            <SelectInputField
              name="optionSet"
              id="optionSet"
              width="100%"
              sx={{ m: 0 }}
              selectItems={
                options
                  ? options.map((op) => ({ name: op.label, value: op.id }))
                  : []
              }
              label="Option Set"
            />
            <MainButton
              sx={{ py: "1ch", my: "2ch" }}
              type="submit"
              variant="primary"
              onClick={() => {}}
              title="Add"
            />
          </FormikInit>
        </WrapperBox>
      </BasePopover>
    </>
  );
};

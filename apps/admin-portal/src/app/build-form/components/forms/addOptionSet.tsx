import React, { FC } from "react";
import {
  FormikInit,
  MainButton,
  SearchComboBox,
  SelectInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";
import { BasePopover } from "../common/popover";
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
export const AddOptionSet: FC<Prop> = ({
  onSubmit,
  initialValues = initValues,
}) => {
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
        <WrapperBox p="1ch">
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
              selectItems={[
                { name: "districts", value: "districts" },
                { name: "gender", value: "gender" },
              ]}
              label="Option Set"
            />
            <MainButton
              sx={{ width: "30ch", py: "2ch", my: "2ch" }}
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

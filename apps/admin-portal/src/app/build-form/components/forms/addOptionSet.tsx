import React, { FC } from "react";
import {
  FormikInit,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";
import { BasePopover } from "../common/popover";
type Prop = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  option: Yup.string().required().label("Form Name"),
});

const initValues = {
  name: "",
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
        <WrapperBox width={"50ch"}>
          <FormikInit
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={schema}
            submitButtonText="next"
          >
            <SearchComboBox
              name="dataElements"
              options={[
                { label: "districts", id: "districts" },
                { label: "gender", id: "gender" },
              ]}
              label="Data Elements"
            />
          </FormikInit>
        </WrapperBox>
      </BasePopover>
    </>
  );
};

import { useContext } from "react";
import { AddFormDataElement, AddFormName } from "@/components";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { FormDataElements } from ".";
import { useParameters } from "@/helpers";

export const MainSection = () => {
  const { params } = useParameters();
  const { addElement, formDataElements, formName } = useContext(
    SectionContext
  ) as SectionContextType;

  const handleSubmit = (values: any, actions: any) => {
    addElement(values);
    actions.resetForm();
  };

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MainTypography variant="h3" fontWeight={"400"}>
        {params.id ? "Update" : "Create"} Form
      </MainTypography>
      <br />
      <AddFormName onSubmit={() => {}} initialValues={{ name: formName }} />
      <br />
      <br />
      <MainTypography variant="h5">Create Form inputs</MainTypography>
      <br />
      <AddFormDataElement onSubmit={handleSubmit} />
      <br />
      {formDataElements.length > 0 ? (
        <FormDataElements />
      ) : (
        <>
          <WrapperBox
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"30ch"}
          >
            <MainTypography>No form inputs created</MainTypography>
          </WrapperBox>
        </>
      )}
    </WrapperBox>
  );
};

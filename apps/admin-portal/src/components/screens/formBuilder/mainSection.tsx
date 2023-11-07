import { useContext } from "react";
import { AddFormDataElement, AddFormName } from "@/components";
import { SectionContext, SectionContextType } from "@/contexts";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { FormDataElements } from ".";

export const MainSection = () => {
  const { addElement, formDataElements } = useContext(
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
        px: "1ch",
      }}
    >
      <MainTypography variant="h3" fontWeight={"400"}>
        Create Form
      </MainTypography>
      <br />
      <AddFormName onSubmit={() => {}} initialValues={{ name: "" }} />
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

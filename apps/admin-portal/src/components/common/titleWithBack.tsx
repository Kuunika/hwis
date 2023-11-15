import { WrapperBox, MainTypography } from "shared-ui/src";
import { BackButton } from ".";

export const TitleWithBack = ({ title }: { title: string }) => {
  return (
    <>
      <BackButton />
      <WrapperBox justifyContent={"center"} display={"flex"} width={"100%"}>
        <MainTypography variant="h5">{title}</MainTypography>
      </WrapperBox>
    </>
  );
};

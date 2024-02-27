import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import Image from "next/image";

export const FormError = ({
  error,
  onPrimaryAction,
  onSecondaryAction,
}: {
  error: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}) => {
  return (
    <WrapperBox
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Image width={150} height={150} src={"/error.png"} alt="error" />
      <br />
      <MainTypography variant="body2">
        Error occurred whilst <strong>{error}</strong>
      </MainTypography>
      <br />

      <WrapperBox sx={{ display: "flex" }}>
        <MainButton
          onClick={onPrimaryAction}
          title={"retry"}
          sx={{ mr: "0.5ch" }}
        />
        <MainButton
          onClick={onSecondaryAction}
          title={"cancel"}
          variant="secondary"
        />
      </WrapperBox>
    </WrapperBox>
  );
};

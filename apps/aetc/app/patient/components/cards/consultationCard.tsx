import { MainTypography, WrapperBox } from "shared-ui/src";
import { FaPlus } from "react-icons/fa6";
import { useNavigation } from "@/hooks";

export const ConsultationCard = ({
  title,
  link,
  disabled
}: {
  title: string;
  link: string;
  disabled?: boolean
}) => {
  const { navigateTo } = useNavigation();

  const disabledStyles = disabled ? {
    color: 'gray', // Custom color for text
    backgroundColor: 'lightgrey', // Custom background color
    cursor: 'not-allowed',
    textTransform: "capitalize",
    borderRadius: "1px",
  } : {}

  return (
    <WrapperBox
      onClick={() => {

        if (disabled) return

        navigateTo(link)
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        px: "8px",
        py: "16px",
        backgroundColor: "#DDEEDD",
        borderRadius: "4px",
        color: "#006401",
        cursor: "pointer",
        mb: "4px",
        ...disabledStyles
      }}
    >
      <FaPlus />
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "17px",
          letterSpacing: "0em",
          textAlign: "left",
          ml: "1ch",
        }}
      >
        {title}
      </MainTypography>
    </WrapperBox>
  );
};

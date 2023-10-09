import { FaArrowCircleLeft } from "react-icons/fa";
import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <MainTypography
      onClick={() => router.back()}
      sx={{ cursor: "pointer" }}
      variant="h5"
    >
      <FaArrowCircleLeft />
    </MainTypography>
  );
}

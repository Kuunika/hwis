"use client";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MainTypography } from "@/components";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigation } from "@/hooks";

export function BackButton() {
  const router = useRouter();
  const { navigateBackToProfile, navigateTo } = useNavigation();
  return (
    <>
      <MainTypography
        onClick={() => navigateBackToProfile()}
        style={{ display: "flex", marginBottom: "10px" }}
      >
        <MainTypography
          sx={{ width: "24px", height: "24px", fontSize: "20px" }}
        >
          <FaAngleLeft />
        </MainTypography>
        <MainTypography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "21px",
            letterSpacing: "0em",
            textAlign: "left",
          }}
        >
          Back to Profile
        </MainTypography>
      </MainTypography>
    </>
  );
}

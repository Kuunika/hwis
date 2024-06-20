'use client'
import { FaArrowCircleLeft } from "react-icons/fa";
import { MainTypography } from "@/components";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <MainTypography
      onClick={() => router.back()}
      sx={{ cursor: "pointer", color: "grey" }}

    >
      <FaArrowCircleLeft />
    </MainTypography>
  );
}

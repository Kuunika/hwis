"use client";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigation } from "@/hooks";
import { Typography, Box } from "@mui/material";

export function BackButton() {
  const { navigateBackToProfile } = useNavigation();

  return (
    <Box
      onClick={navigateBackToProfile}
      sx={{ display: "flex", alignItems: "center", mb: 2, cursor: "pointer" }}
    >
      <Box sx={{ width: "24px", height: "24px", fontSize: "20px" }}>
        <FaAngleLeft />
      </Box>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: "0em",
          ml: 1,
        }}
      >
        Back to Profile
      </Typography>
    </Box>
  );
}

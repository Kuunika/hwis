import { Box, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface LoaderOverlayProps {
  loading: boolean;
  children: ReactNode;
  height?: string;
}

export const ContainerLoaderOverlay: React.FC<LoaderOverlayProps> = ({
  loading,
  children,
  height = "100%",
}) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

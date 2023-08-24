import { Card, CardContent } from "@mui/material";
import { FC, ReactNode } from "react";

type Prop = {
  children: ReactNode;
  elevation?: number;
  style?: React.CSSProperties;
  border?: string;
  background?: string;
  alignment?: "left" | "right" | "center"; // New alignment prop
};

export const MainCard: FC<Prop> = ({
  children,
  elevation = 1,
  border = "1px solid black",
  background,
  alignment = "left", // Default value
}) => {
  // Determine alignment based on prop value
  let justifyContentValue;
  switch (alignment) {
    case "left":
      justifyContentValue = "flex-start";
      break;
    case "right":
      justifyContentValue = "flex-end";
      break;
    case "center":
      justifyContentValue = "center";
      break;
    default:
      justifyContentValue = "flex-start";
  }

  return (
    <Card
      elevation={elevation}
      sx={{
        border: border,
        marginBottom: "10px",
        backgroundColor: background,
        display: "flex", // Enable flexbox
        justifyContent: justifyContentValue, // Set alignment
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

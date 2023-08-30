import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { welcomeStyles } from "./welcome.styles";

type Props = {
  title: string;
  onClick: () => void;
  icon?: any;
};

export const WelcomeButton: FC<Props> = ({ title, onClick, icon }) => {
  return (
    <Box sx={welcomeStyles.baseButton} onClick={onClick}>
      <Typography variant="h1">{icon}</Typography>
      <Typography variant="h4" fontStyle={"italic"}>
        {title}
      </Typography>
    </Box>
  );
};

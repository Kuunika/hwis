import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  FaUserPlus,
  FaClipboardList,
  FaQrcode,
  FaSearch,
} from "react-icons/fa";
import { welcomeStyles } from "./welcome.styles";
import { WelcomeButton } from ".";

export const WelcomeMenu = () => {
  return (
    <Box sx={welcomeStyles.menu}>
      <WelcomeButton
        icon={<FaUserPlus />}
        title="New Patient"
        onClick={() => {}}
      />

      <WelcomeButton
        icon={<FaClipboardList />}
        title="Pre-Screening"
        onClick={() => {}}
      />

      <WelcomeButton icon={<FaQrcode />} title="Scan ID" onClick={() => {}} />

      <WelcomeButton
        icon={<FaSearch />}
        title="Search Name/ID"
        onClick={() => {}}
      />
    </Box>
  );
};

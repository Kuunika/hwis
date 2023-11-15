import { Box } from "@mui/material";
import {
  FaUserPlus,
  FaClipboardList,
  FaQrcode,
  FaSearch,
} from "react-icons/fa";
import { welcomeStyles } from "./welcome.styles";
import { WelcomeButton } from ".";
import { useRouter } from "next/navigation";

export const WelcomeMenu = () => {
  const router = useRouter();
  return (
    <Box sx={welcomeStyles.menu}>
      <WelcomeButton
        icon={<FaUserPlus />}
        title="New Patient"
        onClick={() => router.push("/new")}
      />

      <WelcomeButton
        icon={<FaClipboardList />}
        title="Pre-Screening"
        onClick={() => {}}
      />

      <WelcomeButton
        icon={<FaQrcode />}
        title="Scan ID"
        onClick={() => router.push("/scan")}
      />

      <WelcomeButton
        icon={<FaSearch />}
        title="Search Name/ID"
        onClick={() => router.push("/search")}
      />
    </Box>
  );
};

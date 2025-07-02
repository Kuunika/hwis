"use client";
import { MainGrid, MainPaper, MainTypography } from "@/components";
import { useNavigation } from "@/hooks";
import {
  FcRules,
  FcSearch,
  FcTodoList,
  FcPlus,
  FcSettings,
  FcAreaChart,
} from "react-icons/fc";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";
import { AuthGuardComp } from "@/helpers/authguardcomponent";
import { useContext } from "react";
import { LocationContext, LocationContextType } from "@/contexts/location";
import { useTheme } from "@mui/material/styles";

function Home() {
  useContext(LocationContext) as LocationContextType;

  return (
    <>
      <MainGrid container>
        <MainGrid item xs={1} sm={1} md={1} lg={2}></MainGrid>
        <MainGrid
          item
          xs={10}
          md={10}
          lg={8}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "center", lg: "start" },
            flexDirection: { xs: "column", sm: "row" },
            gap: "0.5ch",
          }}
          pt="5ch"
        >
          {/* Cards with roles */}
          <AuthGuardComp
            roles={[
              roles.REGISTRATION_CLERK,
              roles.ADMIN,
              roles.CLINICIAN,
              roles.NURSE,
            ]}
          >
            <Card
              link="/registration/search"
              title="Find Patient"
              icon={<FcSearch />}
            />
          </AuthGuardComp>
          <AuthGuardComp
            roles={[
              roles.REGISTRATION_CLERK,
              roles.ADMIN,
              roles.INITIAL_REGISTRATION_CLERK,
              roles.CLINICIAN,
            ]}
          >
            <Card
              link="/initial-registration"
              title="Patient Arrival"
              icon={<FcPlus />}
            />
          </AuthGuardComp>
          <AuthGuardComp
            roles={[
              roles.ADMIN,
              roles.CLINICIAN,
              roles.NURSE,
              roles.DATA_MANAGER,
            ]}
          >
            <Card
              icon={<FcTodoList />}
              link="/initial-registration/list"
              title="Awaiting Screening List"
            />
          </AuthGuardComp>
          <AuthGuardComp
            roles={[roles.REGISTRATION_CLERK, roles.ADMIN, roles.CLINICIAN]}
          >
            <Card
              icon={<FcTodoList />}
              link="/registration/list"
              title="Awaiting Registration List"
            />
          </AuthGuardComp>
          <AuthGuardComp
            roles={[
              roles.ADMIN,
              roles.CLINICIAN,
              roles.NURSE,
              roles.STUDENT_CLINICIAN,
            ]}
          >
            <Card icon={<FcTodoList />} link="/triage" title="Awaiting Triage List" />
          </AuthGuardComp>
          <AuthGuardComp
            roles={[
              roles.ADMIN,
              roles.CLINICIAN,
              roles.NURSE,
              roles.STUDENT_CLINICIAN,
            ]}
          >
            <Card
              icon={<FcTodoList />}
              link="/assessments"
              title="Waiting For Assessment List"
            />
          </AuthGuardComp>
          <AuthGuardComp roles={[roles.ADMIN, roles.CLINICIAN, roles.NURSE]}>
            <Card
              icon={<FcTodoList />}
              link="/dispositions"
              title="Awaiting Specialty/Dispositiion"
            />
          </AuthGuardComp>

          <AuthGuardComp
            roles={[
              roles.REGISTRATION_CLERK,
              roles.ADMIN,
              roles.CLINICIAN,
              roles.NURSE,
            ]}
          >
            <Card
              icon={<FcRules />}
              link="/registration/death/list"
              title="Brought In Dead"
            />
          </AuthGuardComp>
          <AuthGuardComp roles={[roles.ADMIN, roles.REGISTRATION_CLERK]}>
            <Card icon={<FcAreaChart />} link="/reports" title="Reports" />
          </AuthGuardComp>
          <AuthGuardComp roles={[roles.ADMIN, roles.DATA_MANAGER]}>
            <Card icon={<FcSettings />} link="/config" title="Config" />
          </AuthGuardComp>
        </MainGrid>
        <MainGrid item xs={1} sm={1} md={1} lg={3}></MainGrid>
      </MainGrid>
    </>
  );
}

const Card = ({
  link,
  title,
  icon,
}: {
  link: string;
  title: string;
  icon: any;
}) => {
  const { navigateTo } = useNavigation();
  const theme = useTheme();
  return (
    <MainPaper
      onClick={() => navigateTo(link)}
      elevation={3}
      sx={{
        p: "2ch",
        m: "0.5ch",
        width: { xs: "100%", sm: "22%" },
        height: "15ch",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor: "#f9fafb",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <MainTypography
        variant="h2"
        sx={{
          color: theme.palette.primary.main,
          fontSize: { xs: "2rem", sm: "3rem" }, // Adjust font size for responsiveness
        }}
      >
        {icon}
      </MainTypography>
      <MainTypography
        variant="h6"
        textAlign={"center"}
        sx={{
          fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size for title
        }}
      >
        {title}
      </MainTypography>
    </MainPaper>
  );
};

export default AuthGuard(Home, [
  roles.REGISTRATION_CLERK,
  roles.ADMIN,
  roles.CLINICIAN,
  roles.NURSE,
  roles.INITIAL_REGISTRATION_CLERK,
  roles.STUDENT_CLINICIAN,
]);

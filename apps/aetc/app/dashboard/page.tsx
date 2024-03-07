"use client";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { useNavigation } from "@/hooks";


import { FcRules, FcSearch, FcTodoList, FcPlus, FcSettings } from "react-icons/fc";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";

function Home() {
    return (
        <>
            <MainGrid container>
                <MainGrid item xs={1} sm={1} md={1} lg={3}></MainGrid>
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
                    }}
                    pt="5ch"
                >

                    <Card
                        link="/registration/search"
                        title="Find Patient"
                        icon={<FcSearch />}
                    />
                    <Card
                        link="/initial-registration"
                        title="Initial Registration"
                        icon={<FcPlus />}
                    />
                    <Card
                        icon={<FcRules />}
                        link="/registration/death/list"
                        title="Brought In Dead"
                    />
                    <Card
                        icon={<FcTodoList />}
                        link="/initial-registration/list"
                        title="Patients Waiting for Screening"
                    />
                    <Card
                        icon={<FcTodoList />}
                        link="/registration/list"
                        title="Patients Waiting for Registration"
                    />
                    <Card
                        icon={<FcTodoList />}
                        link="/triage"
                        title="Patients Waiting for Triage"
                    />
                    <Card
                        icon={<FcTodoList />}
                        link="/assessments"
                        title="Patients Waiting for Assessment "
                    />
                    <Card
                        icon={<FcSettings />}
                        link="/config"
                        title="Config"
                    />

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
    return (
        <MainPaper
            onClick={() => navigateTo(link)}
            elevation={1}
            sx={{
                p: "1ch",
                m: "1ch",
                width: { xs: "100%", sm: "25%" },
                height: "15ch",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            <MainTypography variant="h2">{icon}</MainTypography>
            <MainTypography textAlign={"center"}>{title}</MainTypography>
        </MainPaper>
    );
};


export default AuthGuard(Home, [roles.ADMIN])
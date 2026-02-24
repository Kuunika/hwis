"use client";

import { MainGrid } from "@/components";

import {
    RegistrationMainHeader,
    RegistrationDescriptionText,
    RegistrationCard,
} from "../registration/components/common";
import { Navigation } from "../components/navigation";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";
import { AwaitingSpecialtyList } from "./componennts/awaitingSpecialtyList";
// import { ClientsWaitingForTestResults } from "./components/testResultsList";

function Specialty() {
    return (
        <>
            <Navigation
                title="Patients waiting for specialty"
                link="/dashboard"
            />
            <MainGrid container>
                <MainGrid xs={0} lg={0} item></MainGrid>
                <MainGrid
                    xs={12}
                    lg={12}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mx: "2ch",
                    }}
                    item
                >
                    <br />
                    <br />
                    <RegistrationMainHeader>
                        Patients waiting for specialty
                    </RegistrationMainHeader>
                    <RegistrationDescriptionText>
                        This is a list of all patients that are waiting for specialty
                    </RegistrationDescriptionText>
                    <RegistrationCard sx={{ p: 0 }}>
                        <AwaitingSpecialtyList />
                    </RegistrationCard>
                </MainGrid>
                <MainGrid lg={0} item></MainGrid>
            </MainGrid>
        </>
    );
}

export default AuthGuard(Specialty, [
    roles.CLINICIAN,
    roles.NURSE,
    roles.ADMIN,
    roles.STUDENT_CLINICIAN,
]);

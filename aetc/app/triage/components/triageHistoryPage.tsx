"use client";

import { TriageHistoryList, ViewTriageResults } from ".";
import { MainButton, MainGrid, MainPaper } from "@/components";
import { useNavigation, useParameters } from "@/hooks";
import { PersonalDetailsCard } from "@/app/patient/components";
import { BackButton } from "@/components/buttons";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";


function TriageHistoryPage() {
  const { navigateTo } = useNavigation();
  const { params } = useParameters()

  return (
    <>
      <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
        <MainGrid item lg={2}>
          <PersonalDetailsCard />
        </MainGrid>
        <MainGrid item lg={8}>
          <MainPaper elevation={0} sx={{ p: "1ch" }}>
            <BackButton />
            <>
              <MainButton
                title={"Start Triage"}
                onClick={() => navigateTo(`/triage/${params.id}/start`)}
              />
              <TriageHistoryList />
            </>
          </MainPaper>
        </MainGrid>
        <MainGrid item lg={2}>
          {/* <ViewTriageResults /> */}
        </MainGrid>
      </MainGrid>
    </>
  );
}
export default AuthGuard(TriageHistoryPage, [roles.CLINICIAN, roles.NURSE, roles.ADMIN])
"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { TriageHistoryList, ViewTriageResults } from "../../components";
import { MainButton, MainGrid, MainPaper } from "shared-ui/src";
import { useNavigation } from "@/hooks";
import { PersonalDetailsCard } from "@/app/patient/components";
import { BackButton } from "@/components/buttons";

export default function TriageHistory() {
  const { navigateTo } = useNavigation();

  return (
    <>
      <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
        <MainGrid item lg={2}>
          <PersonalDetailsCard />
        </MainGrid>
        <MainGrid item lg={6}>
          <MainPaper elevation={0} sx={{ p: "1ch" }}>
            <BackButton />
            <>
              <MainButton
                title={"Start Triage"}
                onClick={() => navigateTo("/triage/1/start")}
              />
              <TriageHistoryList />
            </>
          </MainPaper>
        </MainGrid>
        <MainGrid item lg={3}>
          <ViewTriageResults />
        </MainGrid>
      </MainGrid>
    </>
  );
}

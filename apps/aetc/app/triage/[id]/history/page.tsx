"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { TriageHistoryList, ViewTriageResults } from "../../components";
import { MainButton } from "shared-ui/src";
import { useNavigation } from "@/hooks";

export default function TriageHistory() {
  const { navigateTo } = useNavigation();
  return (
    <MiddlePageLayout
      leftGridSize={1}
      rightGridSize={3}
      title="Triage History"
      rightChildComponent={<ViewTriageResults />}
    >
      <>
        <MainButton
          title={"Start Triage"}
          onClick={() => navigateTo("/triage/start")}
        />
        <TriageHistoryList />
      </>
    </MiddlePageLayout>
  );
}

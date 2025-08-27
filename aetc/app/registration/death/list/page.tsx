"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { BroughtInDeadList } from "../../components";
import { MainButton } from "@/components";
import { useNavigation } from "@/hooks";

export default function DeathList() {
  const { navigateTo } = useNavigation();
  return (
    <MiddlePageLayout
      leftGridSize={1}
      middleGridSize={10}
      title="Brought in Dead"
      showBackButton={false}
    >
      <MainButton
        title={"create"}
        onClick={() => navigateTo("/registration/death")}
      />
      <BroughtInDeadList />
    </MiddlePageLayout>
  );
}

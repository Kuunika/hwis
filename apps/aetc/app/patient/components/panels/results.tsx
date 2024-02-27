import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { Panel } from ".";
import { useEffect, useState } from "react";
import { LabResultsTable } from "./labResults";

export const Results = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel title="Results">
      <LabResultsTable rows={[]} />
    </Panel>
  );
};

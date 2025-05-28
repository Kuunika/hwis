import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { Panel } from ".";
import { useEffect, useState } from "react";
import { LabResultsTable } from "./labResults";
import { BedsideResults } from "./bedsideResults";
import { AccordionComponent } from "@/components/accordion";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters } from "@/constants";

export const Results = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { params } = useParameters();
  const patientId = params.id as string;
  const { data: BedSideResults, isLoading: bedsideLoading } = getPatientsEncounters( patientId, `encounter_type=${encounters.BEDSIDE_INVESTIGATION_PLAN}`);
  const [bedsideResults, setBedsideResults] = useState<any[]>([]);
  useEffect(() => {

    if (!bedsideLoading && BedSideResults) {
      setBedsideResults(BedSideResults?.[0]?.obs ?? []);
    }
  }, [BedSideResults]);

    const sections = [
      {
        id: "bedsideResults",
        title: "Bedside Results",
        content: <BedsideResults data={bedsideResults}/>,
      },
      {
        id: "labResults",
        title: "Lab Results",
        content: <LabResultsTable rows={[]} />,
      },
    ];
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
      <AccordionComponent sections={sections} />
    </Panel>
  );
};

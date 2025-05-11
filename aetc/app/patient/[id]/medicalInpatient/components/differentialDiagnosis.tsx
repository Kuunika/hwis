import ECTReactComponent from "@/components/form/ECTReactComponent";
import { useState } from "react";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";
import { concepts } from "@/constants";
import OfflineICD11Selection from "@/components/form/offLineICD11Diagnosis";
import { useServerTime } from "@/contexts/serverTimeContext";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

export const DifferentialDiagnosis = ({
  onSubmit,
  loading,
}: {
  onSubmit: (values: any) => void;
  loading: boolean;
}) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>([]);
  const { ServerTime } = useServerTime();

  const handleClick = () => {
    const obsDatetime = ServerTime.getServerTimeString();
    const diagnosisObs = selectedDiagnosis.map((diagnosis: any) => {
      return {
        concept: concepts.DIFFERENTIAL_DIAGNOSIS,
        value: `${diagnosis.code}-${diagnosis.diagnosis}`,
        obsDatetime,
      };
    });

    onSubmit([
      {
        concept: concepts.DIFFERENTIAL_DIAGNOSIS,
        value: concepts.DIFFERENTIAL_DIAGNOSIS,
        obsDatetime,
        groupMembers: diagnosisObs,
      },
    ]);
  };
  const handleAddDiagnosis = (selectedCondition: any) => {
    setSelectedDiagnosis((prevDiagnosis: any) => [
      ...prevDiagnosis,
      selectedCondition,
    ]);
  };

  return (
    <>
      <ContainerLoaderOverlay loading={loading}>
        <MinimalTable
          columns={[
            { label: "Code", field: "code" },
            { label: "Diagnosis", field: "diagnosis" },
          ]}
          data={selectedDiagnosis}
        />
        <br />
        <OfflineICD11Selection
          width="100%"
          label={"Diagnosis"}
          onSelection={handleAddDiagnosis}
        />
        <br />
        <Button variant="contained" onClick={handleClick}>
        Submit
        </Button>
      </ContainerLoaderOverlay>
    </>
  );
};

import { MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";

import { PrescribedMedicationList } from "../../[id]/nursingChart/components/prescribedMedicationList";

export const Medications = () => {
  return (
    <Panel title="Medications">
      <br />
      <PrescribedMedicationList />
    </Panel>
  );
};

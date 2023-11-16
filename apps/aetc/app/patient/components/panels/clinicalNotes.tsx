import { ReactNode } from "react";
import { Panel } from ".";

type Props = {
  children: ReactNode;
};
export const ClinicalNotes = ({ children }: Props) => {
  return (
    <Panel title="Clinical Notes">
      <>Clinical Notes</>
    </Panel>
  );
};

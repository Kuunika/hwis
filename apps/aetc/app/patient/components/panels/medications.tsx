import { ReactNode } from "react";
import { Panel } from ".";

type Props = {
  children: ReactNode;
};
export const Medications = ({ children }: Props) => {
  return (
    <Panel title="Medications">
      <>Medication</>
    </Panel>
  );
};

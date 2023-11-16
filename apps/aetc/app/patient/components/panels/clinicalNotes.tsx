import { FC, ReactNode } from "react";
import { MainTypography, WrapperBox } from "shared-ui/src";
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

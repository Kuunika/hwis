import { ReactNode } from "react";
import { Panel } from ".";

type Props = {
  children: ReactNode;
};
export const Results = ({ children }: Props) => {
  return (
    <Panel title="Results">
      <>Result</>
    </Panel>
  );
};

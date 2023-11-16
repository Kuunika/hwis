import { ReactNode } from "react";
import { Panel } from ".";

type Props = {
  children: ReactNode;
};
export const Investigations = ({ children }: Props) => {
  return (
    <Panel title="Investigations">
      <>Investigations</>
    </Panel>
  );
};

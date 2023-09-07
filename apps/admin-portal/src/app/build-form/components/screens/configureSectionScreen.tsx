import { FC } from "react";
import { Section, SideSectionList } from "..";
import { WrapperBox } from "shared-ui/src";
type Prop = {
  sections: Section[];
};
export const ConfigureSectionScreen: FC<Prop> = ({ sections }) => {
  return (
    <WrapperBox>
      <SideSectionList sections={sections} onClick={() => {}} />
    </WrapperBox>
  );
};

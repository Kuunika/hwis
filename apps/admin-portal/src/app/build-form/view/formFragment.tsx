import { FC } from "react";

import { Frag } from "@/contexts";
import { ViewFormFragment } from "@/components";

type Prop = {
  frag: Frag;
  onSubmit: (values: any) => void;
};
export const FormFragment: FC<Prop> = ({ frag, onSubmit }) => {
  return <ViewFormFragment frag={frag} onSubmit={onSubmit} />;
};

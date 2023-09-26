import { ReactNode, FC } from "react";
import { WrapperBox } from "shared-ui/src";
type Prop = {
  children: ReactNode;
};

export const TextPill: FC<Prop> = ({ children }) => {
  return (
    <WrapperBox
      sx={{
        mt: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        px: 1,
        backgroundColor: "#F4F4F4",
        borderRadius: "5px",
      }}
    >
      {children}
    </WrapperBox>
  );
};

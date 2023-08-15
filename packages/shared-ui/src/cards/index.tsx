import { Card, CardContent } from "@mui/material";
import { FC, ReactNode } from "react";

type Prop = {
  children: ReactNode;
};
export const MainCard: FC<Prop> = ({ children }) => {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

import { ReactNode } from "react";
import { MainGrid } from "..";

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <MainGrid container>
      <MainGrid item lg={1}></MainGrid>
      <MainGrid item lg={10}>
        <br />
        <br />
        {children}
      </MainGrid>
    </MainGrid>
  );
};

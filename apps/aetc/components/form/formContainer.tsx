'use client'
import { ReactNode } from "react";
import { MainGrid } from "../";

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <MainGrid container>
      <MainGrid item xs={0} lg={1}></MainGrid>
      <MainGrid item xs={12} lg={10}>
        <br />
        <br />
        {children}
      </MainGrid>
    </MainGrid>
  );
};

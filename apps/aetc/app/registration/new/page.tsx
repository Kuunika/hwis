"use client";
import {
  FormContainer,
  MainCard,
  MainGrid,
  MainTypography,
} from "shared-ui/src";
import { NewRegistrationFlow } from "../components";

export default function () {
  return (
    <MainGrid container>
      <MainGrid item lg={4}></MainGrid>
      <MainGrid
        item
        lg={4}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <br />
        <br />
        <NewRegistrationFlow />
      </MainGrid>
      <MainGrid item lg={4}></MainGrid>
    </MainGrid>
  );
}

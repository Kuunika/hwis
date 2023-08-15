"use client";
import { Button, Header } from "ui";
import { MainButton } from "shared-ui/src";

export default function Page() {
  return (
    <>
      <Header text="Web" />
      <Button />
      <MainButton
        title="Primary"
        variant="secondary"
        onClick={() => console.log("test")}
      />
    </>
  );
}

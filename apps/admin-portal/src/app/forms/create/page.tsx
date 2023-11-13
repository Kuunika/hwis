"use client";
import { BackButton } from "@/components/common";
import { ConfigureSectionScreen } from "@/components/screens";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MainPaper } from "shared-ui/src";

export default function CreateForm() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
        <BackButton />
        <br />
        <br />
        <ConfigureSectionScreen />
      </MainPaper>
    </DndProvider>
  );
}

import { Section } from "@/app/contexts/sections";
import { FC, useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { MainTypography, WrapperBox, defaultTheme } from "shared-ui/src";
import { Container } from "../drag/container";

type Prop = {
  sections: Section[];
  onDelete: (id: string) => void;
  onMove: (id: string, value: number) => void;
};
export const SectionList: FC<Prop> = ({ sections, onDelete, onMove }) => {
  const sectionDragItems = sections.map((section) => ({
    id: section.id,
    component: <ListItem section={section} onDelete={onDelete} />,
  }));
  return (
    <WrapperBox sx={{ mt: 1 }}>
      {<Container items={sectionDragItems} onMove={onMove} />}
    </WrapperBox>
  );
};

const ListItem = ({
  section,
  onDelete,
}: {
  section: Section;
  onDelete: (id: string) => void;
}) => {
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
      key={section.id}
    >
      <WrapperBox>
        <MainTypography fontWeight={"800"}>
          {section.fragmentName}
        </MainTypography>
        <MainTypography variant="subtitle1">
          {section.dataElements.length} Data Element(s)
        </MainTypography>
      </WrapperBox>
      <MainTypography
        onClick={() => onDelete(section.id)}
        sx={{ cursor: "pointer" }}
      >
        <FaCircleXmark />
      </MainTypography>
    </WrapperBox>
  );
};

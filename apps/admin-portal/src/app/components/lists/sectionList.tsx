import { Section } from "@/app/contexts/sections";
import { FC, useState, useEffect } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { MainTypography, WrapperBox, defaultTheme } from "shared-ui/src";
import { Container } from "../drag/container";

type Prop = {
  sections: Section[];
  onDelete: (id: string) => void;
  onMove: (id: string, value: number, index2: number) => void;
};
export const SectionList: FC<Prop> = ({ sections, onDelete, onMove }) => {
  const [sectionList, setSectionList] = useState(sections);

  useEffect(() => {
    setSectionList(sections);
  }, [sections]);

  const sectionDragItems = sectionList.map((section) => ({
    id: section.id,
    component: (
      <ListItem
        id={section.id}
        title={section.fragmentName}
        subTitle={`${section.dataElements.length} Data Element(s)`}
        onDelete={onDelete}
      />
    ),
  }));
  return (
    <WrapperBox sx={{ mt: 1 }}>
      {<Container items={sectionDragItems} onMove={onMove} />}
    </WrapperBox>
  );
};

export const ListItem = ({
  id,
  title,
  onDelete,
  subTitle,
}: {
  id: string;
  title: string;
  subTitle: string | number;
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
      key={id}
    >
      <WrapperBox>
        <MainTypography fontWeight={"800"}>{title}</MainTypography>
        <MainTypography variant="subtitle1">{subTitle}</MainTypography>
      </WrapperBox>
      <MainTypography onClick={() => onDelete(id)} sx={{ cursor: "pointer" }}>
        <FaCircleXmark />
      </MainTypography>
    </WrapperBox>
  );
};

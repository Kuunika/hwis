import { Section } from "@/app/contexts/sections";
import { FC } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { MainTypography, WrapperBox, defaultTheme } from "shared-ui/src";

type Prop = {
  sections: Section[];
  onDelete: (id: string) => void;
};
export const SectionList: FC<Prop> = ({ sections, onDelete }) => {
  return (
    <WrapperBox sx={{ mt: 1 }}>
      {sections.map((section) => {
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
      })}
    </WrapperBox>
  );
};

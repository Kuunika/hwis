import { FC } from "react";
import { MainTypography, WrapperBox, defaultTheme } from "shared-ui/src";
import { Section } from ".";

type Prop = {
  sections: Section[];
  onClick: (id: string) => void;
};
export const SideSectionList: FC<Prop> = ({ sections, onClick }) => {
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
              //   backgroundColor: "#F4F4F4",
              borderRadius: "5px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#F4F4F4",
              },
            }}
            key={section.id}
          >
            <WrapperBox>
              <MainTypography>{section.fragmentName}</MainTypography>
              <MainTypography variant="subtitle2" fontStyle={"italic"}>
                {section.dataElements.length} Data Element(s)
              </MainTypography>
            </WrapperBox>
          </WrapperBox>
        );
      })}
    </WrapperBox>
  );
};

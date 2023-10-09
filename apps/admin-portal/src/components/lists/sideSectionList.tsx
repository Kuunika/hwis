import { SectionContext, SectionContextType } from "@/contexts";
import { FC, useContext, useEffect } from "react";
import { MainTypography, WrapperBox, defaultTheme } from "shared-ui/src";

export const SideSectionList: FC = () => {
  const { sections, setActiveSection } = useContext(
    SectionContext
  ) as SectionContextType;

  useEffect(() => {
    setActiveSection(sections[0].id);
  }, []);

  return (
    <WrapperBox>
      {sections.map((section) => {
        return (
          <WrapperBox
            onClick={() => setActiveSection(section.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
              px: 1,
              backgroundColor: section.active ? "#F4F4F4" : "",
              borderRadius: "5px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#F4F4F4",
              },
            }}
            key={section.id}
          >
            <WrapperBox>
              <MainTypography fontWeight={section.active ? "800" : ""}>
                {section.fragmentName}
              </MainTypography>
              <MainTypography
                fontWeight={section.active ? "600" : ""}
                variant="subtitle2"
                fontStyle={"italic"}
              >
                {section.dataElements.length} Data Element(s)
              </MainTypography>
            </WrapperBox>
          </WrapperBox>
        );
      })}
    </WrapperBox>
  );
};

import React from "react";

interface Child {
  item: string | { [key: string]: string };
  children?: Child[];
}

export interface ClinicalNotesDataType {
  heading: string;
  children: Child[];
}

interface Props {
  title: string;
  data: ClinicalNotesDataType[];
}

const renderItem = (item: string | { [key: string]: string }) => {
  if (typeof item === "string") return item;
  return Object?.entries(item)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

const RenderChildren: React.FC<{ children: Child[]; level?: number }> = ({
  children,
  level = 1,
}) => {
  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      {children.map((child, index) => (
        <div key={index} style={{ marginBottom: "4px" }}>
          <div>- {renderItem(child.item)}</div>
          {child.children && child.children.length > 0 && (
            <RenderChildren children={child.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

export const DisplayInformation: React.FC<Props> = ({ title, data }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h3>
        <strong>{title}</strong>
      </h3>
      <div style={{ marginLeft: "20px" }}>
        {data.map((section, index) => (
          <div key={index} style={{ marginTop: "1rem" }}>
            <strong>- {section.heading}</strong>
            <RenderChildren children={section.children} />
          </div>
        ))}
      </div>
    </div>
  );
};

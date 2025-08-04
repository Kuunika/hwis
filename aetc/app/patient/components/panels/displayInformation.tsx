import React from "react";

// Types
interface Child {
  item: string | { [key: string]: string } | null | undefined;
  children?: Child | Child[] | null | undefined;
}

export interface ClinicalNotesDataType {
  heading?: string | null;
  children?: Child | Child[] | null | undefined;
}

interface Props {
  title?: string;
  data?: ClinicalNotesDataType[] | null;
}

// Helper to render an item (string or object)
const renderItem = (
  item: string | { [key: string]: string } | null | undefined
): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return Object.entries(item)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

// Recursive rendering of children
const RenderChildren: React.FC<{
  children?: Child | Child[] | null | undefined;
  level?: number;
}> = ({ children, level = 1 }) => {
  const normalizedChildren: Child[] = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  if (normalizedChildren.length === 0) return null;

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      {normalizedChildren.map((child, index) => {
        const itemText = renderItem(child?.item);

        return (
          <div key={index} style={{ marginBottom: "4px" }}>
            {itemText && <div>- {itemText}</div>}
            {child?.children && (
              <RenderChildren children={child.children} level={level + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Main display component
export const DisplayInformation: React.FC<Props> = ({
  title = "Information",
  data = [],
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h3>
        <strong>{title}</strong>
      </h3>
      <div style={{ marginLeft: "20px" }}>
        {data.map((section, index) => (
          <div key={index} style={{ marginTop: "1rem" }}>
            <strong>- {section?.heading || "Untitled Section"}</strong>
            <RenderChildren children={section?.children} />
          </div>
        ))}
      </div>
    </div>
  );
};

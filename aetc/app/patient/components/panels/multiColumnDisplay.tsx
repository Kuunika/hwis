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

// Recursive children renderer
const RenderChildren: React.FC<{
  children?: Child | Child[] | null | undefined;
  level?: number;
}> = ({ children, level = 1 }) => {
  const normalizedChildren: Child[] = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  if (!normalizedChildren.length) return null;

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      {normalizedChildren.map((child, index) => {
        const itemText = !child?.item
          ? ""
          : typeof child.item === "string"
            ? child.item
            : Object.entries(child.item)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

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

interface MultiColumnNotesProps {
  data?: Array<{
    title: string;
    content: ClinicalNotesDataType[] | React.ReactNode | null;
  }> | null;
  columns?: number; // default 2
}

export const MultiColumnNotes: React.FC<MultiColumnNotesProps> = ({
  data = [],
  columns = 2,
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "1rem",
          border: "1px solid #ddd",
        }}
      >
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div
            key={colIdx}
            style={{
              padding: "0 1rem",
              borderLeft: colIdx > 0 ? "1px solid #ddd" : "none",
            }}
          >
            {data
              .filter((_, idx) => idx % columns === colIdx)
              .map((sectionGroup, idx) => (
                <div key={idx} style={{ marginBottom: "2rem" }}>
                  {/* Section title inside the column */}
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    <strong>{sectionGroup.title}</strong>
                  </h4>

                  {/* Render content */}
                  {sectionGroup.content && (
                    <>
                      {Array.isArray(sectionGroup.content) ? (
                        sectionGroup.content.map((section, sIdx) => (
                          <div key={sIdx} style={{ marginBottom: "1rem" }}>
                            <strong>
                              - {section?.heading || "Untitled Section"}
                            </strong>
                            <RenderChildren children={section?.children} />
                          </div>
                        ))
                      ) : (
                        <div>{sectionGroup.content}</div>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

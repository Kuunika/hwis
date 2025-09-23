import React from "react";

// Types
interface Child {
  item: string | { [key: string]: string } | null | undefined;
  children?: Child | Child[] | null | undefined;
}

export interface ClinicalNotesDataType {
  heading?: string | null;
  children?: Child | Child[] | null | undefined;
  user?: string;
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
        }}
      >
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx}>
            {data
              .filter((_, idx) => idx % columns === colIdx)
              .map((sectionGroup, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "2rem",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    padding: "1rem",
                  }}
                >
                  {/* Section title inside the card */}
                  <h4 style={{ marginBottom: "0.5rem" }}>
                    <strong>{sectionGroup.title}</strong>
                  </h4>

                  {/* Render content */}
                  {sectionGroup.content && (
                    <>
                      {Array.isArray(sectionGroup.content) ? (
                        sectionGroup.content.map((section, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              marginBottom: "1rem",
                              padding: "0.75rem",
                              background: "#f9f9f9",
                              borderRadius: "6px",
                            }}
                          >
                          { section?.heading && <strong>
                              - {section?.heading || "Untitled Section"}
                            </strong>}
                            <RenderChildren children={section?.children} />
                            <div
                              style={{
                                color: "#7f8c8d",
                                fontSize: "14px",
                                letterSpacing: "0.2px",
                                marginTop: "8px",
                                fontStyle: "italic",
                              }}
                            >
                              {section.user}
                            </div>
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

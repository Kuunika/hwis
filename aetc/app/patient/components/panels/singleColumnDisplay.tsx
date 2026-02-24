import React from "react";

// Types
interface Child {
    item: string | { [key: string]: string } | null | undefined;
    bold?: boolean;
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
                let itemText: React.ReactNode = null;

                if (typeof child?.item === "string") {
                    itemText = child.bold ? <strong>{child.item}</strong> : child.item;
                } else if (child?.item && typeof child.item === "object") {
                    itemText = (
                        <>
                            {Object.entries(child.item).map(([key, value], i, arr) => (
                                <span key={i}>
                                    {child.bold ? <strong>{key}</strong> : key}: {value}
                                    {i < arr.length - 1 && ", "}
                                </span>
                            ))}
                        </>
                    );
                }

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

interface SingleColumnNotesProps {
    data?: Array<{
        title: string;
        content: ClinicalNotesDataType[] | React.ReactNode | null;
    }> | null;
}

export const SingleColumnNotes: React.FC<SingleColumnNotesProps> = ({
    data = [],
}) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.6,
                maxWidth: "100%",
                padding: "1rem"
            }}
        >
            {data.map((sectionGroup, idx) => (
                <div
                    key={idx}
                    style={{
                        marginBottom: "1.5rem",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        padding: "1rem",
                        // pageBreakInside: "avoid",
                    }}
                >
                    {/* Section title */}
                    <h3
                        style={{
                            marginBottom: "0.75rem",
                            borderBottom: "2px solid #e0e0e0",
                            paddingBottom: "0.5rem",
                            fontSize: "18px",
                            fontWeight: "bold"
                        }}
                    >
                        {sectionGroup.title}
                    </h3>

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
                                            borderLeft: "3px solid #3498db",
                                        }}
                                    >
                                        {section?.heading && (
                                            <div style={{
                                                marginBottom: "0.5rem",
                                                fontSize: "16px",
                                                fontWeight: "600"
                                            }}>
                                                - {section?.heading}
                                            </div>
                                        )}
                                        <RenderChildren children={section?.children} />
                                        {section.user && (
                                            <div
                                                style={{
                                                    color: "#7f8c8d",
                                                    fontSize: "14px",
                                                    letterSpacing: "0.2px",
                                                    marginTop: "8px",
                                                    fontStyle: "italic",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {section.user}
                                            </div>
                                        )}
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
    );
};
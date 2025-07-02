import { Box, Typography } from "@mui/material";

export const InvestigationPlanNotes = (children: any) => {
  // Group children by their parent value
  const groupedChildren: Record<string, any[]> = {};

  children.forEach((child: any) => {
    const parentValue = child.parent?.value || "Other";
    if (!groupedChildren[parentValue]) {
      groupedChildren[parentValue] = [];
    }
    groupedChildren[parentValue].push(child);
  });

  // Render each parent value as a group
  return Object.entries(groupedChildren).map(
    ([parentValue, childItems], index) => (
      <Box
        key={`child-group-${index}`}
        className="clinical-note-group"
        sx={{
          marginBottom: "16px",
          borderBottom:
            index < Object.keys(groupedChildren).length - 1
              ? "1px solid #e0e0e0"
              : "none",
          paddingBottom: "16px",
          display: "flex",
        }}
      >
        {/* Left side: Parent Value */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "#3a3a3a",
            width: "30%",
            paddingRight: "8px",
            display: "flex",
            alignItems: "center",
            height: "24px",
          }}
        >
          <Box component="span" sx={{ flexGrow: 1 }}>
            {parentValue}
          </Box>
        </Typography>

        {/* Center separator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "24px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#777",
              fontWeight: 400,
              fontSize: "1.5rem",
              lineHeight: 1,
            }}
          >
            :
          </Typography>
        </Box>

        {/* Right side: Child names and values */}
        <Box sx={{ width: "calc(70% - 40px)" }}>
          {childItems.map((child, itemIndex) => {
            const childName =
              child.names && child.names[0]?.name ? child.names[0].name : "";
            return (
              <Box
                key={`child-value-${index}-${itemIndex}`}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: itemIndex < childItems.length - 1 ? "10px" : 0,
                  height: itemIndex === 0 ? "24px" : "auto",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    minWidth: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#3f51b5",
                    marginRight: "10px",
                    marginTop: itemIndex === 0 ? "10px" : "8px",
                    display: childItems.length > 1 ? "block" : "none",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    textAlign: "left",
                    lineHeight: "1.5",
                    paddingTop: itemIndex === 0 ? "2px" : 0,
                    fontWeight: "600",
                    display: "inline",
                  }}
                >
                  {childName}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    )
  );
};

import React from "react";
import { Box, Typography } from "@mui/material";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

interface Name {
    name: string;
    [key: string]: any; // Allow other properties
}

interface Observation {
    obs_id: number;
    names: Name[];
    value: string;
    children?: Observation[];
    created_by?: string;
    obs_datetime?: string;
}

interface SecondarySurveyProps {
    data: Observation[];
}

export const HeadAndNeck: React.FC<SecondarySurveyProps> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Function to render timestamp
    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography
                sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}
            >
                ~ {panelData[0].created_by} -{" "}
                {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    // Separate General Information from Head & Neck data
    const generalInfo = data.filter(item =>
        item?.names?.[0]?.name === "Additional Notes"
    );

    const headAndNeckData = data.filter(item =>
        item?.names?.[0]?.name === "Image Part Name" &&
        item.children &&
        item.children.length > 0
    );

    // Function to render a single region with its abnormalities
    const renderRegion = (regionName: string, items: Observation[]) => {
        return (
            <Box key={regionName} sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {regionName}
                </Typography>

                {/* Render abnormalities list */}
                <Box component="span" sx={{ display: "inline-block", mb: 1 }}>
                    {items
                        .filter(item => item?.names?.[0]?.name === "Abnormalities")
                        .map((abnormality, index, arr) => (
                            <React.Fragment key={`ab-${abnormality.obs_id}`}>
                                {abnormality.value}
                                {index < arr.length - 1 ? ", " : ""}
                            </React.Fragment>
                        ))}
                </Box>

                {/* Laceration details */}
                {items.some(item => item?.names?.[0]?.name === "Laceration length") && (
                    <Box sx={{ ml: 2 }}>
                        {items
                            .filter(item => item?.names?.[0]?.name === "Laceration length")
                            .map(laceration => (
                                <Typography key={`len-${laceration.obs_id}`} variant="body2">
                                    Laceration Length: {laceration.value}
                                </Typography>
                            ))}

                        {items
                            .filter(item => item?.names?.[0]?.name === "Laceration depth")
                            .map(laceration => (
                                <Typography key={`dep-${laceration.obs_id}`} variant="body2">
                                    Laceration Depth: {laceration.value}
                                </Typography>
                            ))}

                        {items
                            .filter(item => item?.names?.[0]?.name === "Laceration other")
                            .map(laceration => (
                                <Typography key={`desc-${laceration.obs_id}`} variant="body2">
                                    Laceration Descriptor: {laceration.value}
                                </Typography>
                            ))}
                    </Box>
                )}

                {/* Bruise description */}
                {items
                    .filter(item => item?.names?.[0]?.name === "Description")
                    .map(desc => (
                        <Box key={`desc-${desc.obs_id}`} sx={{ ml: 2 }}>
                            <Typography variant="body2">
                                Description: {desc.value}
                            </Typography>
                        </Box>
                    ))}

                {/* Pupil size */}
                {items
                    .filter(item => item?.names?.[0]?.name === "Pupil size")
                    .map(pupil => (
                        <Box key={`pupil-${pupil.obs_id}`} sx={{ ml: 2 }}>
                            <Typography variant="body2">
                                Pupil Size: {pupil.value} mm
                            </Typography>
                        </Box>
                    ))}

                {/* Fundoscopy findings */}
                {items
                    .filter(item => item?.names?.[0]?.name === "Fundoscopy" && item.value === "Yes")
                    .map(fundoscopy => (
                        <Box key={`fund-${fundoscopy.obs_id}`} sx={{ ml: 2 }}>
                            <Typography variant="body2">
                                Fundoscopy Findings: Present
                            </Typography>
                        </Box>
                    ))}

                {/* Other specifications */}
                {items
                    .filter(item => item?.names?.[0]?.name === "Specify")
                    .map(specify => (
                        <Box key={`spec-${specify.obs_id}`} sx={{ ml: 2 }}>
                            <Typography variant="body2">
                                Other: {specify.value}
                            </Typography>
                        </Box>
                    ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>

            {/* General Information */}
            {generalInfo.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    {generalInfo.map((item, index) => (
                        <Typography key={`general-info-${index}`} variant="body2">
                            {item.value}
                        </Typography>
                    ))}
                </Box>
            )}

            {/* Head and Neck Assessment */}
            {headAndNeckData.length > 0 && (
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Head and Neck
                    </Typography>

                    {headAndNeckData.map((parentItem, parentIndex) => {
                        // Group children by region
                        const regions = new Map<string, Observation[]>();
                        console.log("Ma regions", regions);

                        parentItem.children?.forEach((child: Observation) => {
                            if (child?.value && !regions.has(child.value)) {
                                regions.set(child.value, []);
                            }

                            child.children?.forEach((grandChild: Observation) => {
                                regions.get(child.value!)?.push(grandChild);
                            });
                        });

                        return (
                            <Box key={`head-neck-group-${parentIndex}`}>
                                {Array.from(regions.entries()).map(([region, items]) => (
                                    renderRegion(region, items)
                                ))}
                            </Box>
                        );
                    })}
                </Box>
            )}

            {renderTimestamp(data)}
        </Box>
    );
};
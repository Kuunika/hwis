import React from "react";
import { Box, Typography } from "@mui/material";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

interface Name {
    name: string;
    [key: string]: any;
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

    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {panelData[0].created_by} -{" "}
                {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    const headAndNeckData = data.filter(item =>
        item?.names?.[0]?.name === "Image Part Name" &&
        item.children &&
        item.children.length > 0
    );

    const getDescriptionForAbnormality = (abnormality: Observation, items: Observation[]) => {
        const abnormalityIndex = items.findIndex(item => item.obs_id === abnormality.obs_id);
        if (abnormalityIndex === -1) return null;

        for (let i = abnormalityIndex + 1; i < items.length; i++) {
            const item = items[i];
            if (item.names[0].name === "Description") {
                return item.value;
            }
            if (item.names[0].name === "Abnormalities") {
                break;
            }
        }
        return null;
    };

    const renderAbnormalityDetails = (abnormality: Observation, items: Observation[]) => {
        const description = getDescriptionForAbnormality(abnormality, items);
        const isLaceration = abnormality.value.toLowerCase().includes("laceration");
        const isOther = abnormality.value.toLowerCase().includes("other");
        const isBruise = abnormality.value.toLowerCase().includes("bruise");
        const isEyelid = abnormality.value.toLowerCase().includes("eyelid");

        if (isLaceration) {
            const length = items.find(item => item?.names?.[0]?.name === "Laceration length");
            const depth = items.find(item => item?.names?.[0]?.name === "Laceration depth");
            const descriptor = items.find(item => item?.names?.[0]?.name === "Laceration other");

            return (
                <Box sx={{ ml: 3 }}>
                    <Typography variant="body2">- {abnormality.value}</Typography>
                    {length && (
                        <Typography variant="body2" sx={{ ml: 3 }}>
                            - Length: {length.value}
                        </Typography>
                    )}
                    {depth && (
                        <Typography variant="body2" sx={{ ml: 3 }}>
                            - Depth: {depth.value}
                        </Typography>
                    )}
                    {descriptor && (
                        <Typography variant="body2" sx={{ ml: 3 }}>
                            - Description: {descriptor.value}
                        </Typography>
                    )}
                </Box>
            );
        }

        if (isOther) {
            const otherDescription = items.find(item =>
                (item?.names?.[0]?.name === "Other" ||
                    item?.names?.[0]?.name === "Specify") &&
                item.obs_id !== abnormality.obs_id
            );

            return (
                <Box sx={{ ml: 3 }}>
                    <Typography variant="body2">- {abnormality.value}</Typography>
                    {otherDescription && (
                        <Typography variant="body2" sx={{ ml: 3 }}>
                            - Description: {otherDescription.value}
                        </Typography>
                    )}
                </Box>
            );
        }

        if (isBruise || isEyelid) {
            return (
                <Box sx={{ ml: 3 }}>
                    <Typography variant="body2">- {abnormality.value}</Typography>
                    {description && (
                        <Typography variant="body2" sx={{ ml: 3 }}>
                            - Description: {description}
                        </Typography>
                    )}
                </Box>
            );
        }

        return (
            <Box sx={{ ml: 3 }}>
                <Typography variant="body2">- {abnormality.value}</Typography>
                {description && (
                    <Typography variant="body2" sx={{ ml: 3 }}>
                        - Description: {description}
                    </Typography>
                )}
            </Box>
        );
    };

    const renderRegion = (regionName: string, items: Observation[]) => {
        const abnormalities = items.filter(item => item?.names?.[0]?.name === "Abnormalities");
        const pupilSize = items.find(item => item?.names?.[0]?.name === "Pupil size");
        const fundoscopy = items.find(item => item?.names?.[0]?.name === "Fundoscopy");
        const fundoscopyFindings = items.find(item =>
            item?.names?.[0]?.name === "Fundoscopy findings" ||
            (item?.names?.[0]?.name === "Description" &&
                abnormalities.some(ab => ab.obs_id < item.obs_id))
        );

        return (
            <Box key={regionName} sx={{ ml: 3, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    - {regionName}
                </Typography>

                {pupilSize && (
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="body2">- Pupil Size: {pupilSize.value} mm</Typography>
                    </Box>
                )}

                {abnormalities.length > 0 && (
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="body2">- Abnormalities:</Typography>
                        <Box sx={{ ml: 3 }}>
                            {abnormalities.map(abnormality => (
                                <React.Fragment key={`ab-${abnormality.obs_id}`}>
                                    {renderAbnormalityDetails(abnormality, items)}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                )}

                {fundoscopy && (
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="body2">- Fundoscopy Done: {fundoscopy.value === "Yes" ? "Yes" : "No"}</Typography>
                        {/*{fundoscopy.value === "Yes" && fundoscopyFindings && (*/}
                        {/*    <Typography variant="body2" sx={{ ml: 3 }}>*/}
                        {/*        - Findings: {fundoscopyFindings.value}*/}
                        {/*    </Typography>*/}
                        {/*)}*/}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            {headAndNeckData.length > 0 && (
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        Head and Neck
                    </Typography>

                    {headAndNeckData.map((parentItem, parentIndex) => {
                        const regions = new Map<string, Observation[]>();
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
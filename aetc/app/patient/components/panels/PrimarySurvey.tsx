// import React from "react";
// import { Typography, Grid, Box } from "@mui/material";
// import { concepts } from "@/constants";

// interface Field {
//   name: string;
//   value: string;
//   parent?: string;
// }

// interface PrimarySurveyProps {
//   panelData: any[];
//   renderTimestamp: (panelData: any) => React.ReactNode;
// }

// export const PrimarySurvey = ({ panelData, renderTimestamp }: PrimarySurveyProps) => {
//   const categorizeField = (fieldName: string) => {
//     const name = fieldName.toLowerCase();

//     if (
//       fieldName === concepts.AIRWAY_PATENT ||
//       fieldName === concepts.PATIENT_INJURED  || fieldName === concepts.SECRETION || fieldName === concepts.TONGUE_SWELLING ||
//       fieldName === concepts.NECK_HAEMATOMA || fieldName === concepts.TONGUE_FALLING_BACK || fieldName === concepts.OTHER
//     ) {
//       return "core";
//     }

//     if (
//       name.includes("airway") ||
//       name.includes("neck collar") ||
//       name.includes("head blocks") ||
//       name.includes("c-spine") ||
//       name.includes("jaw thrust") ||
//       name.includes("suction")
//     ) {
//       return "airway";
//     }

//     if (
//       name.includes("breathing") ||
//       name.includes("respiratory") ||
//       name.includes("oxygen") ||
//       name.includes("saturation") ||
//       name.includes("trachea") ||
//       name.includes("chest") ||
//       name.includes("percussion") ||
//       name.includes("lung")
//     ) {
//       return "breathing";
//     }

//     if (
//       name.includes("pulse") ||
//       name.includes("blood pressure") ||
//       name.includes("bleeding") ||
//       name.includes("intravenous") ||
//       name.includes("catheter") ||
//       name.includes("circulation")
//     ) {
//       return "circulation";
//     }

//     if (
//       name.includes("consciousness") ||
//       name.includes("glasgow") ||
//       name.includes("pupil") ||
//       name.includes("neurological") ||
//       name.includes("headache") ||
//       name.includes("disability")
//     ) {
//       return "disability";
//     }

//     if (
//       name.includes("temperature") ||
//       name.includes("exposure") ||
//       name.includes("trauma") ||
//       name.includes("environment") ||
//       name.includes("mucous") ||
//       name.includes("peripheries")
//     ) {
//       return "exposure";
//     }

//     return "other";
//   };

//   const extractAllFields = (panelData: any): Record<string, Field[]> => {
//     const fields: Record<string, Field[]> = {
//       core: [],
//       airway: [],
//       breathing: [],
//       circulation: [],
//       disability: [],
//       exposure: [],
//       other: []
//     };

//     if (!panelData || !Array.isArray(panelData)) return fields;

//     panelData.forEach((item) => {
//       if (!item) return;

//       if (item.children && Array.isArray(item.children) && item.children.length > 0) {
//         const parentValue = item.value || "";
//         item.children.forEach((child: any) => {
//           if (child?.names?.[0]?.name) {
//             const childName = child.names[0].name;
//             const childValue = child.value || childName;
//             const category = categorizeField(childName);
//             fields[category].push({ name: childName, value: childValue, parent: parentValue });
//           }
//         });
//       } else if (item.names?.[0]?.name) {
//         const fieldName = item.names[0].name;
//         const fieldValue = item.value || "";
//         const category = categorizeField(fieldName);
//         fields[category].push({ name: fieldName, value: fieldValue });
//       }
//     });

//     return fields;
//   };

//   if (!panelData || !Array.isArray(panelData) || panelData.length === 0) {
//     return null;
//   }

//   const fields = extractAllFields(panelData);

//   return (
//     <Box sx={{ p: 2, minHeight: "60px" }}>
//       <Typography
//         variant="subtitle1"
//         fontWeight="bold"
//         sx={{ textDecoration: "underline", marginBottom: 1 }}
//       >
//         Primary Survey
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Column 1: A & B */}
//         <Grid item xs={12} md={4}>
//           {/* A – Airway */}
//           {fields.airway.length > 0 || fields.core.length > 0 ? (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 A – Airway with C-Spine Protection
//               </Typography>

//               {/* Render AIRWAY_PATENT and PATIENT_INJURED specifically */}
//               {fields.core.map((field, index) => {
//                 const lowerValue = field.value?.toLowerCase();
//                 let text = "";

//                 if (field.name === concepts.AIRWAY_PATENT) {
//                   if (lowerValue === "yes") {
//                     text = "Airway is Patent";
//                   } else if (lowerValue === "no") {
//                     text = "Airway is Not Patent";
//                   } else {
//                     text = `Airway is ${field.value}`;
//                   }
//                 } else if (field.name === concepts.PATIENT_INJURED) {
//                   if (lowerValue === "yes") {
//                     text = "Patient is Injured";
//                   } else if (lowerValue === "no") {
//                     text = "Patient is Not Injured";
//                   } else {
//                     text = `Patient is ${field.value}`;
//                   }
//                 }

//                 return (
//                   <Typography key={`core-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                     {text}
//                   </Typography>
//                 );
//               })}

//               {/* Render other airway fields */}
//               {fields.airway.map((field, index) => (
//                 <Typography key={`airway-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           ) : null}

//           {/* B – Breathing */}
//           {fields.breathing.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 B – Breathing
//               </Typography>
//               {fields.breathing.map((field, index) => (
//                 <Typography key={`breathing-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>

//         {/* Column 2: C & D */}
//         <Grid item xs={12} md={4}>
//           {/* C – Circulation */}
//           {fields.circulation.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 C – Circulation
//               </Typography>
//               {fields.circulation.map((field, index) => (
//                 <Typography key={`circ-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}

//           {/* D – Disability */}
//           {fields.disability.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 D – Disability
//               </Typography>
//               {fields.disability.map((field, index) => (
//                 <Typography key={`dis-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>

//         {/* Column 3: E only */}
//         <Grid item xs={12} md={4}>
//           {/* E – Exposure/Environment */}
//           {fields.exposure.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 E – Exposure/Environment
//               </Typography>
//               {fields.exposure.map((field, index) => (
//                 <Typography key={`expo-${index}`} variant="body2" sx={{ ml: 1, mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>
//       </Grid>

//       {renderTimestamp(panelData)}
//     </Box>
//   );
// };




// import React from "react";
// import { Typography, Grid, Box } from "@mui/material";
// import { concepts } from "@/constants";

// interface Field {
//   name: string;
//   value: string;
//   parent?: string;
// }

// interface PrimarySurveyProps {
//   panelData: any[];
//   renderTimestamp: (panelData: any) => React.ReactNode;
// }

// export const PrimarySurvey = ({ panelData, renderTimestamp }: PrimarySurveyProps) => {
//   const categorizeField = (fieldName: string) => {
//     const name = fieldName.toLowerCase();

//     if (fieldName === concepts.AIRWAY_PATENT || fieldName === concepts.PATIENT_INJURED) {
//       return "core";
//     }

//     // These are now categorized as airway reasons
//     if (
//       name.includes("airway") ||
//       name.includes("neck collar") ||
//       name.includes("head blocks") ||
//       name.includes("c-spine") ||
//       name.includes("jaw thrust") ||
//       name.includes("suction") ||
//       fieldName === concepts.SECRETION || 
//       fieldName === concepts.TONGUE_SWELLING ||
//       fieldName === concepts.NECK_HAEMATOMA || 
//       fieldName === concepts.TONGUE_FALLING_BACK || 
//       fieldName === concepts.OTHER
//     ) {
//       return "airway";
//     }

//     if (
//       name.includes("breathing") ||
//       name.includes("respiratory") ||
//       name.includes("oxygen") ||
//       name.includes("saturation") ||
//       name.includes("trachea") ||
//       name.includes("chest") ||
//       name.includes("percussion") ||
//       name.includes("lung")
//     ) {
//       return "breathing";
//     }

//     if (
//       name.includes("pulse") ||
//       name.includes("blood pressure") ||
//       name.includes("bleeding") ||
//       name.includes("intravenous") ||
//       name.includes("catheter") ||
//       name.includes("circulation")
//     ) {
//       return "circulation";
//     }

//     if (
//       name.includes("consciousness") ||
//       name.includes("glasgow") ||
//       name.includes("pupil") ||
//       name.includes("neurological") ||
//       name.includes("headache") ||
//       name.includes("disability")
//     ) {
//       return "disability";
//     }

//     if (
//       name.includes("temperature") ||
//       name.includes("exposure") ||
//       name.includes("trauma") ||
//       name.includes("environment") ||
//       name.includes("mucous") ||
//       name.includes("peripheries")
//     ) {
//       return "exposure";
//     }

//     return "other";
//   };

//   const extractAllFields = (panelData: any): Record<string, Field[]> => {
//     const fields: Record<string, Field[]> = {
//       core: [],
//       airway: [],
//       breathing: [],
//       circulation: [],
//       disability: [],
//       exposure: [],
//       other: []
//     };

//     if (!panelData || !Array.isArray(panelData)) return fields;

//     panelData.forEach((item) => {
//       if (!item) return;

//       if (item.children && Array.isArray(item.children) && item.children.length > 0) {
//         const parentValue = item.value || "";
//         item.children.forEach((child: any) => {
//           if (child?.names?.[0]?.name) {
//             const childName = child.names[0].name;
//             const childValue = child.value || childName;
//             const category = categorizeField(childName);
//             fields[category].push({ name: childName, value: childValue, parent: parentValue });
//           }
//         });
//       } else if (item.names?.[0]?.name) {
//         const fieldName = item.names[0].name;
//         const fieldValue = item.value || "";
//         const category = categorizeField(fieldName);
//         fields[category].push({ name: fieldName, value: fieldValue });
//       }
//     });

//     return fields;
//   };

//   if (!panelData || !Array.isArray(panelData) || panelData.length === 0) {
//     return null;
//   }

//   const fields = extractAllFields(panelData);
//   const isAirwayNotPatent = fields.core.some(f => f.name === concepts.AIRWAY_PATENT && f.value?.toLowerCase() === "no");
//   const airwayReasons = fields.airway.filter(f => 
//     f.name === concepts.SECRETION || 
//     f.name === concepts.TONGUE_SWELLING ||
//     f.name === concepts.NECK_HAEMATOMA || 
//     f.name === concepts.TONGUE_FALLING_BACK || 
//     f.name === concepts.OTHER
//   );
//   const airwayInterventions = fields.airway.filter(f => 
//     ![
//       concepts.SECRETION, 
//       concepts.TONGUE_SWELLING,
//       concepts.NECK_HAEMATOMA, 
//       concepts.TONGUE_FALLING_BACK, 
//       concepts.OTHER
//     ].includes(f.name as any)
//   );

//   return (
//     <Box sx={{ p: 2, minHeight: "60px" }}>
//       <Typography
//         variant="subtitle1"
//         fontWeight="bold"
//         sx={{ textDecoration: "underline", marginBottom: 1 }}
//       >
//         Primary Survey
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Column 1: A & B */}
//         <Grid item xs={12} md={4}>
//           {/* A – Airway */}
//           {(fields.airway.length > 0 || fields.core.length > 0) && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 A – Airway with C-Spine Protection
//               </Typography>

//               {/* Airway Patent Status */}
//               {fields.core.map((field, index) => {
//                 if (field.name === concepts.AIRWAY_PATENT) {
//                   const lowerValue = field.value?.toLowerCase();
//                   let text = "";
                  
//                   if (lowerValue === "yes") {
//                     text = "Airway is Patent";
//                   } else if (lowerValue === "no") {
//                     text = "Airway is Not Patent";
//                   } else {
//                     text = `Airway is ${field.value}`;
//                   }

//                   return (
//                     <Typography key={`airway-status-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       {text}
//                     </Typography>
//                   );
//                 }
//                 return null;
//               })}

//               {/* Patient Injured Status */}
//               {fields.core.map((field, index) => {
//                 if (field.name === concepts.PATIENT_INJURED) {
//                   const lowerValue = field.value?.toLowerCase();
//                   let text = "";
                  
//                   if (lowerValue === "yes") {
//                     text = "Patient is Injured";
//                   } else if (lowerValue === "no") {
//                     text = "Patient is Not Injured";
//                   } else {
//                     text = `Patient is ${field.value}`;
//                   }

//                   return (
//                     <Typography key={`patient-injured-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       {text}
//                     </Typography>
//                   );
//                 }
//                 return null;
//               })}

//               {/* Airway Reasons (only shown if airway not patent) */}
//               {isAirwayNotPatent && airwayReasons.length > 0 && (
//                 <Box sx={{ pl: 2, mb: 1 }}>
//                   <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
//                     Reasons:
//                   </Typography>
//                   {airwayReasons.map((field, index) => (
//                     <Typography key={`airway-reason-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       • {field.name}: {field.value}
//                     </Typography>
//                   ))}
//                 </Box>
//               )}

//               {/* Airway Interventions */}
//               {airwayInterventions.length > 0 && (
//                 <Box sx={{ pl: isAirwayNotPatent ? 2 : 0 }}>
//                   <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
//                     Reasons:
//                   </Typography>
//                   {airwayInterventions.map((field, index) => (
//                     <Typography key={`airway-intervention-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       •  {field.value}
//                     </Typography>
//                   ))}
//                 </Box>
//               )}
//             </>
//           )}

//           {/* B – Breathing */}
//           {fields.breathing.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 B – Breathing
//               </Typography>
//               {fields.breathing.map((field, index) => (
//                 <Typography key={`breathing-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>

//         {/* Column 2: C & D */}
//         <Grid item xs={12} md={4}>
//           {/* C – Circulation */}
//           {fields.circulation.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 C – Circulation
//               </Typography>
//               {fields.circulation.map((field, index) => (
//                 <Typography key={`circ-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}

//           {/* D – Disability */}
//           {fields.disability.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 D – Disability
//               </Typography>
//               {fields.disability.map((field, index) => (
//                 <Typography key={`dis-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>

//         {/* Column 3: E only */}
//         <Grid item xs={12} md={4}>
//           {/* E – Exposure/Environment */}
//           {fields.exposure.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 E – Exposure/Environment
//               </Typography>
//               {fields.exposure.map((field, index) => (
//                 <Typography key={`expo-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>
//       </Grid>

//       {renderTimestamp(panelData)}
//     </Box>
//   );
// };











import React from "react";
import { Typography, Grid, Box } from "@mui/material";

interface Field {
  name: string;
  value: string;
  parent?: string;
}

interface PrimarySurveyProps {
  panelData: any[];
  renderTimestamp: (panelData: any) => React.ReactNode;
}

export const PrimarySurvey = ({ panelData, renderTimestamp }: PrimarySurveyProps) => {
  const categorizeField = (fieldName: string) => {
    const name = fieldName.toLowerCase();

    console.log("NOW SEE BREATHING==>",panelData)

    if (fieldName === "Airway Patent" || fieldName === "Patient Injured") {
      return "core";
    }

    if (name.includes("reason") || name.includes("cause")) {
      return "airwayReasons";
    }

    if (name.includes("intervention") || name.includes("manoeuvre") || 
        name.includes("suction") || name.includes("airway") || 
        name.includes("thrust") || name.includes("insertion")) {
      return "airwayInterventions";
    }

    if (
      name.includes("breathing") ||
      name.includes("respiratory") ||
      name.includes("oxygen") ||
      name.includes("saturation") ||
      name.includes("trachea") ||
      name.includes("chest") ||
      name.includes("percussion") ||
      name.includes("lung")
    ) {
      return "breathing";
    }

    if (
      name.includes("pulse") ||
      name.includes("blood pressure") ||
      name.includes("bleeding") ||
      name.includes("intravenous") ||
      name.includes("catheter") ||
      name.includes("circulation")
    ) {
      return "circulation";
    }

    if (
      name.includes("consciousness") ||
      name.includes("glasgow") ||
      name.includes("pupil") ||
      name.includes("neurological") ||
      name.includes("headache") ||
      name.includes("disability")
    ) {
      return "disability";
    }

    if (
      name.includes("temperature") ||
      name.includes("exposure") ||
      name.includes("trauma") ||
      name.includes("environment") ||
      name.includes("mucous") ||
      name.includes("peripheries")
    ) {
      return "exposure";
    }

    return "other";
  };

  const extractAllFields = (panelData: any): Record<string, Field[]> => {
    const fields: Record<string, Field[]> = {
      core: [],
      airwayReasons: [],
      airwayInterventions: [],
      breathing: [],
      circulation: [],
      disability: [],
      exposure: [],
      other: []
    };

    if (!panelData || !Array.isArray(panelData)) return fields;

    panelData.forEach((item) => {
      if (!item) return;

      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        const parentValue = item.value || "";
        item.children.forEach((child: any) => {
          if (child?.names?.[0]?.name) {
            const childName = child.names[0].name;
            const childValue = child.value || childName;
            const category = categorizeField(childName);
            fields[category].push({ name: childName, value: childValue, parent: parentValue });
          }
        });
      } else if (item.names?.[0]?.name) {
        const fieldName = item.names[0].name;
        const fieldValue = item.value || "";
        const category = categorizeField(fieldName);
        fields[category].push({ name: fieldName, value: fieldValue });
      }
    });

    return fields;
  };

  if (!panelData || !Array.isArray(panelData) || panelData.length === 0) {
    return null;
  }

  const fields = extractAllFields(panelData);
  const isAirwayPatent = fields.core.some(
    f => f.name === "Airway Patent" && f.value?.toLowerCase() === "yes"
  );

  return (
    <Box sx={{ p: 2, minHeight: "60px" }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ textDecoration: "underline", marginBottom: 1 }}>
        Primary Survey
      </Typography>

      <Grid container spacing={2}>
        {/* Column 1: A & B */}
        <Grid item xs={12} md={4}>
          {/* A – Airway */}
          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
            A – Airway with C-Spine Protection
          </Typography>

          {/* Airway Patent Status */}
          {fields.core.map((field, index) => {
            if (field.name === "Airway Patent") {
              return (
                <Typography key={`airway-status-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  {field.value?.toLowerCase() === "yes" 
                    ? "Airway is Patent" 
                    : "Airway is Not Patent"}
                </Typography>
              );
            }
            return null;
          })}

          {/* ALWAYS SHOW REASONS (regardless of patent status) */}
          {fields.airwayReasons.length > 0 && (
            <Box sx={{ pl: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                Reasons:
              </Typography>
              {fields.airwayReasons.map((field, index) => (
                <Typography key={`airway-reason-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  • {field.value || field.name}
                </Typography>
              ))}
            </Box>
          )}

          {/* ALWAYS SHOW INTERVENTIONS (regardless of patent status) */}
          {fields.airwayInterventions.length > 0 && (
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                Interventions:
              </Typography>
              {fields.airwayInterventions.map((field, index) => (
                <Typography key={`airway-intervention-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  • {field.value || field.name}
                </Typography>
              ))}
            </Box>
          )}

          {/* B – Breathing */}
          {fields.breathing.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
                B – Breathing
              </Typography>
              {fields.breathing.map((field, index) => (
                <Typography key={`breathing-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>

        {/* Rest of the columns remain unchanged */}
        <Grid item xs={12} md={4}>
          {/* C – Circulation */}
          {fields.circulation.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
                C – Circulation
              </Typography>
              {fields.circulation.map((field, index) => (
                <Typography key={`circ-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}

          {/* D – Disability */}
          {fields.disability.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
                D – Disability
              </Typography>
              {fields.disability.map((field, index) => (
                <Typography key={`dis-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* E – Exposure/Environment */}
          {fields.exposure.length > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
                E – Exposure/Environment
              </Typography>
              {fields.exposure.map((field, index) => (
                <Typography key={`expo-${index}`} variant="body2" sx={{ mb: 0.5 }}>
                  {field.name}: {field.value}
                </Typography>
              ))}
            </>
          )}
        </Grid>
      </Grid>

      {renderTimestamp(panelData)}
    </Box>
  );
};







// import React from "react";
// import { Typography, Grid, Box } from "@mui/material";

// interface Field {
//   name: string;
//   value: string;
//   parent?: string;
// }

// interface PrimarySurveyProps {
//   panelData: any[];
//   renderTimestamp: (panelData: any) => React.ReactNode;
// }

// export const PrimarySurvey = ({ panelData, renderTimestamp }: PrimarySurveyProps) => {
//   const categorizeField = (fieldName: string) => {
//     const name = fieldName.toLowerCase();

//     if (fieldName === "Airway Patent" || fieldName === "Patient Injured") {
//       return "core";
//     }

//     if (name.includes("reason") || name.includes("cause")) {
//       return "airwayReasons";
//     }

//     if (
//       name.includes("intervention") || name.includes("manoeuvre") ||
//       name.includes("suction") || name.includes("airway") ||
//       name.includes("thrust") || name.includes("insertion")
//     ) {
//       return "airwayInterventions";
//     }

//     if (
//       name.includes("breathing") ||
//       name.includes("respiratory") ||
//       name.includes("oxygen") ||
//       name.includes("saturation") ||
//       name.includes("trachea") ||
//       name.includes("chest") ||
//       name.includes("percussion") ||
//       name.includes("lung")
//     ) {
//       return "breathing";
//     }

//     if (
//       name.includes("pulse") ||
//       name.includes("blood pressure") ||
//       name.includes("bleeding") ||
//       name.includes("intravenous") ||
//       name.includes("catheter") ||
//       name.includes("circulation")
//     ) {
//       return "circulation";
//     }

//     if (
//       name.includes("consciousness") ||
//       name.includes("glasgow") ||
//       name.includes("pupil") ||
//       name.includes("neurological") ||
//       name.includes("headache") ||
//       name.includes("disability")
//     ) {
//       return "disability";
//     }

//     if (
//       name.includes("temperature") ||
//       name.includes("exposure") ||
//       name.includes("trauma") ||
//       name.includes("environment") ||
//       name.includes("mucous") ||
//       name.includes("peripheries")
//     ) {
//       return "exposure";
//     }

//     return "other";
//   };

//   const extractAllFields = (panelData: any): Record<string, Field[]> => {
//     const fields: Record<string, Field[]> = {
//       core: [],
//       airwayReasons: [],
//       airwayInterventions: [],
//       breathing: [],
//       circulation: [],
//       disability: [],
//       exposure: [],
//       other: []
//     };

//     if (!panelData || !Array.isArray(panelData)) return fields;

//     panelData.forEach((item) => {
//       if (!item) return;

//       if (item.children && Array.isArray(item.children) && item.children.length > 0) {
//         const parentValue = item.value || "";
//         item.children.forEach((child: any) => {
//           if (child?.names?.[0]?.name) {
//             const childName = child.names[0].name;
//             const childValue = child.value || childName;
//             const category = categorizeField(childName);
//             fields[category].push({ name: childName, value: childValue, parent: parentValue });
//           }
//         });
//       } else if (item.names?.[0]?.name) {
//         const fieldName = item.names[0].name;
//         const fieldValue = item.value || "";
//         const category = categorizeField(fieldName);
//         fields[category].push({ name: fieldName, value: fieldValue });
//       }
//     });

//     return fields;
//   };

//   if (!panelData || !Array.isArray(panelData) || panelData.length === 0) {
//     return null;
//   }

//   const fields = extractAllFields(panelData);
//   const isAirwayPatent = fields.core.some(
//     f => f.name === "Airway Patent" && f.value?.toLowerCase() === "yes"
//   );

//   const breathingAbnormalField = fields.breathing.find(f => f.name === "Is Breathing Abnormal");
//   const isBreathingAbnormal = breathingAbnormalField?.value?.toLowerCase() === "yes";

//   const abnormalBreathingValues = new Set([
//     "nasal flaring",
//     "grunting",
//     "head nodding",
//     "cyanosis",
//     "recession",
//     "tachypnoea",
//     "reduced air entry",
//     "crepitations",
//     "wheeze",
//     "bronchial breathing",
//     "reduced chest expansion",
//     "hyper-resonance",
//     "dullness"
//   ]);

//   const abnormalBreathingDetails = fields.breathing.filter(
//     f => f.name !== "Is Breathing Abnormal" && abnormalBreathingValues.has(f.value.toLowerCase())
//   );

//   const otherBreathingFields = fields.breathing.filter(
//     f => f.name !== "Is Breathing Abnormal" && !abnormalBreathingValues.has(f.value.toLowerCase())
//   );

//   return (
//     <Box sx={{ p: 2, minHeight: "60px" }}>
//       <Typography variant="subtitle1" fontWeight="bold" sx={{ textDecoration: "underline", marginBottom: 1 }}>
//         Primary Survey
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Column 1: A & B */}
//         <Grid item xs={12} md={4}>
//           {/* A – Airway */}
//           <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//             A – Airway with C-Spine Protection
//           </Typography>

//           {/* Airway Patent Status */}
//           {fields.core.map((field, index) => {
//             if (field.name === "Airway Patent") {
//               return (
//                 <Typography key={`airway-status-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.value?.toLowerCase() === "yes"
//                     ? "Airway is Patent"
//                     : "Airway is Not Patent"}
//                 </Typography>
//               );
//             }
//             return null;
//           })}

//           {/* REASONS */}
//           {fields.airwayReasons.length > 0 && (
//             <Box sx={{ pl: 2, mb: 1 }}>
//               <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
//                 Reasons:
//               </Typography>
//               {fields.airwayReasons.map((field, index) => (
//                 <Typography key={`airway-reason-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   • {field.value || field.name}
//                 </Typography>
//               ))}
//             </Box>
//           )}

//           {/* INTERVENTIONS */}
//           {fields.airwayInterventions.length > 0 && (
//             <Box sx={{ pl: 2 }}>
//               <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
//                 Interventions:
//               </Typography>
//               {fields.airwayInterventions.map((field, index) => (
//                 <Typography key={`airway-intervention-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   • {field.value || field.name}
//                 </Typography>
//               ))}
//             </Box>
//           )}

//           {/* B – Breathing */}
//           {(abnormalBreathingDetails.length > 0 || otherBreathingFields.length > 0) && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 B – Breathing
//               </Typography>

//               {isBreathingAbnormal && (
//                 <>
//                   {abnormalBreathingDetails.map((field, index) => (
//                     <Typography key={`abnormal-breathing-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       • {field.value}
//                     </Typography>
//                   ))}
//                 </>
//               )}

//               {!isBreathingAbnormal && (
//                 <>
//                   {otherBreathingFields.map((field, index) => (
//                     <Typography key={`other-breathing-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                       {field.name}: {field.value}
//                     </Typography>
//                   ))}
//                 </>
//               )}
//             </>
//           )}
//         </Grid>

//         {/* Column 2: C & D */}
//         <Grid item xs={12} md={4}>
//           {/* C – Circulation */}
//           {fields.circulation.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 C – Circulation
//               </Typography>
//               {fields.circulation.map((field, index) => (
//                 <Typography key={`circ-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}

//           {/* D – Disability */}
//           {fields.disability.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}>
//                 D – Disability
//               </Typography>
//               {fields.disability.map((field, index) => (
//                 <Typography key={`dis-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>

//         {/* Column 3: E */}
//         <Grid item xs={12} md={4}>
//           {/* E – Exposure/Environment */}
//           {fields.exposure.length > 0 && (
//             <>
//               <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 E – Exposure/Environment
//               </Typography>
//               {fields.exposure.map((field, index) => (
//                 <Typography key={`expo-${index}`} variant="body2" sx={{ mb: 0.5 }}>
//                   {field.name}: {field.value}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Grid>
//       </Grid>

//       {renderTimestamp(panelData)}
//     </Box>
//   );
// };

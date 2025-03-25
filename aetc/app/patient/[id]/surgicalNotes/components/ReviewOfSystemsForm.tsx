// "use client";
// import React from "react";
// import { FormikInit, WrapperBox, FormFieldContainer, CheckboxesGroup } from "@/components";

// // Define the checklist options for each system
// const reviewOfSystemsOptions = {
//     general: ["Fever", "Lymphadenopathy", "Night sweats", "Fatigue", "Weight loss"],
//     ent: ["Eye pain", "Rhinorrhea", "Tinnitus", "Epistaxis", "Sinus pain", "Oral lesions", "Dysphagia", "Odynophagia", "Other"],
//     endocrine: ["Heat tolerance", "Abnormal hair growth", "Cold tolerance", "Polyuria", "Polydipsia", "Other"],
//     cardiac: ["Bleeding tendencies", "Chest pain", "Palpitations", "Oedema", "Cyanosis", "Claudication", "Orthopnoea", "Paroxysmal nocturnal dyspnoea", "Other"],
//     respiratory: ["Shortness of breath", "Dyspnoea on exertion", "Dyspnoea at rest", "Cough", "Haemoptysis", "Wheezing", "Other"],
//     gastrointestinal: ["Nausea", "Vomiting", "Melena", "Haematochezia", "Change in appetite", "Abdominal pain", "Change in bowel habit", "Heartburn"],
//     genitourinary: ["Dysuria", "Urgency", "Incontinence", "Haematuria", "Pyuria", "Sexually Transmitted Infection (STI)", "Abnormal vaginal discharge", "Dysmenorrhea", "Pelvic pain"],
//     musculoskeletal: ["Joint pain", "Joint swelling", "Back pain"],
//     neurologic: ["Headache", "Change in smell", "Change in taste", "Paraesthesias", "Muscle weakness", "Ataxia", "Change in speech"],
//     psychiatric: ["Depression", "Anxiety", "Hallucinations", "Mania", "Suicidal thoughts"],
// };

// export const ReviewOfSystemsForm = ({ onSubmit, onSkip }: { onSubmit: (values: any) => void; onSkip: () => void }) => {
//     return (
//         <FormikInit
//             initialValues={{
//                 general: [],
//                 ent: [],
//                 endocrine: [],
//                 cardiac: [],
//                 respiratory: [],
//                 gastrointestinal: [],
//                 genitourinary: [],
//                 musculoskeletal: [],
//                 neurologic: [],
//                 psychiatric: [],
//             }}
//             onSubmit={(values) => console.log("Review of Systems:", values)}
//         >
//             <FormFieldContainer direction="column">
//                 <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
//                     <h4>Review of Systems</h4>

//                     {/* Generate a checkbox list for each category */}
//                     {Object.entries(reviewOfSystemsOptions).map(([category, options]) => (
//                         <div key={category} style={{ marginBottom: "2ch" }}>
//                             <h5 style={{ textTransform: "capitalize" }}>{category.replace(/_/g, " ")}</h5>
//                             <CheckboxesGroup
//                                 name={category}
//                                 allowFilter={false}
//                                 options={options.map((item) => ({
//                                     value: item,
//                                     label: item,
//                                 }))}
//                             />
//                         </div>
//                     ))}
//                 </WrapperBox>
//             </FormFieldContainer>
//         </FormikInit>
//     );
// };
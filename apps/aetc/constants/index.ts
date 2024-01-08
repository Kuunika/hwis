export const encounters = {
  VITALS: "ba05bfc0-8d80-11d8-abbb-0024217bb78e",
  AIRWAY_BREATHING: "e8322627-662a-4a88-aa69-925ca5a39161",
  SOCIAL_HISTORY: "ba063f0e-8d80-11d8-abbb-0024217bb78e",
  REFERRAL: "ba068946-8d80-11d8-abbb-0024217bb78e",
  BLOOD_CIRCULATION: "514ffff2-019e-4b3e-a85b-0df3dbd43228",
  CONSCIOUSNESS: "bbf097b8-dbfe-40e1-bf3d-8e6b6f3c5e50",
};

export const AETC_VISIT_TYPE = "201f18d5-58e8-40ce-bbcc-ca71a3b3bb0b";
export const YES = "b9a0bbfc-8d80-11d8-abbb-0024217bb78e";
export const NO = "b9a0bd28-8d80-11d8-abbb-0024217bb78e";

export const concepts = {
  //VITALS
  COMPLAINTS: "b9d9f494-8d80-11d8-abbb-0024217bb78e",
  TEMPERATURE: "b9afeec4-8d80-11d8-abbb-0024217bb78e",
  RESPIRATORY_RATE: "b9b13694-8d80-11d8-abbb-0024217bb78e",
  SATURATION_RATE: "b9aff1e4-8d80-11d8-abbb-0024217bb78e",
  HEART_RATE: "b9c20bc2-8d80-11d8-abbb-0024217bb78e",
  BLOOD_PRESSURE_SYSTOLIC: "b9afec6c-8d80-11d8-abbb-0024217bb78e",
  BLOOD_PRESSURE_DIASTOLIC: "b9afed34-8d80-11d8-abbb-0024217bb78e",
  MOTOR_RESPONSE: "a1137874-afa8-42a2-b0e4-7b54f58e7a88",
  EYE_OPENING_RESPONSE: "fe9266a8-76b3-4497-b60a-15ac129250e7",
  VERBAL_RESPONSE: "5470aa1f-9207-4169-ae7a-5166222d67b7",
  GLUCOSE: "b9cc75b2-8d80-11d8-abbb-0024217bb78e",
  AVPU: "b9da6d98-8d80-11d8-abbb-0024217bb78e",
  PULSE_OXIMETRY: "b9be47b2-8d80-11d8-abbb-0024217bb78e",
  PULSE_RATE: "b9afedfc-8d80-11d8-abbb-0024217bb78e",

  //airway
  IS_AIRWAY_COMPROMISED: "e42e6502-860f-4465-854a-41aa1defd49f",
  IS_BREATHING_ABNORMAL: "2ea6822d-747b-4e13-971f-080089bf6f96",
  OXYGEN_STATS_89: "6bcd6397-fcc9-406f-af39-a677327e9914",
  RESPIRATORY_RATE_8_31: "61ec23c7-20cf-4d0b-90f2-7bb9ebff3d9e",
  SEVERE_RESPIRATORY: "b9d56dac-8d80-11d8-abbb-0024217bb78e",
  INABILITY_TO_SPEAK: "1dd0fbb7-deb1-4218-a891-aced8fe56ef1",
  STRIDOR: "dd4aeabb-3c54-4aac-b55b-af84bc00c013",
  REDUCED_LEVEL_CONSCIOUSNESS: "ac645562-9ccd-468c-9565-d73af2e68c2b",
  OXYGEN_STATS_90_92: "e01064d7-01db-4780-af4d-ca25a7606e7b",
  RESPIRATORY_RATE_9_21_30: "596ed0cf-55e6-4eb7-b6ec-b751d36cba1a=",

  YES: "b9a0bbfc-8d80-11d8-abbb-0024217bb78e",
  NO: "b9a0bd28-8d80-11d8-abbb-0024217bb78e",

  //Circulation

  IS_CIRCULATION_ABNORMAL: "7e8b121b-f7ce-43c2-8c14-6be05ece9591",
  HEART_RATE_50_120: "fe5e2d71-7698-447c-b3d6-d1510b0dbf4f",
  REDUCED_URINARY_OUTPUT: "c3acaf4a-c889-4744-9ea1-a121ae8996d1",
  CAPILLARY_REFILL: "9af5513d-45f7-4d3f-b45c-1b8f146b43c9",
  WEAK_THREADY: "e784d795-5815-4e70-ab15-1f0f34d4057a",
  HEMORRHAGE: "b9d60244-8d80-11d8-abbb-0024217bb78e",
  DEHYDRATION_SKIN: "b9d366c4-8d80-11d8-abbb-0024217bb78e",
  HEART_RATE_50: "f5ed8c3c-6258-431e-a78a-0f2642724633",

  // consciousness

  DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS: "b7f72b28-85f7-45a0-8ee7-14f1989ba00e",
  BLOOD_GLUCOSE: "b9cc75b2-8d80-11d8-abbb-0024217bb78e",
  GCS: "8c66ee46-439e-41f9-a5d9-de297fc23c7c",

  // social history
  MARITAL_STATUS: "6616827b-f8fb-49ef-8214-66a4c139e1cd",
  OCCUPATION: "b9c41c46-8d80-11d8-abbb-0024217bb78e",
  RELIGION: "b9d864ee-8d80-11d8-abbb-0024217bb78e",
  HIGHEST_EDUCATION: "b9da5fa6-8d80-11d8-abbb-0024217bb78e",
  METHOD_OF_TRANSPORTATION: "b9c3ae32-8d80-11d8-abbb-0024217bb78e",
};

export const triageResult = {
  RED: "red",
  GREEN: "green",
  YELLOW: "yellow",
};

// export const checkConcepts = async () => {
//   "use client";

//   const conceptsNotAvailable = [];

//   return conceptsNotAvailable;
// };

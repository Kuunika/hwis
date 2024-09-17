export const encounters = {
  VITALS: "ba05bfc0-8d80-11d8-abbb-0024217bb78e",
  AIRWAY_BREATHING: "e8322627-662a-4a88-aa69-925ca5a39161",
  SOCIAL_HISTORY: "ba063f0e-8d80-11d8-abbb-0024217bb78e",
  REFERRAL: "ba068946-8d80-11d8-abbb-0024217bb78e",
  BLOOD_CIRCULATION: "514ffff2-019e-4b3e-a85b-0df3dbd43228",
  CONSCIOUSNESS: "42bfe0d5-d05d-49d4-81d1-7e760d2ac003",
  PERSISTENT_PAIN: "5af651a4-de23-4a6e-84c4-60d7f98be243",
  AIRWAY_ASSESSMENT: "28fb4592-abc3-4b53-b13c-733595e2e504",
  BREATHING_ASSESSMENT: "08d4b4e5-dfa7-436b-9062-aee1b076c3ea",
  CIRCULATION_ASSESSMENT: "bb16ef97-6ef7-414f-880c-dfc67e1601df",
  DISABILITY_ASSESSMENT: "0ef8f652-7852-49a5-a9dd-c1ca74fe098c",
  INITIAL_REGISTRATION: "4186b2dd-0254-4226-965a-e77fcaa70bcf",
  SCREENING_ENCOUNTER: "6878ece0-a61b-4e49-83b9-0468dd9eacfc",
  FINANCING: "ceec1aca-1bbb-427a-bc6d-ef8ae11f31b2",
  PRESENTING_COMPLAINTS: "ba069102-8d80-11d8-abbb-0024217bb78e",
  // TRIAGE_RESULT: "723ea21f-408e-4da5-a91f-56b0a8d0ce73",
  TRIAGE_RESULT: "27e4890f-1677-4098-aa85-c65cfe32359c",
  CLINICAL_NOTES:"ba067294-8d80-11d8-abbb-0024217bb78e",
  PROCEDURES_DONE: "ba0656ec-8d80-11d8-abbb-0024217bb78e"
};

export const AETC_VISIT_TYPE = "9f825d6a-50e6-44e1-a1a4-5cd343963ecc";
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
  URINE_DIPSTICK_KETONES: "b9cc6afe-8d80-11d8-abbb-0024217bb78e",
  PEAK_EXPIRATORY_FLOW_RATE: "f2adaf9e-63bf-4a2a-955f-5084d53affa6",

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
  RESPIRATORY_RATE_9_21_30: "596ed0cf-55e6-4eb7-b6ec-b751d36cba1a",
  YES: "b9a0bbfc-8d80-11d8-abbb-0024217bb78e",
  NO: "b9a0bd28-8d80-11d8-abbb-0024217bb78e",
  //airway Interventions
  AIRWAY_OPENING_INTERVENTIONS: "da54e02c-e311-4f0b-a3aa-799754dcd058",
  FOREIGN_BODY_REMOVAL:"139e2c12-7d6b-4756-8964-14a1a9ccd345",
  SUCTIONING:"4a87066e-5d77-464c-9f0f-37b2d0ee221c",
  POSITIONING:"cfcb4e10-c573-43e1-aad1-5ad26fb88a1c",
  C_SPINE_STABILIZATION: "3ab7196d-2243-45a0-b3c9-ed5dcf23512e",
  INSERTION_OF_GUEDEL: "b33e41b4-3864-4624-9470-1a56b834d818",
  OTHER_AIRWAY_INTERVENTION: "fe370160-efea-4a78-8f52-4027593c850a",

  //Circulation

  IS_CIRCULATION_ABNORMAL: "7e8b121b-f7ce-43c2-8c14-6be05ece9591",
  HEART_RATE_50_120: "fe5e2d71-7698-447c-b3d6-d1510b0dbf4f",
  REDUCED_URINARY_OUTPUT: "c3acaf4a-c889-4744-9ea1-a121ae8996d1",
  CAPILLARY_REFILL: "9af5513d-45f7-4d3f-b45c-1b8f146b43c9",
  WEAK_THREADY: "e784d795-5815-4e70-ab15-1f0f34d4057a",
  HEMORRHAGE: "b9d60244-8d80-11d8-abbb-0024217bb78e",
  DEHYDRATION_SKIN: "b9d366c4-8d80-11d8-abbb-0024217bb78e",
  HEART_RATE_50: "f5ed8c3c-6258-431e-a78a-0f2642724633",
  CIRCULATION_INTERVENTIONS:"7a974a19-a8b4-4d15-a6fc-37f56a448e5f",
  //INTAKE_FLUIDS:"27883239-00e4-4c41-acc0-989c4c737b47",

  // consciousness

  DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS: "b7f72b28-85f7-45a0-8ee7-14f1989ba00e",
  BLOOD_GLUCOSE: "b9cc75b2-8d80-11d8-abbb-0024217bb78e",
  GCS: "8c66ee46-439e-41f9-a5d9-de297fc23c7c",

  // social history
  MARITAL_STATUS: "7cab5ece-fbc4-4e30-892e-867f92021c36",
  OCCUPATION: "b9c41c46-8d80-11d8-abbb-0024217bb78e",
  RELIGION: "b9d864ee-8d80-11d8-abbb-0024217bb78e",
  HIGHEST_EDUCATION: "b9da5fa6-8d80-11d8-abbb-0024217bb78e",
  METHOD_OF_TRANSPORTATION: "b9c3ae32-8d80-11d8-abbb-0024217bb78e",

  // persistent pain

  ACTIVE_SEIZURES: "5fab08da-9427-46fc-adab-997ab0a50b9e",
  FOCAL_NEUROLOGICAL: "b9a10ae4-8d80-11d8-abbb-0024217bb78e",
  HEADACHE: "b9d81020-8d80-11d8-abbb-0024217bb78e",
  WEAKNESS: "b9b122f8-8d80-11d8-abbb-0024217bb78e",
  SEVERE_PAIN: "b9db0d3e-8d80-11d8-abbb-0024217bb78e",
  CONFUSION: "b9b4e10e-8d80-11d8-abbb-0024217bb78e",
  MODERATE_PAIN: "3d912c36-3a41-419b-862e-d4693a9a8cbf",

  // Primary Assessments
  //airway assessment
  AIRWAY_PATENT: "b9da52fe-8d80-11d8-abbb-0024217bb78e",
  PATIENT_INJURED: "b996b922-8d80-11d8-abbb-0024217bb78e",
  NECK_COLLAR_APPLIED: "5fbb80d8-4f67-4ce8-83a7-1af6b7571ccc",
  HEAD_BLOCKS_APPLIED: "d1837314-ea89-42c5-8241-24721d7f7a55",
  AIRWAY_OPENING_INTERVENTION: "ff4034e1-9c73-4671-b006-ecfa928c697d",
  NASOPHARYNGEAL_AIRWAY: "8a12d394-d3f6-4128-b129-fe6c098d675b",
  OROPHARYNGEAL_AIRWAY: "0b6fbdfe-52fd-49b7-9b16-d3b56f9cca59",
  AIRWAY_REASON: "61575947-fb25-4424-b4d7-46af0e792adc",

  // breathing
  IS_PATIENT_BREATHING: "b9da53c6-8d80-11d8-abbb-0024217bb78e",
  OXYGEN_SATURATION: "b9aff1e4-8d80-11d8-abbb-0024217bb78e",
  PATIENT_NEED_OXYGEN: "b9d060a0-8d80-11d8-abbb-0024217bb78e",
  IS_TRACHEA_CENTRAL: "3431e03e-00ff-4461-a4e0-23db940b48ef",
  OXYGEN_GIVEN: "da9ae0db-9728-49f4-9c54-b5967e56cf26",
  OXYGEN_SOURCE: "59e1055d-491b-4849-862c-4c3fe5bad25d",
  DEVICE_USED: "ea3cd134-c637-44df-a607-19562e3b8ca8",
  CHEST_WALL_ABNORMALITY: "b14c6642-01d9-41b0-962f-3ec4ef5d565d",
  CHEST_EXPANSION: "a3fa9ded-d8b0-43ca-8891-cb25c0e3967e",
  PERCUSSION: "85e63e75-da29-4159-95b5-5cdad8cf95ca",
  SIDE_DEVIATED: "b9b113a8-8d80-11d8-abbb-0024217bb78e",
  START_TIME: "5e8a7cf7-d760-4aa1-820e-43e0b7671fab",
  END_TIME: "3f2e806a-3bfe-4f6b-a745-9bd352383153",
  DEVICE_USED_FOR_INTERVENTION: "a7ad06bd-e726-456e-8986-3612e57bdba8",
  ADDITIONAL_NOTES: "b9bd915a-8d80-11d8-abbb-0024217bb78e",
  DESCRIPTION: "2b304cb7-cae4-433c-b7f0-828795c515e9",

  //breathing interventions
  BREATHING_INTERVENTIONS: "a630f47e-dce9-46ec-92ec-3198b5bc9900",
  BAG_AND_MASK: "3595f986-0174-45c1-a2c4-bf10f0aebe27",
  INTERCOSTAL_DRAINAGE: "10a56562-dc1b-437e-972a-4a72cf06cb68",

  // circulation
  IS_PATIENT_ACTIVELY_BLEEDING: "b9d5c504-8d80-11d8-abbb-0024217bb78e",
  IS_THE_PATIENT_HAVE_PULSE: "b9cc9d8a-8d80-11d8-abbb-0024217bb78e",
  CAPILLARY_REFILL_TIME: "ac274209-0639-4cab-a7ff-0403776f1a94",
  MUCOUS_MEMBRANES: "b9d5239c-8d80-11d8-abbb-0024217bb78e",
  PULSE_RATE_WEAK: "60a06d47-92ba-4b4a-97e6-edfe0309803c",
  ASSESS_PERIPHERIES: "60ab919e-a8dc-4a05-8692-d632c1b31360",
  BLOOD_PRESSURE_MEASURED: "b9dd704c-8d80-11d8-abbb-0024217bb78e",
  PATIENT_INTRAVENOUS: "b9b6044e-8d80-11d8-abbb-0024217bb78e",
  IS_PATIENT_TRAUMATIZED: "30ad573a-58bb-44b8-88c6-3ea6753c67b5",
  SIZE_OF_CATHETER: "149c9177-f42f-4484-9b31-6d9d76e08b1c",
  IS_PELVIS_STABLE: "34685972-06e2-4fa5-a084-65ef02fd45b0",
  IS_FEMUR_TIBIA_NORMAL: "81218793-3a5b-4dc1-ab7d-cb7a923206a0",

  //circulation interventions
  INTAKE_FLUIDS:"e3fee88b-2fac-4e0f-a9b7-c6dbcce971b1",

  //Change this concept
  IS_ABDONORMINAL_DISTENTION: "30ad573a-58bb-44b8-88c6-3ea6753c67b5",
  IS_THERE_OTHER_OBDONORMALITIES: "b9db0276-8d80-11d8-abbb-0024217bb78e",
  IS_THERE_ANY_OTHER_ABNOMALITIES: "b9d887da-8d80-11d8-abbb-0024217bb78e",
  ACTION_DONE: "4cd3b3a3-bcea-4aa3-bc7a-85a3a8059cbc",
  REASON_NOT_RECORDED: "181a85df-1cec-42c9-ac78-0badc586dc1d",

  PUPIL_SIZE_AND_REACTION_TO_LIGHT: "995625e8-ad4c-436e-8301-b58a528051c5",
  POSTURE: "57b913f6-ffde-4831-b3e1-ddb57317ebf2",
  FOCAL_NEUROLOGY: "b9a04b04-8d80-11d8-abbb-0024217bb78e",
  SEIZURES: "b9b4e1d6-8d80-11d8-abbb-0024217bb78e",
  VISIT_NUMBER: "b948b111-ec31-47ea-826c-3f53bf2a1714",

  //screening
  IS_PATIENT_REFERRED: "05016707-c82f-43d9-b9b6-451e5e155cc8",
  IS_SITUATION_URGENT: "77963352-aa31-484a-92fe-80afae720d34",
  PATIENT_REFERRED_TO: "b9a64022-8d80-11d8-abbb-0024217bb78e",
  // 


  // parent:8d91a210-c2cc-11de-8d13-0010c6dffd0f
  // uncle-auntie: 8d91a3dc-c2cc-11de-8d13-0010c6dffd0f
  // auntie:68e31ef5-113f-46a9-b34c-98302611e5fd
  // guardian:ba453344-8d80-11d8-abbb-0024217bb78e
  // spouse:c397168a-f8bd-4ad1-b865-e608c1f3487e
  // sibling:8d91a01c-c2cc-11de-8d13-0010c6dffd0f
  // uncle:fa7799e2-fe4c-49be-a326-53320008aeb1

  NATIONAL_ID_IDENTIFIER_TYPE: "dc047ea8-e9ce-4fd0-af93-a2ade6b14b42",
  // PARENT: "ba453f92-8d80-11d8-abbb-0024217bb78e",
  PARENT: "8d91a210-c2cc-11de-8d13-0010c6dffd0f",
  // UNCLE_AUNTIE: "68ee4bec-1e85-47c5-a6d3-02ff09e29112",
  UNCLE_AUNTIE: "8d91a3dc-c2cc-11de-8d13-0010c6dffd0f",
  AUNTIE: "68e31ef5-113f-46a9-b34c-98302611e5fd", 
  GUARDIAN: "ba453344-8d80-11d8-abbb-0024217bb78e",
  SPOUSE: "c397168a-f8bd-4ad1-b865-e608c1f3487e",
  SIBLING: "8d91a01c-c2cc-11de-8d13-0010c6dffd0f",

  //patient referred from
  REFERRED_FROM: "b9d29b4a-8d80-11d8-abbb-0024217bb78e",

  // Financing

  INSURANCE_PROVIDER: "5c6d1327-45a1-42bc-95cf-864c0a8f9f07",
  INSURANCE_NUMBER: "8affc5bd-b399-4a3a-9c87-17a0dc9bf2c0",
  INSURANCE_SCHEME: "20d51764-77b7-45fc-91b4-8f357bfc7262",
  INSURANCE_STATUS: "c3350c35-76fe-4f32-9f59-799cddce66f7",
  PAYMENT_OPTIONS: "a4a38479-db24-44ec-9325-28e646162185",


  // TRIAGE_RESULT: "896123ef-8e8f-4d80-b1cb-218b65707096"
  TRIAGE_RESULT: "896123ef-8e8f-4d80-b1cb-218b65707096",


  ELECTIVE: "2d7d1b0c-1867-4dbd-8b49-4335548a42bf",

  INVESTIGATIONS:"76dcafcb-2148-4919-9b3b-cd7f3f77d19e"
};

export const triageResult = {
  RED: "red",
  GREEN: "green",
  YELLOW: "yellow",
};

export const districts = [
  {
    district_name: "Mchinji",
    district_code: "MC",
    zone_id: 2,
    id: 1,
  },
  {
    district_name: "Dowa",
    district_code: "DA",
    zone_id: 1,
    id: 2,
  },
  {
    district_name: "Dedza",
    district_code: "DE",
    zone_id: 2,
    id: 3,
  },
  {
    district_name: "Lilongwe",
    district_code: "LL",
    zone_id: 2,
    id: 4,
  },
  {
    district_name: "Nkhata Bay",
    district_code: "KB",
    zone_id: 3,
    id: 5,
  },
  {
    district_name: "Chitipa",
    district_code: "CP",
    zone_id: 3,
    id: 6,
  },
  {
    district_name: "Kasungu",
    district_code: "KU",
    zone_id: 1,
    id: 7,
  },
  {
    district_name: "Ntchisi",
    district_code: "NT",
    zone_id: 1,
    id: 8,
  },
  {
    district_name: "Salima",
    district_code: "SA",
    zone_id: 1,
    id: 9,
  },
  {
    district_name: "Nkhotakota",
    district_code: "NK",
    zone_id: 1,
    id: 10,
  },

  {
    district_name: "Ntcheu",
    district_code: "NT",
    zone_id: 2,
    id: 12,
  },

  {
    district_name: "Rumphi",
    district_code: "RU",
    zone_id: 3,
    id: 14,
  },
  {
    district_name: "Karonga",
    district_code: "KA",
    zone_id: 3,
    id: 15,
  },
  {
    district_name: "Mzimba",
    district_code: "MZ",
    zone_id: 3,
    id: 16,
  },
  {
    district_name: "Balaka",
    district_code: "BK",
    zone_id: 4,
    id: 17,
  },
  {
    district_name: "Likoma",
    district_code: "LK",
    zone_id: 3,
    id: 18,
  },
  {
    district_name: "Machinga",
    district_code: "MC",
    zone_id: 4,
    id: 19,
  },
  {
    district_name: "Mangochi",
    district_code: "MG",
    zone_id: 4,
    id: 20,
  },
  {
    district_name: "Mulanje",
    district_code: "MU",
    zone_id: 4,
    id: 21,
  },
  {
    district_name: "Phalombe",
    district_code: "PH",
    zone_id: 4,
    id: 22,
  },
  {
    district_name: "Zomba",
    district_code: "ZA",
    zone_id: 4,
    id: 23,
  },
  {
    district_name: "Blantyre Urban",
    district_code: "BT",
    zone_id: 5,
    id: 24,
  },
  {
    district_name: "Blantyre Rural",
    district_code: "BTR",
    zone_id: 5,
    id: 247,
  },
  {
    district_name: "Chiradzulu",
    district_code: "CR",
    zone_id: 5,
    id: 26,
  },
  {
    district_name: "Chikwawa",
    district_code: "CK",
    zone_id: 5,
    id: 27,
  },
  {
    district_name: "Mwanza",
    district_code: "MW",
    zone_id: 5,
    id: 28,
  },
  {
    district_name: "Neno",
    district_code: "NE",
    zone_id: 5,
    id: 29,
  },
  {
    district_name: "Nsanje",
    district_code: "NS",
    zone_id: 5,
    id: 30,
  },
  {
    district_name: "Thyolo",
    district_code: "TH",
    zone_id: 5,
    id: 31,
  },
];

export const traditionalAuthorities = [
  { id: "Bvumbwe", label: "Bvumbwe" },
  { id: "Chamba", label: "Chamba" },
  { id: "Changata", label: "Changata" },
  { id: "Chikowi", label: "Chikowi" },
  { id: "Chindi", label: "Chindi" },
  { id: "Chiseka", label: "Chiseka" },
  { id: "Chitukula", label: "Chitukula" },
  { id: "Chowe", label: "Chowe" },
  { id: "Dzoole", label: "Dzoole" },
  { id: "Fukamapiri", label: "Fukamapiri" },
  { id: "Ganya", label: "Ganya" },
  { id: "Gomani", label: "Gomani" },
  { id: "Jalasi", label: "Jalasi" },
  { id: "Kabudula", label: "Kabudula" },
  { id: "Kadewere", label: "Kadewere" },
  { id: "Kalolo", label: "Kalolo" },
  { id: "Kayembe", label: "Kayembe" },
  { id: "Kuntaja", label: "Kuntaja" },
  { id: "Kyungu", label: "Kyungu" },
  { id: "Liwonde", label: "Liwonde" },
  { id: "Lundu", label: "Lundu" },
  { id: "Mabulabo", label: "Mabulabo" },
  { id: "Malengachanzi", label: "Malengachanzi" },
  { id: "Maseya", label: "Maseya" },
  { id: "Masula", label: "Masula" },
  { id: "Mavwere", label: "Mavwere" },
  { id: "Mbalachanda", label: "Mbalachanda" },
  { id: "Mbelwa", label: "Mbelwa" },
  { id: "Mbenjere", label: "Mbenjere" },
  { id: "Mchilamwera", label: "Mchilamwera" },
  { id: "Mduwa", label: "Mduwa" },
  { id: "Mlonyeni", label: "Mlonyeni" },
  { id: "Mponda", label: "Mponda" },
  { id: "Mtema", label: "Mtema" },
  { id: "Mthiramanja", label: "Mthiramanja" },
  { id: "Mwakhwawa", label: "Mwakhwawa" },
  { id: "Mwahenga", label: "Mwahenga" },
  { id: "Mwamulowe", label: "Mwamulowe" },
  { id: "Mwase", label: "Mwase" },
  { id: "Mwaulambya", label: "Mwaulambya" },
  { id: "Nankumba", label: "Nankumba" },
  { id: "Njema", label: "Njema" },
  { id: "Nkalo", label: "Nkalo" },
  { id: "Nkhulambe", label: "Nkhulambe" },
  { id: "Nkukula", label: "Nkukula" },
  { id: "Nsomba", label: "Nsomba" },
  { id: "Nyachikadza", label: "Nyachikadza" },
  { id: "Nyambi", label: "Nyambi" },
  { id: "Nyaza", label: "Nyaza" },
  { id: "Phambala", label: "Phambala" },
  { id: "Phambala1", label: "Phambala 1" },
  { id: "Phambala2", label: "Phambala 2" },
  { id: "Pemba", label: "Pemba" },
  { id: "Simphasi", label: "Simphasi" },
  { id: "Siyeni", label: "Siyeni" },
  { id: "Sukumaland", label: "Sukumaland" },
  { id: "Tambala", label: "Tambala" },
  { id: "Tengani", label: "Tengani" },
  { id: "Tengani1", label: "Tengani 1" },
  { id: "Wimbe", label: "Wimbe" },
];

export const malawiVillages = [
  { id: "Chigumula", label: "Chigumula" },
  { id: "Chilinde", label: "Chilinde" },
  { id: "Chinsapo", label: "Chinsapo" },
  { id: "Area 23", label: "Area 23" },
  { id: "Namiyango", label: "Namiyango" },
  { id: "Chirimba", label: "Chirimba" },
  { id: "Chigoli", label: "Chigoli" },
];


export const roles = {
  ADMIN: process.env.NEXT_PUBLIC_SUPER_USER_ROLE as string,
  REGISTRATION_CLERK:process.env.NEXT_PUBLIC_REGISTRATIONCLERK_USER_ROLE as string,
  CLINICIAN: process.env.NEXT_PUBLIC_CLINICIAN_USER_ROLE as string,
  NURSE: process.env.NEXT_PUBLIC_NURSE_USER_ROLE as string,
  INITIAL_REGISTRATION_CLERK: process.env.NEXT_PUBLIC_HOSPITALATTENDANT_USER_ROLE as string,
  DATA_MANAGER: process.env.NEXT_PUBLIC_DATA_MANAGER as string
}



// username: registration, clinician, nurse

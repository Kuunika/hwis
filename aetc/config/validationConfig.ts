// config/validationConfig.ts
import * as yup from "yup";

export const getValidationConfig = () => ({
  // Arterial Blood Gas
  "Arterial Blood Gas_pH": yup.number().min(7.35).max(7.45).label("pH"),
  "Arterial Blood Gas_PCO2": yup.number().min(35).max(45).label("PCO2"),
  "Arterial Blood Gas_PO2": yup.number().min(75).max(100).label("PO2"),
  "Arterial Blood Gas_Base Excess": yup
    .number()
    .min(-4)
    .max(2)
    .label("Base Excess"),
  "Arterial Blood Gas_LACTATE": yup.number().min(0).max(2).label("Lactate"),
  "Arterial Blood Gas_SO2E": yup.number().min(95).max(100).label("SO2E"),
  "Arterial Blood Gas_P50E": yup.number().min(24).max(28).label("P50E"),
  "Arterial Blood Gas_HCO3": yup.number().min(3).max(7).label("HCO3"),

  // Electrolyte Values
  "Electrolyte Values_CK": yup.number().min(3.5).max(5.5).label("CK"),
  "Electrolyte Values_CNA": yup.number().min(135).max(145).label("CNA"),
  "Electrolyte Values_CA2": yup.number().label("CA2"),
  "Electrolyte Values_CCL": yup.number().label("CCL"),
  "Electrolyte Values_glucose": yup.number().min(3).max(7).label("Glucose"),
  "Electrolyte Values_ANION_GAPC": yup.number().label("Anion Gap"),
  "Electrolyte Values_MOSMC": yup.number().label("MOSMC"),
  "Electrolyte Values_FO2HBE": yup.number().label("FO2HBE"),
  "Electrolyte Values_FHHBE": yup.number().label("FHHBE"),

  // Dipstick
  Dipstick_urobilinogen: yup.string().label("Urobilinogen"),
  Dipstick_leukocytes: yup.string().label("Leukocytes"),
  Dipstick_bilirubin: yup.string().label("Bilirubin"),
  Dipstick_glucose: yup.string().label("Glucose"),
  "Dipstick_Specific Gravity": yup.string().label("Specific Gravity"),
  Dipstick_protein: yup.string().label("Protein"),
  Dipstick_nitrite: yup.string().label("Nitrite"),
  Dipstick_ketones: yup.string().label("Ketones"),
  Dipstick_blood: yup.string().label("Blood"),

  // Tests
  mrdt: yup.string().required().label("MRDT"),
  pregnancyTest: yup.string().label("Pregnancy test"),
  hiv: yup.string().label("HIV"),
  vdrl: yup.string().label("VDRL"),
  pocus: yup.string().label("POCUS"),
  ecg: yup.string().label("ECG"),
  other: yup.string().label("Other"),
});

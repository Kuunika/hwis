import {
  FormFieldContainerMultiple,
  FormikInit,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { Typography } from "@mui/material";
import * as yup from "yup";

const formConfig = {
  mrdt: {
    name: concepts.MRDT,
    label: "MRDT",
    coded: true,
  },
  PH: {
    name: concepts.PH,
    label: "pH",
  },
  PCO2: {
    name: concepts.PCO2,
    label: "pCO2",
  },
  PO2: {
    name: concepts.PO2,
    label: "pO2",
  },
  BASE_EXCESS: {
    name: concepts.BASE_EXCESS,
    label: "Base Excess",
  },
  LACTATE: {
    name: concepts.LACTATE,
    label: "Lactate",
  },
  glucose: {
    name: concepts.GLUCOSE,
    label: "Glucose",
  },
  HCO3: {
    name: concepts.HCO3,
    label: "HCO-3",
  },
  ANION_GAPC: {
    name: concepts.ANION_GAPC,
    label: "Anion gapc",
  },
  MOSMC: {
    name: concepts.MOSMC,
    label: "mOsmc",
  },
  SO2E: {
    name: concepts.SO2E,
    label: "sO2e",
  },
  FO2HBE: {
    name: concepts.FO2HBE,
    label: "FO2Hbe",
  },
  FHHBE: {
    name: concepts.FHHBE,
    label: "FHHBe",
  },
  CK: {
    name: concepts.CK,
    label: "cK",
  },
  CNA: {
    name: concepts.CNA,
    label: "cNa",
  },
  CA2: {
    name: concepts.CA2,
    label: "Ca2+",
  },
  CCL: {
    name: concepts.CCL,
    label: "cCl-",
  },
  P50E: {
    name: concepts.P50E,
    label: "p50e",
  },
  pregnancyTest: {
    name: concepts.PREGNANCY_TEST,
    label: "Pregnancy Test",
    coded: true,
  },
  hiv: {
    name: concepts.HIV,
    label: "HIV",
    coded: true,
  },
  vdrl: {
    name: concepts.VDRL,
    label: "VDRL",
    coded: true,
  },
  urobilinogen: {
    name: concepts.UROBILINOGEN,
    label: "Urobilinogen",
  },
  leukocytes: {
    name: concepts.LEUKOCYTES,
    label: "Leukocytes",
  },
  bilirubin: {
    name: concepts.BILIRUBIN,
    label: "Bilirubin",
  },
  specificGravity: {
    name: concepts.SPECIFIC_GRAVITY,
    label: "Specific Gravity",
  },
  nitrite: {
    name: concepts.NITRITE,
    label: "Nitrite",
  },
  ketones: {
    name: concepts.KETONES,
    label: "Ketones",
  },
  blood: {
    name: concepts.BLOOD,
    label: "Blood",
  },
  protein: {
    name: concepts.PROTEIN,
    label: "Protein",
  },
  pocus: {
    name: concepts.POINT_OF_CARE_ULTRASOUND,
    label: "Point of care ultrasound",
  },
  ecg: {
    name: concepts.ECG,
    label: "ECG",
  },
  pefr: {
    name: concepts.PEFR,
    label: "PEFR",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
};

const validationSchema = yup.object({
  // [formConfig.mrdt.name]: yup.string().required(),
  // [formConfig.PH.name]: yup
  //   .number()
  //   .min(7.35)
  //   .max(7.45)
  //   .required()
  //   .label(formConfig.PH.label),
  // [formConfig.PCO2.name]: yup
  //   .number()
  //   .min(35)
  //   .max(45)
  //   .required()
  //   .label(formConfig.PCO2.label),
  // [formConfig.PO2.name]: yup
  //   .number()
  //   .min(75)
  //   .max(100)
  //   .required()
  //   .label(formConfig.PO2.label),
  // [formConfig.BASE_EXCESS.name]: yup
  //   .number()
  //   .min(-4)
  //   .max(2)
  //   .label(formConfig.BASE_EXCESS.label),
  // [formConfig.LACTATE.name]: yup
  //   .number()
  //   .min(0)
  //   .max(2)
  //   .label(formConfig.LACTATE.label),
  // [formConfig.glucose.name]: yup
  //   .number()
  //   .min(3)
  //   .max(7)
  //   .label(formConfig.glucose.label),
  // [formConfig.HCO3.name]: yup
  //   .number()
  //   .min(3)
  //   .max(7)
  //   .label(formConfig.HCO3.label)
  //   .required(),
  // [formConfig.ANION_GAPC.name]: yup.number().label(formConfig.ANION_GAPC.label),
  // [formConfig.MOSMC.name]: yup.number().label(formConfig.MOSMC.label),
  // [formConfig.SO2E.name]: yup
  //   .number()
  //   .min(95)
  //   .max(100)
  //   .label(formConfig.SO2E.label)
  //   .required(),
  // [formConfig.FO2HBE.name]: yup.number().label(formConfig.FO2HBE.label),
  // [formConfig.FHHBE.name]: yup.number().label(formConfig.FHHBE.label),
  // [formConfig.CK.name]: yup
  //   .number()
  //   .min(3.5)
  //   .max(5.5)
  //   .label(formConfig.CK.label),
  // [formConfig.CNA.name]: yup
  //   .number()
  //   .min(135)
  //   .max(145)
  //   .label(formConfig.CNA.label),
  // [formConfig.CA2.name]: yup.number().label(formConfig.CA2.label),
  // [formConfig.CCL.name]: yup.number().label(formConfig.CCL.label),
  // [formConfig.P50E.name]: yup
  //   .number()
  //   .label(formConfig.P50E.label)
  //   .min(24)
  //   .max(28),
  // [formConfig.pregnancyTest.name]: yup
  //   .string()
  //   .label(formConfig.pregnancyTest.label)
  //   .required(),
  // [formConfig.hiv.name]: yup.string().label(formConfig.hiv.label).required(),
  // [formConfig.vdrl.name]: yup.string().label(formConfig.vdrl.label).required(),
  // [formConfig.urobilinogen.name]: yup
  //   .string()
  //   .label(formConfig.urobilinogen.label),
  // [formConfig.leukocytes.name]: yup
  //   .string()
  //   .label(formConfig.leukocytes.label)
  //   .required(),
  // [formConfig.bilirubin.name]: yup
  //   .string()
  //   .label(formConfig.bilirubin.label)
  //   .required(),
  // [formConfig.glucose.name]: yup
  //   .string()
  //   .label(formConfig.glucose.label)
  //   .required(),
  // [formConfig.specificGravity.name]: yup
  //   .string()
  //   .label(formConfig.specificGravity.label)
  //   .required(),
  // [formConfig.protein.name]: yup
  //   .string()
  //   .label(formConfig.protein.label)
  //   .required(),
  // [formConfig.nitrite.name]: yup
  //   .string()
  //   .label(formConfig.nitrite.label)
  //   .required(),
  // [formConfig.ketones.name]: yup
  //   .string()
  //   .label(formConfig.ketones.label)
  //   .required(),
  // [formConfig.blood.name]: yup
  //   .string()
  //   .label(formConfig.blood.label)
  //   .required(),
  // [formConfig.pocus.name]: yup
  //   .string()
  //   .label(formConfig.pocus.label)
  //   .required(),
  // [formConfig.ecg.name]: yup.string().label(formConfig.ecg.label).required(),
  // [formConfig.other.name]: yup
  //   .string()
  //   .label(formConfig.other.label)
  //   .required(),
});

const testStatusOptions = [
  { value: concepts.POSITIVE, label: "Positive" },
  { value: concepts.NEGATIVE, label: "Negative" },
  { value: concepts.INDETERMINATE, label: "Indeterminate" },
];
const formValues = getInitialValues(formConfig);

export const BedsideTestForm = () => {
  const { activeVisit, patientId } = getActivePatientDetails();

  const { mutate } = fetchConceptAndCreateEncounter();
  const handleSubmit = (values: any) => {
    const dateTime = getDateTime();

    const obs = [
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Arterial Blood Gas",
        groupMembers: [
          {
            concept: formConfig.PH.name,
            obsDatetime: dateTime,
            value: values[formConfig.PH.name],
          },
          {
            concept: formConfig.PCO2.name,
            obsDatetime: dateTime,
            value: values[formConfig.PCO2.name],
          },
          {
            concept: formConfig.PO2.name,
            obsDatetime: dateTime,
            value: values[formConfig.PO2.name],
          },
          {
            concept: formConfig.BASE_EXCESS.name,
            obsDatetime: dateTime,
            value: values[formConfig.BASE_EXCESS.name],
          },
        ],
      },
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Metabolic Values",
        groupMembers: [
          {
            concept: formConfig.LACTATE.name,
            obsDatetime: dateTime,
            value: values[formConfig.LACTATE.name],
          },
          {
            concept: formConfig.glucose.name,
            obsDatetime: dateTime,
            value: values[formConfig.glucose.name],
          },
        ],
      },
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Acid base status",
        groupMembers: [
          {
            concept: formConfig.HCO3.name,
            obsDatetime: dateTime,
            value: values[formConfig.HCO3.name],
          },
          {
            concept: formConfig.ANION_GAPC.name,
            obsDatetime: dateTime,
            value: values[formConfig.ANION_GAPC.name],
          },
          {
            concept: formConfig.MOSMC.name,
            obsDatetime: dateTime,
            value: values[formConfig.MOSMC.name],
          },
        ],
      },
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Oximetry values",
        groupMembers: [
          {
            concept: formConfig.SO2E.name,
            obsDatetime: dateTime,
            value: values[formConfig.SO2E.name],
          },
          {
            concept: formConfig.FO2HBE.name,
            obsDatetime: dateTime,
            value: values[formConfig.FO2HBE.name],
          },
          {
            concept: formConfig.FO2HBE.name,
            obsDatetime: dateTime,
            value: values[formConfig.FO2HBE.name],
          },
        ],
      },
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Electolyte values",
        groupMembers: [
          {
            concept: formConfig.CK.name,
            obsDatetime: dateTime,
            value: values[formConfig.CK.name],
          },
          {
            concept: formConfig.CNA.name,
            obsDatetime: dateTime,
            value: values[formConfig.CNA.name],
          },
          {
            concept: formConfig.CA2.name,
            obsDatetime: dateTime,
            value: values[formConfig.CA2.name],
          },
          {
            concept: formConfig.CCL.name,
            obsDatetime: dateTime,
            value: values[formConfig.CCL.name],
          },
        ],
      },
      {
        concept: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Temperature Corrected Values",
        groupMembers: [
          {
            concept: formConfig.PH.name,
            obsDatetime: dateTime,
            value: values[formConfig.PH.name],
          },
          {
            concept: formConfig.PCO2.name,
            obsDatetime: dateTime,
            value: values[formConfig.PCO2.name],
          },
          {
            concept: formConfig.PO2.name,
            obsDatetime: dateTime,
            value: values[formConfig.PO2.name],
          },
          {
            concept: formConfig.P50E.name,
            obsDatetime: dateTime,
            value: values[formConfig.P50E.name],
          },
        ],
      },
      {
        concept: formConfig.pregnancyTest.name,
        obsDatetime: dateTime,
        value: values[formConfig.pregnancyTest.name],
        coded: true,
      },
      {
        concept: formConfig.hiv.name,
        obsDatetime: dateTime,
        value: values[formConfig.hiv.name],
        coded: true,
      },
      {
        concept: formConfig.vdrl.name,
        obsDatetime: dateTime,
        coded: true,
        value: values[formConfig.vdrl.name],
      },
      {
        concept: formConfig.mrdt.name,
        obsDatetime: dateTime,
        coded: true,
        value: values[formConfig.mrdt.name],
      },
      {
        concepts: concepts.DESCRIPTION,
        obsDatetime: dateTime,
        value: "Dipstick",
        groupMembers: [
          {
            concept: formConfig.urobilinogen.name,
            obsDatetime: dateTime,
            value: values[formConfig.urobilinogen.name],
          },
          {
            concept: formConfig.PH.name,
            obsDatetime: dateTime,
            value: values[formConfig.PH.name],
          },
          {
            concept: formConfig.leukocytes.name,
            obsDatetime: dateTime,
            value: values[formConfig.leukocytes.name],
          },
          {
            concept: formConfig.glucose.name,
            obsDatetime: dateTime,
            value: values[formConfig.glucose.name],
          },
          {
            concept: formConfig.specificGravity.name,
            obsDatetime: dateTime,
            value: values[formConfig.specificGravity.name],
          },
          {
            concept: formConfig.specificGravity.name,
            obsDatetime: dateTime,
            value: values[formConfig.specificGravity.name],
          },
          {
            concept: formConfig.protein.name,
            obsDatetime: dateTime,
            value: values[formConfig.protein.name],
          },
          {
            concept: formConfig.nitrite.name,
            obsDatetime: dateTime,
            value: values[formConfig.nitrite.name],
          },
          {
            concept: formConfig.ketones.name,
            obsDatetime: dateTime,
            value: values[formConfig.ketones.name],
          },
          {
            concept: formConfig.bilirubin.name,
            obsDatetime: dateTime,
            value: values[formConfig.bilirubin.name],
          },
          {
            concept: formConfig.blood.name,
            obsDatetime: dateTime,
            value: values[formConfig.blood.name],
          },
        ],
      },
      {
        concept: formConfig.pocus.name,
        obsDatetime: dateTime,
        value: values[formConfig.pocus.name],
      },
      {
        concept: formConfig.other.name,
        obsDatetime: dateTime,
        value: values[formConfig.other.name],
      },
      {
        concept: formConfig.ecg.name,
        obsDatetime: dateTime,
        value: values[formConfig.ecg.name],
      },
      {
        concept: formConfig.pefr.name,
        obsDatetime: dateTime,
        value: values[formConfig.pefr.name],
      },
    ];
    mutate({
      encounterType: encounters.BED_SIDE_TEST,
      visit: activeVisit,
      patient: patientId,
      encounterDatetime: dateTime,
      obs,
    });
  };

  return (
    <FormikInit
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      initialValues={formValues}
    >
      <RadioGroupInput
        row
        label={formConfig.mrdt.label}
        options={testStatusOptions}
        name={formConfig.mrdt.name}
      />
      <br />
      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Arterial Blood Gas{" "}
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PH.name}
          label={formConfig.PH.label}
          id={formConfig.PH.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PCO2.name}
          label={formConfig.PCO2.label}
          id={formConfig.PCO2.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PO2.name}
          label={formConfig.PO2.label}
          id={formConfig.PO2.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.BASE_EXCESS.name}
          label={formConfig.BASE_EXCESS.label}
          id={formConfig.BASE_EXCESS.name}
        />
      </FormFieldContainerMultiple>

      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Metabolic Values
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.LACTATE.name}
          label={formConfig.LACTATE.label}
          id={formConfig.LACTATE.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.glucose.name}
          label={formConfig.glucose.label}
          id={formConfig.glucose.name}
        />
      </FormFieldContainerMultiple>

      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Acid base status
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.HCO3.name}
          label={formConfig.HCO3.label}
          id={formConfig.HCO3.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.ANION_GAPC.name}
          label={formConfig.ANION_GAPC.label}
          id={formConfig.ANION_GAPC.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.MOSMC.name}
          label={formConfig.MOSMC.label}
          id={formConfig.MOSMC.name}
        />
      </FormFieldContainerMultiple>

      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Oximetry values
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.SO2E.name}
          label={formConfig.SO2E.label}
          id={formConfig.SO2E.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.FO2HBE.name}
          label={formConfig.FO2HBE.label}
          id={formConfig.FO2HBE.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.FHHBE.name}
          label={formConfig.FHHBE.label}
          id={formConfig.FHHBE.name}
        />
      </FormFieldContainerMultiple>

      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Electolyte Values
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.CK.name}
          label={formConfig.CK.label}
          id={formConfig.CK.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.CNA.name}
          label={formConfig.CNA.label}
          id={formConfig.CNA.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.CA2.name}
          label={formConfig.CA2.label}
          id={formConfig.CA2.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.CCL.name}
          label={formConfig.CCL.label}
          id={formConfig.CCL.name}
        />
      </FormFieldContainerMultiple>
      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Temperature Corrected Values
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PH.name}
          label={formConfig.PH.label}
          id={formConfig.PH.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PCO2.name}
          label={formConfig.PCO2.label}
          id={formConfig.PCO2.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PO2.name}
          label={formConfig.PO2.label}
          id={formConfig.PO2.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.P50E.name}
          label={formConfig.P50E.label}
          id={formConfig.P50E.name}
        />
      </FormFieldContainerMultiple>
      <RadioGroupInput
        row
        label={formConfig.pregnancyTest.label}
        options={testStatusOptions}
        name={formConfig.pregnancyTest.name}
      />
      <RadioGroupInput
        row
        label={formConfig.hiv.label}
        options={testStatusOptions}
        name={formConfig.hiv.name}
      />
      <RadioGroupInput
        row
        label={formConfig.vdrl.label}
        options={testStatusOptions}
        name={formConfig.vdrl.name}
      />

      <Typography sx={{ mt: "2ch", mb: "1ch" }} variant="h6" color={"GrayText"}>
        Dipstick
      </Typography>

      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.urobilinogen.name}
          label={formConfig.urobilinogen.label}
          id={formConfig.urobilinogen.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.PH.name}
          label={formConfig.PH.label}
          id={formConfig.PH.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.leukocytes.name}
          label={formConfig.leukocytes.label}
          id={formConfig.leukocytes.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.glucose.name}
          label={formConfig.glucose.label}
          id={formConfig.glucose.name}
        />
      </FormFieldContainerMultiple>
      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.specificGravity.name}
          label={formConfig.specificGravity.label}
          id={formConfig.specificGravity.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.protein.name}
          label={formConfig.protein.label}
          id={formConfig.protein.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.nitrite.name}
          label={formConfig.nitrite.label}
          id={formConfig.nitrite.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.ketones.name}
          label={formConfig.ketones.label}
          id={formConfig.ketones.name}
        />
      </FormFieldContainerMultiple>
      <FormFieldContainerMultiple>
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.bilirubin.name}
          label={formConfig.bilirubin.label}
          id={formConfig.bilirubin.name}
        />
        <TextInputField
          sx={{ width: "100%" }}
          name={formConfig.blood.name}
          label={formConfig.blood.label}
          id={formConfig.blood.name}
        />
      </FormFieldContainerMultiple>
      <br />
      <br />
      <br />
      <TextInputField
        sx={{ width: "100%" }}
        multiline
        rows={5}
        name={formConfig.pocus.name}
        label={formConfig.pocus.label}
        id={formConfig.pocus.name}
      />
      <TextInputField
        sx={{ width: "100%" }}
        multiline
        rows={5}
        name={formConfig.ecg.name}
        label={formConfig.ecg.label}
        id={formConfig.ecg.name}
      />
      <TextInputField
        sx={{ width: "100%" }}
        multiline
        rows={5}
        name={formConfig.pefr.name}
        label={formConfig.pefr.label}
        id={formConfig.pefr.name}
      />
      <TextInputField
        sx={{ width: "100%" }}
        multiline
        rows={5}
        name={formConfig.other.name}
        label={formConfig.other.label}
        id={formConfig.other.name}
      />
    </FormikInit>
  );
};

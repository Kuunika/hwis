import {
  FormikInit,
  FormTimePicker,
  SearchComboBox,
  TextInputField,
  FormFieldContainerMultiple,
  UnitInputField,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { getObservations, mapSearchComboOptionsToConcepts } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { useSubmitEncounter } from "@/hooks";
import useFetchMedications from "@/hooks/useFetchMedications";
import { GiMedicines } from "react-icons/gi";
import * as Yup from "yup";

const form = {
  rhythm: {
    name: concepts.RHYTHM,
    label: "Rhythm",
  },
  shockEnergy: {
    name: concepts.SHOCK_ENERGY,
    label: "Shock Energy",
  },
  medication: {
    name: concepts.MEDICATION,
    label: "Medication",
  },
  dose: {
    name: concepts.MEDICATION_DOSE,
    label: "Dose",
  },
  route: {
    name: concepts.MEDICATION_ROUTE,
    label: "Route",
  },
  doseUnit: {
    name: concepts.MEDICATION_DOSE_UNIT,
    label: "Unit",
  },
  interventions: {
    name: concepts.INTERVENTION,
    label: "Interventions",
  },
  occurrences: {
    name: concepts.OCCURRENCES,
    label: "Occurrences",
  },
  time: {
    name: concepts.TIME,
    label: "Time",
  },
  reversibleCauses: {
    name: concepts.REVERSIBLE_CAUSES,
    label: "Reversible Causes",
  },
};

const rhythmOptions = [
  { label: "PEA", id: concepts.PEA },
  { label: "VF", id: concepts.VF },
  { label: "VT", id: concepts.VT },
  { label: "Asys", id: concepts.ASYS },
];
const medicationUnits = [
  "Milligrams (mg)",
  "Micrograms (µg)",
  "Grams (g)",
  "International Units (IU)",
  "Milliliters (ml)",
  "Millimoles (mmol)",
];

const interventions = [
  { label: "IV Access", id: concepts.IV_ACCESS },
  { label: "Intubation", id: concepts.INTUBATION },
  { label: "POCUS", id: concepts.POCUS },
  { label: "ABG", id: concepts.ABG },
  { id: concepts.POSITIONING, label: "Positioning" },
  { id: concepts.C_SPINE_STABILIZATION, label: "C-Spine Stabilization" },
  { id: concepts.SUCTIONING, label: "Suctioning" },
  { id: concepts.FOREIGN_BODY_REMOVAL, label: "Foreign body removal" },
  { id: concepts.INSERTION_OF_GUEDEL, label: 'Insertion of airway "Guedel"' },
  { id: concepts.OXYGEN_GIVEN, label: "Oxygen therapy" },
  { id: concepts.BAG_AND_MASK, label: "Bag and mask" },
  { id: concepts.INTERCOSTAL_DRAINAGE, label: "Intercostal drainage" },
  { id: concepts.INTAKE_FLUIDS, label: "Intake Fluids" },
  { id: concepts.HEMORRHAGE_CONTROL, label: "Hemorrhage control" },
  { id: concepts.BLOOD_SAMPLE, label: "Blood sample" },
  { id: concepts.CATHETER, label: "Catheter" },
  { id: concepts.TRANSFUSION, label: "Transfusion" },
  { id: concepts.NG_INSERTION, label: "NG Insertion" },
  { id: concepts.SUTURING, label: "Suturing" },
  { id: concepts.KEEP_WARM, label: "Keep warm" },
];
const routeOptions = [
  { label: "Oral", id: concepts.ORAL },
  { label: "Suppository", id: concepts.SUPPOSITORY },
  { label: "Intravenous", id: concepts.INTRAVENOUS },
  { label: "Intramuscular", id: concepts.INTRAMUSCULAR },
  { label: "Subcutaneous", id: concepts.SUBCUTANEOUS },
  { label: "Infiltration", id: concepts.INFILTRATION },
  { label: "Intrathecal", id: concepts.INTRATHECAL },
  { label: "Dermal", id: concepts.DERMAL },
  { label: "Inhaled", id: "Inh  aled" },
];

const reversibleCauses = [
  { label: "Hypoxia", id: concepts.HYPOXIA },
  { label: "Hypovolemia", id: concepts.HYPOVOLEMIA },
  { label: "Hyperkalaemia", id: concepts.HYPERKALAEMIA },
  { label: "Hypokalaemia", id: concepts.HYPOKALAEMIA },
  { label: "Hypothermia", id: concepts.HYPOTHERMIA },
  { label: "Tension Pneumothorax", id: concepts.TENSION_PNEUMOTHORAX },
  { label: "Tamponade, Cadiac", id: concepts.TAMPONADE_CARDIAC },
  { label: "Toxins", id: concepts.TOXINS },
  { label: "Thrombosis, Pulmonary", id: concepts.THROMBOSIS_PULMONARY },
  { label: "Thrombosis, Coronary", id: concepts.THROMBOSIS_CORONARY },
  { label: "Hydrogen Ions (Acidosis)", id: concepts.HYDROGEN_ION_ACIDOSIS },
];

const recordValidationSchema = Yup.object().shape({
  [form.rhythm.name]: Yup.array().required().label(form.rhythm.label),
  [form.shockEnergy.name]: Yup.string()
    .required()
    .label(form.shockEnergy.label),
  [form.medication.name]: Yup.string().required().label(form.medication.label),
  [form.dose.name]: Yup.string().required().label(form.dose.label),
  [form.route.name]: Yup.string().required().label(form.route.label),
  [form.doseUnit.name]: Yup.string().required().label(form.doseUnit.label),
  [form.interventions.name]: Yup.array()
    .required()
    .label(form.interventions.label),
  [form.occurrences.name]: Yup.string()
    .required()
    .label(form.occurrences.label),
  [form.time.name]: Yup.string().required().label(form.time.label),
  [form.reversibleCauses.name]: Yup.string()
    .required()
    .label(form.reversibleCauses.label),
});
export const RecordForm = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.CPR,
    () => {}
  );
  const { medicationOptions } = useFetchMedications();

  const handleSubmitForm = (values: any) => {
    const formValues = { ...values };

    const dateTime = getDateTime();
    const rythmObs = mapSearchComboOptionsToConcepts(
      formValues[form.rhythm.name],
      form.rhythm.label,
      dateTime
    );
    const interventionsObs = mapSearchComboOptionsToConcepts(
      formValues[form.interventions.name],
      form.rhythm.label,
      dateTime
    );
    delete formValues[form.rhythm.name];
    delete formValues[form.interventions.name];
    const obs = getObservations(formValues, dateTime);

    const observation = [
      {
        concept: concepts.CPR_RECORD,
        value: "",
        groupMembers: [...interventionsObs, ...rythmObs, ...obs],
      },
    ];

    handleSubmit(observation);
  };
  return (
    <FormikInit
      initialValues={{}}
      validationSchema={recordValidationSchema}
      onSubmit={onSubmit}
    >
      <>
        <br />
        <FormTimePicker sx={{ my: "1ch" }} name={`time`} label="Time" />
        <SearchComboBox
          name={`rhythm`}
          label="Rhythm"
          options={rhythmOptions}
          size="small"
          sx={{ width: "100%" }}
        />
        <br />
        <TextInputField
          name={`shockEnergy`}
          label="Shock Energy"
          id={`shockEnergy`}
          sx={{ width: "100%" }}
        />
        <br />
        <br />
        <FormFieldContainerMultiple>
          <SearchComboBox
            name={`medication`}
            label="Medication Name"
            options={medicationOptions}
            multiple={false}
          />
          <UnitInputField
            id={`dose`}
            label="Dose"
            name={`dose`}
            unitName={`doseUnit`}
            unitOptions={medicationUnits}
            placeholder="e.g., 500"
            sx={{ m: 0 }}
            inputIcon={<GiMedicines />}
          />
          <SearchComboBox
            multiple={false}
            name={`route`}
            label="Route"
            options={routeOptions}
            // id={`route`}
            sx={{ width: "100%" }}
          />
        </FormFieldContainerMultiple>
        <br />
        <SearchComboBox
          name={`Interventions`}
          label="Interventions"
          options={interventions}
          sx={{ width: "100%" }}
        />
        <br />
        <TextInputField
          multiline
          rows={5}
          name={`occurrences`}
          label="Occurrences"
          id={`occurrences`}
          sx={{ width: "100%" }}
        />
        <SearchComboBox
          name={form.reversibleCauses.name}
          label={form.reversibleCauses.label}
          options={reversibleCauses}
          multiple
          width="100%"
        />
      </>
    </FormikInit>
  );
};

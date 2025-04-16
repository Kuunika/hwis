// @ts-nocheck
import {
  FieldsContainer,
  FormikInit,
  FormValuesListener,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import { getInitialValues } from "@/helpers";
import { IconButton } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { concepts } from "@/constants";
import { getCirculationOptions } from "@/hooks/getCirculationOptions";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

export const InterventionFormConfig = {
  airwayIntervention: {
    name: concepts.AIRWAY_OPENING_INTERVENTIONS,
    label: "Airway intervention(s)",
  },
  breathingIntervention: {
    name: concepts.BREATHING_INTERVENTIONS,
    label: "Breathing intervention(s)",
  },
  circulationIntervention: {
    name: concepts.CIRCULATION_INTERVENTIONS,
    label: "Circulation intervention(s)",
  },
};

const schema = Yup.object().shape({});

export const InterventionsForm = ({ onSubmit, onSkip }: Prop) => {
  const initialFormValues = {
    [InterventionFormConfig.airwayIntervention.name]: [],
    [InterventionFormConfig.breathingIntervention.name]: [],
    [InterventionFormConfig.circulationIntervention.name]: [],
    fluidEntries: [
      {
        intakeFluidType: "",
        intakeFluidAmount: "",
        outputFluidType: "",
        outputFluidAmount: "",
        balance: "",
      },
    ],
  };
 


  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialFormValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      submitButtonText="Submit"
      submitButton={false}
    >
      <FormContent onSkip={onSkip} />
    </FormikInit>
  );
};

const FormContent = ({ onSkip }: { onSkip: () => void }) => {
  const { values, setFieldValue } =
    useFormikContext<typeof initialFormValues>();
  const airwayList = [
    { id: concepts.POSITIONING, label: "Positioning" },
    { id: concepts.C_SPINE_STABILIZATION, label: "C-Spine Stabilization" },
    { id: concepts.SUCTIONING, label: "Suctioning" },
    { id: concepts.FOREIGN_BODY_REMOVAL, label: "Foreign body removal" },
    { id: concepts.INSERTION_OF_GUEDEL, label: 'Insertion of airway "Guedel"' },
    { id: concepts.OTHER_AIRWAY_INTERVENTION, label: "Other" },
  ];

  const breathingList = [
    { id: concepts.OXYGEN_GIVEN, label: "Oxygen therapy" },
    { id: concepts.BAG_AND_MASK, label: "Bag and mask" },
    { id: concepts.INTERCOSTAL_DRAINAGE, label: "Intercostal drainage" },
  ];

  const circulationList = [
    { id: concepts.INTAKE_FLUIDS, label: "Intake fluids" },
    { id: concepts.HEMORRHAGE_CONTROL, label: "Hemorrhage control" },
    { id: concepts.BLOOD_SAMPLE, label: "Blood sample" },
    { id: concepts.CATHETER, label: "Catheter" },
    { id: concepts.TRANSFUSION, label: "Transfusion" },
    { id: concepts.NG_INSERTION, label: "NG Insertion" },
    { id: concepts.SUTURING, label: "Suturing" },
    { id: concepts.KEEP_WARM, label: "Keep warm" },
  ];

  const groupedOptions = [
    {
      label: "IV Fluids",
      options: [
        { value: "Ringers Lactate", label: "Ringers Lactate" },
        { value: "Saline 5%", label: "Saline 5%" },
        { value: "Saline 3%", label: "Saline 3%" },
        { value: "Saline 0.9%", label: "Saline 0.9%" },
        { value: "Saline 0.45%", label: "Saline 0.45%" },
        { value: "Dextrose 10%", label: "Dextrose 10%" },
        { value: "Dextrose 5%", label: "Dextrose 5%" },
        { value: "Haemacel", label: "Haemacel" },
      ],
    },
    {
      label: "Blood products",
      options: [
        { value: "Whole blood", label: "Whole blood" },
        { value: "Packed Red cells", label: "Packed Red cells" },
        { value: "Platelets", label: "Platelets" },
        { value: "Fresh frozen plasma", label: "Fresh frozen plasma" },
      ],
    },
    {
      label: "Oral products",
      options: [
        { value: "Water", label: "Water" },
        { value: "Juice", label: "Juice" },
      ],
    },
  ];

  const outputFluidList = [
    { id: "Urine", label: "Urine" },
    { id: "Stool", label: "Stool" },
    { id: "Nasal gastric tube drainage", label: "Nasal gastric tube drainage" },
    { id: "Vomitting", label: "Vomitting" },
    { id: "Insensible loss", label: "Insensible loss" },
  ];

  const handleAddFluidEntry = () => {
    const newEntries = [
      ...values.fluidEntries,
      {
        intakeFluidType: "",
        intakeFluidAmount: "",
        outputFluidType: "",
        outputFluidAmount: "",
        balance: "",
      },
    ];
    setFieldValue("fluidEntries", newEntries);
  };

  const { circulationOptions } = getCirculationOptions();

  const handleRemoveFluidEntry = (index: number) => {
    const newEntries = values.fluidEntries.filter((_, i) => i !== index);
    setFieldValue("fluidEntries", newEntries);
  };

  const updateFluidEntry = (index: number, field: string, value: string) => {
    const updatedEntries = values.fluidEntries.map((entry, i) => {
      if (i === index) {
        const newEntry = { ...entry, [field]: value };

        // Calculate balance whenever amounts change
        if (field === "intakeFluidAmount" || field === "outputFluidAmount") {
          const intake = parseFloat(newEntry.intakeFluidAmount) || 0;
          const output = parseFloat(newEntry.outputFluidAmount) || 0;
          newEntry.balance = intake - output;
        }

        return newEntry;
      }
      return entry;
    });

    setFieldValue("fluidEntries", updatedEntries);
  };

  const airwayOtherSelected =
    Array.isArray(values[InterventionFormConfig.airwayIntervention.name]) &&
    values[InterventionFormConfig.airwayIntervention.name]?.some(
      (item: { id: string }) => item.id === concepts.OTHER_AIRWAY_INTERVENTION
    );

  const ivFluidsSelected =
    Array.isArray(
      values[InterventionFormConfig.circulationIntervention.name]
    ) &&
    values[InterventionFormConfig.circulationIntervention.name]?.some(
      (item: { id: string }) => item.label === "IV fluids"
    );
  return (
    <>
      <FormValuesListener getValues={(values) => console.log(values)} />
      <WrapperBox>
        <SearchComboBox
          name={InterventionFormConfig.airwayIntervention.name}
          options={airwayList}
          label={InterventionFormConfig.airwayIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          getValue={(selected: any[] = []) => {
            // Add default empty array
            const hasOther = selected.some(
              (item) => item.id === concepts.OTHER_AIRWAY_INTERVENTION
            );
            if (!hasOther) {
              setFieldValue(
                `${InterventionFormConfig.airwayIntervention.name}_Other`,
                ""
              );
            }
          }}
        />

        {airwayOtherSelected && (
          <TextInputField
            name={`${InterventionFormConfig.airwayIntervention.name}_Other`}
            label="Please specify"
            sx={{ mb: "2ch" }}
          />
        )}

        <SearchComboBox
          name={InterventionFormConfig.breathingIntervention.name}
          options={breathingList}
          label={InterventionFormConfig.breathingIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
        />
<SearchComboBox
          name={InterventionFormConfig.circulationIntervention.name}
          options={circulationOptions}
          label={InterventionFormConfig.circulationIntervention.label}
          sx={{ mb: "2ch" }}
          multiple={true}
          getValue={(selected: any[]) => {
            const hasIV = selected.some(
              (item) => item.label === "IV fluids"
            );
            if (!hasIV) {
              setFieldValue("fluidEntries", [
                {
                  intakeFluidType: "",
                  intakeFluidAmount: "",
                  outputFluidType: "",
                  outputFluidAmount: "",
                  balance: "",
                },
              ]);
            }
          }}
        />
      

        {ivFluidsSelected && (
          <WrapperBox>
            {values.fluidEntries.map((entry, index) => (
              <FieldsContainer key={index}>
                <WrapperBox>
                  <GroupedSearchComboBox
                    name={`fluidEntries[${index}].intakeFluidType`}
                    label="Intake Fluid Type"
                    options={groupedOptions}
                    getValue={(value) =>
                      updateFluidEntry(index, "intakeFluidType", value)
                    }
                  />
                  <TextInputField
                    name={`fluidEntries[${index}].intakeFluidAmount`}
                    label="Intake Fluid Amount"
                    type="number"
                    unitOfMeasure="ml"
                    onChange={(value) =>
                      updateFluidEntry(index, "intakeFluidAmount", value)
                    }
                  />
                </WrapperBox>

                <WrapperBox>
                  <SearchComboBox
                    name={`fluidEntries[${index}].outputFluidType`}
                    label="Output Fluid Type"
                    options={outputFluidList}
                    getValue={(value) =>
                      updateFluidEntry(index, "outputFluidType", value)
                    }
                  />
                  <TextInputField
                    name={`fluidEntries[${index}].outputFluidAmount`}
                    label="Output Fluid Amount"
                    type="number"
                    unitOfMeasure="ml"
                    onChange={(value) =>
                      updateFluidEntry(index, "outputFluidAmount", value)
                    }
                  />
                </WrapperBox>

                <TextInputField
                  sx={{ ml: "1ch" }}
                  name={`fluidEntriesBalance_${index}`}
                  label="Fluid Balance"
                  unitOfMeasure="ml"
                  type="number"
                  disabled
                  externalValue={entry.balance} // Force update from parent
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    height: "90px",
                  }}
                >
                  <IconButton
                    disabled={index === 0}
                    onClick={() => handleRemoveFluidEntry(index)}
                    color="error"
                  >
                    <FaMinus />
                  </IconButton>
                  <IconButton onClick={handleAddFluidEntry} color="primary">
                    <FaPlus />
                  </IconButton>
                </div>
              </FieldsContainer>
            ))}
          </WrapperBox>
        )}
      </WrapperBox>

      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" />
        <MainButton
          variant="secondary"
          title="Skip"
          type="button"
          onClick={onSkip}
        />
      </WrapperBox>
    </>
  );
};

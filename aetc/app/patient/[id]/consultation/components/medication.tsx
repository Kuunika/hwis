import { FormDatePicker, MainButton, SearchComboBox, UnitInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import medicationNames from "../../../../../constants/medicationnames.json";
import { useNavigation, useParameters } from "@/hooks";
import {
    FormValuesListener,
    FormikInit, TextInputField
} from "@/components";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { TableCell } from "@mui/material";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { concepts, encounters } from "@/constants";
import { useFormLoading } from "@/hooks/formLoading";
import { getObservations } from "@/helpers";  
import { getObservationValue } from "@/helpers/emr";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Encounter } from "@/interfaces";
import { getPatientVisitTypes, } from "@/hooks/patientReg";
import { getInitialValues } from "@/helpers";
import * as Yup from "yup";




type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};


interface Medication {
    name: string;
    formulation: string;
    medication_dose: number;
    medication_dose_unit: string;
    medication_frequency: string;
    medication_route: string;
    medication_duration: number;
    medication_duration_unit: string;
    medication_date_last_taken: Date | null;
    medication_date_of_last_prescription: Date | null;
}

const medicationFormConfig = {
   // medication_name: (index: number) => ({
   //     name: `medications[${index}].MedicationName`,
   //     label: "Name",
   // }),
   medication_name: (index: number) => ({
    name: `medications[${index}].MedicationName`,
    label: "Name",
   }),
    medication_formulation: (index: number) => ({
        name: `medications[${index}].medication_formulation`,
        label: "Formulation",
    }),
    medication_dose: (index: number) => ({
        name: `medications[${index}].Medication_dose`,
        label: "Dose",
    }),
    //   medication_dose_unit: (index: number) => ({
    //     name: `medications[${index}].medication_dose_unit`,
    //     label: "Unit",
    //   }),
    medication_frequency: (index: number) => ({
        name: `medications[${index}].medication_frequency`,
        label: "Frequency",
    }),
    medication_route: (index: number) => ({
        name: `medications[${index}].medication_route`,
        label: 'Route'
    }),
    medication_duration: (index: number) => ({
        name: `medications[${index}].medication_duration`,
        label: 'Duration'
    }),
    medication_duration_unit: (index: number) => ({
        name: `medications[${index}].medication_duration_unit`,
        label: 'Unit'
    }),
    medication_date_last_taken: (index: number) => ({
        name: `medications[${index}].medication_date_last_taken`,
        label: 'Last Taken'
    }),
    medication_date_of_last_prescription: (index: number) => ({
        name: `medications[${index}].medication_date_of_last_prescription`,
        label: 'Last Prescribed'
    })
}


const durationOptions = [
    "Days",
    "Weeks",
    "Months",
    "Years",
]

const medicationUnits = [
    "Milligrams (mg)",
    "Micrograms (µg)",
    "Grams (g)",
    "International Units (IU)",
    "Milliliters (ml)",
    "Millimoles (mmol)",
];


const routeOptions = [
    { id: concepts.TABLET, label: "Oral" },
    { id: concepts.SUPPOSITORY, label: "Suppository" },
    { id: concepts.INTRAVENOUS, label: "Intravenous" },
    { id: concepts.INTRAMUSCULAR,label: "Intramuscular" },
    { id: concepts.SUBCUTANEOUS, label: "Subcutaneous" },
    { id: concepts.INFILTRATION, label: "Infiltration" },
    { id: concepts.INTRATHECAL, label: "Intrathecal" },
    { id: concepts.DERMAL, label: "Dermal" },
    { id: concepts.INHALED, label: "Inhaled" },
];

const formulationOptions = [
    { id: concepts.TABLET, label: "Tablet" },
    { id: concepts.VIAL, label: "Vial" },
    { id: concepts.INTRAVENOUS, label: "Intravenous" },
    { id: concepts.POWDER, label: "Powder" },
    { id: concepts.SOLUTION, label: "Solution" },
    { id: concepts.EYE_OINTMENT, label: "Eye Ointment" },
    { id: concepts.CREAM, label: "Cream" },
    { id: concepts.EYE_DROPS, label: "Eye Drops" },
    { id: concepts.OINTMENT, label: "Ointment" },
    { id: concepts.INHALER, label: "Inhaler" },
    { id: concepts.SUPPOSITORY, label: "Suppository" },
    { id: concepts.PESSARY, label: "Pessary" },
    { id: concepts.SUSPENSION, label: "Suspension" },
    { id: concepts.SHAMPOO, label: "Shampoo" },
    { id: concepts.EAR_DROPS, label: "Ear Drops" },
    { id: concepts.EYE_PASTE, label: "Eye Paste" },
];

const frequencyOptions = [
    { id: concepts.ONCE_A_DAY, label: '24 Hourly (OD) - Once a day ' },
    { id: concepts.TWICE_A_DAY, label: '12 Hourly (BID) - Twice a day' },
    { id: concepts.THREE_TIMES_A_DAY, label: '8 Hourly (TID) - Three times a day' },
    { id: concepts.FOUR_TIMES_A_DAY, label: '6 Hourly (QID) - Four times a day' },
    { id: concepts.SIX_TIMES_A_DAY, label: '4 Hourly (OD) - Six times a day ' },
    { id: concepts.ONCE_A_WEEK, label: 'Once a week' },
    { id: concepts.ONCE_A_MONTH, label: 'Once a month' },
    { id: concepts.OTHER, label: 'Other' },
];


export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const [medication, setMedication] = useState({});
    const [formValues, setFormValues] = useState<any>({});
    const [value, setValue] = useState<number | string>("");
    const [referral, setReferral] = useState<Encounter>();
    const [initialRegistration, setInitialRegistration] = useState<Encounter>();
    const [submittedSteps, setSubmittedSteps] = useState<Array<number>>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [medications, setMedications] = React.useState([
        {
            name: "",
            formulation: "",
            medication_dose: 0,
            medication_dose_unit: "",
            medication_frequency: "",
            medication_route: "",
            medication_duration: 0,
            medication_duration_unit: "",
            medication_date_last_taken: "",
            medication_date_of_last_prescription: ""
        },
    ]);
    const [otherFrequency, setOtherFrequency] = useState<{ [key: number]: boolean }>({});

    const {
        loading,
        setLoading,
        completed,
        setCompleted,
        message,
        setMessage,
        showForm,
        setShowForm,
        error,
        setError,
    } = useFormLoading();


    const {
        mutate: createMedications,
        isSuccess: medicationsCreated,
        isPending: creatingMedications,
        isError: medicationsError,
        data: medicationsResponse,
    } = addEncounter();

    const { navigateTo, navigateBack } = useNavigation();

    const {
        data: patientVisits,
        isLoading,
        isSuccess,
    } = getPatientVisitTypes(params?.id as string);

    const { data } = getPatientsEncounters(params?.id as string);


    const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));


    const getEncounterActiveVisit = (encounterType: string) => {
        return data
            ?.filter((d) => d?.encounter_type.uuid == encounterType)
            .find((d) => d.visit_id == activeVisit?.visit_id);

    };

    const dateTime = getDateTime();

    useEffect(() => {
        setReferral(getEncounterActiveVisit(encounters.REFERRAL));
        setInitialRegistration(
            getEncounterActiveVisit(encounters.INITIAL_REGISTRATION)
        );
    }, [data]);

    const referralHealthFacility = getObservationValue(
        referral?.obs,
        concepts.REFERRED_FROM
    );

    useEffect(() => {
        if (medicationsCreated) {
            setCompleted(1);
            setMessage("adding vitals...");

            createMedications({
                encounterType: encounters.PRESCRIPTION,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: dateTime,
                obs: getObservations(formValues.medications, dateTime),                
            });
        
        }

    }, [medicationsCreated]);

  

    const handleMedicationsSubmit = (values: any) => {
        formValues["medications"] = values;
        setActiveStep(2);
        setSubmittedSteps((steps) => [...steps, 1]);
     //    console.log(values);
      };


    const handleUpdateFrequency = (index: number, value: boolean) => {
        setOtherFrequency(prevState => ({
            ...prevState,
            [index]: value
        }));
    };

    // Update uniqueMedicationNames to accept the current index
    const uniqueMedicationNames = (medications: Medication[], currentIndex: number): boolean => {
        const names = medications.map((med, index) => (index === currentIndex ? '' : med.name)); // Ignore current name
        const uniqueNames = new Set(names);
        return names.filter(name => name).length === uniqueNames.size; // Check for uniqueness ignoring empty names
    };

   
    
   /* const schema = yup.object().shape({
        medications: yup.array().of(
          yup.object().shape({
            name: yup.string().required('Medication name is required'),
            formulation: yup.string().required('Formulation is required'),
            medication_dose: yup.number()
              .required('Dose is required')
              .positive('Dose must be greater than 0'),
            medication_dose_unit: yup.string().required('Dose unit is required'),
            medication_frequency: yup.string().required('Frequency is required'),
            medication_route: yup.string().required('Route is required'),
            medication_duration: yup.number()
              .required('Duration is required')
              .positive('Duration must be greater than 0'),
            medication_duration_unit: yup.string().required('Duration unit is required'),
            medication_date_last_taken: yup.date()
              .nullable()
              .typeError('Invalid date format')
              .required('Date of last taken is required'),
            medication_date_of_last_prescription: yup.date()
              .nullable()
              .typeError('Invalid date format')
              .required('Date of last prescription is required'),
          })
        )
      });
      */

      const schema = (index: number) => Yup.object().shape({
        [medicationFormConfig.medication_name(index).name]: Yup.string()
          .required() 
          .label(medicationFormConfig.medication_name(index).label),  
       
      });
   
    const handleAddMedication = () => {
        setMedications([...medications, {
            name: "",
            formulation: "",
            medication_dose: 0,
            medication_dose_unit: "",
            medication_frequency: "",
            medication_route: "",
            medication_duration: 0,
            medication_duration_unit: "",
            medication_date_last_taken: "",
            medication_date_of_last_prescription: ""
        }]);
    };

    const handleRemoveMedication = (index: number) => {
        const updatedMedications = medications.filter((_, i) => i !== index);
        setMedications(updatedMedications);
    };

    const handleSubmit = () => {
        handleMedicationsSubmit(formValues.medications);  
        console.log(formValues.medications); 
        console.log(medications);
        return;
        //onSubmit(formValues);
    };



    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ medications }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            submitButtonText="Submit"
            submitButton={false}
        >
            <FormValuesListener getValues={setFormValues} />
            <DynamicFormList
                items={medications}
                setItems={setMedications}
                newItem={{
                    name: "",
                    formulation: "",
                    medication_dose: 0,
                    medication_dose_unit: "",
                    medication_frequency: "",
                    medication_route: "",
                    medication_duration: 0,
                    medication_duration_unit: "",
                    medication_date_last_taken: "",
                    medication_date_of_last_prescription: ""
                }}
                renderFields={(medication, index) => (
                    <>


                        <SearchComboBox
                            name={medicationFormConfig.medication_name(index).name}
                            label={medicationFormConfig.medication_name(index).label}
                            options={medicationNames}
                            getValue={(value) => console.log("Selected value:", value)}
                            sx={{ width: '200px' }}
                            multiple={false}
                        />

                        <SearchComboBox
                            name={medicationFormConfig.medication_formulation(index).name}
                            label={medicationFormConfig.medication_formulation(index).label}
                            options={formulationOptions}
                            getValue={(value) => console.log("Selected value:", value)}
                            sx={{ width: '200px' }}
                            multiple={false}
                        />

                        <UnitInputField
                            id={medicationFormConfig.medication_dose(index).name}
                            label={medicationFormConfig.medication_dose(index).label}
                            initialValue=""
                            initialUnit={medicationUnits[0]}
                            unitOptions={medicationUnits}
                            placeholder="e.g., 500"
                            sx={{ width: '320px' }}
                            onValueChange={(value) => console.log("Entered dose:", value)}
                            onUnitChange={(unit) => console.log("Selected unit:", unit)}
                            inputIcon={<GiMedicines />}
                        />
                        {!otherFrequency[index] ? (
                            <SearchComboBox
                                name={medicationFormConfig.medication_frequency(index).name}
                                label={medicationFormConfig.medication_frequency(index).label}
                                options={frequencyOptions}
                                getValue={(value) => {
                                    if (value === 'Other') handleUpdateFrequency(index, true);
                                }}
                                sx={{ width: '180px' }}
                                multiple={false}
                            />
                        ) : (
                            <TextInputField
                                id={medicationFormConfig.medication_frequency(index).name}
                                name={medicationFormConfig.medication_frequency(index).name}
                                label="Specify frequency"
                                sx={{ width: '180px' }}
                            />
                        )}

                        <SearchComboBox
                            name={medicationFormConfig.medication_route(index).name}
                            label={medicationFormConfig.medication_route(index).label}
                            options={routeOptions}
                            sx={{ width: '150px' }}
                            multiple={false}
                        />

                        <UnitInputField
                            id={medicationFormConfig.medication_duration(index).name}
                            label={medicationFormConfig.medication_duration(index).label}
                            initialValue=""  // Replace with the appropriate initial value if needed
                            initialUnit={durationOptions[0]}   // Replace with the appropriate initial unit if needed
                            unitOptions={durationOptions}  // Pass the unit options
                            placeholder="e.g. 7"
                            onValueChange={(value) => console.log("Entered duration:", value)}
                            onUnitChange={(unit) => console.log("Selected unit:", unit)}
                            inputIcon={<IoTimeOutline />}  // Optional icon, adjust as needed
                        />
                        <FormDatePicker
                            name={medicationFormConfig.medication_date_last_taken(index).name}
                            label={medicationFormConfig.medication_date_last_taken(index).label}
                            sx={{ background: 'white', width: '150px' }}
                        />

                        <FormDatePicker
                            name={medicationFormConfig.medication_date_of_last_prescription(index).name}
                            label={medicationFormConfig.medication_date_of_last_prescription(index).label}
                            sx={{ background: 'white', width: '150px' }}
                        />

                    </>
                )}
            />
            <WrapperBox sx={{ mt: '2ch' }}>
                <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
                <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
            </WrapperBox>
        </FormikInit>
    );
}






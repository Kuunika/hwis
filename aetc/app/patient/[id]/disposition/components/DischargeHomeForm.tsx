"use client";
import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    RadioGroupInput,
    PatientInfoTab,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters, getFacilities } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Visit } from "@/interfaces";
import { closeCurrentVisit } from "@/hooks/visit";
import { useNavigation } from "@/hooks";
import { MedicationsForm } from "../../consultation/components/medication";
import { AccordionComponent } from "@/components/accordion";
import { FaPlus } from "react-icons/fa";
import { Panel } from "../../../../patient/components/panels";
import { AccordionWithMedication } from "./AccordionWithMedication";
import { getConceptSet } from "@/hooks/getConceptSet";
import { useServerTime } from "@/contexts/serverTimeContext";


const followUpOptions = [
    { id: concepts.HEALTH_CENTER, label: "Health Center" },
    { id: concepts.SPECIALIST_CLINIC, label: "Specialist Clinic" },
    { id: concepts.DISTRICT_HOSPITAL, label: "District Hospital" },
];

// Define validationSchema outside the component
const validationSchema = Yup.object({
    // dischargePlan: Yup.string().required("Discharge Plan is required"),
    // followUpPlan: Yup.string().required("Follow-Up Plan is required"),
    // homeCareInstructions: Yup.string().required(
    //     "Home Care Instructions are required"
    // ),
    // dischargeNotes: Yup.string().required("Discharge Notes are required"),
    specialistClinic: Yup.string().when('followUpPlan', {
        is: (followUpPlan: string) => followUpPlan === concepts.YES,
        then: (schema) => schema,
        otherwise: (schema) => schema.optional(),
    }),
});

const initialValues = {
    dischargePlan: "",
    followUpPlan: "",
    homeCareInstructions: "",
    followUpDetails: "",
    dischargeNotes: "",
    specialistClinic: "",
    otherServiceArea: "",
};

export default function DischargeHomeForm({ openPatientSummary }: { openPatientSummary: () => void }) {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
    const { navigateTo } = useNavigation();
    const { data: facilities } = getFacilities();
    const { init, ServerTime } = useServerTime();


    // Service Areas state
    const [serviceAreaOptions, setServiceAreaOptions] = useState<{ label: string; id: string }[]>([]);
    const [otherId, setOtherId] = useState<string | null>(null);
    const [showOther, setShowOther] = useState(false);

    // Get service areas from concept set
    const { data: serviceAreas, isLoading: serviceAreaLoading } = getConceptSet("Service areas");

    // Ref for printing
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    // Setup service areas - simplified
    useEffect(() => {
        if (serviceAreas) {
            const options = serviceAreas.map((serviceArea: any) => ({
                label: serviceArea.name,
                id: serviceArea.uuid,
            }));
            setServiceAreaOptions(options);

            // Find the "Other" option if it exists
            const otherOption = options.find((option: { id: string, label: string }) =>
                option.label === "Other"
            );
            setOtherId(otherOption ? otherOption.id : null);
        }
    }, [serviceAreas]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = ServerTime.getServerTimeString();

        // Prepare service area information
        let serviceAreaValue = values.specialistClinic;
        if (values.specialistClinic === otherId && values.otherServiceArea) {
            serviceAreaValue = values.otherServiceArea;
        }

        const obs = [
            {
                concept: concepts.DISCHARGE_HOME,
                value: concepts.DISCHARGE_HOME,
                obsDatetime: currentDateTime,
                groupMembers: [
                    {
                        concept: concepts.DISCHARGE_PLAN,
                        value: values.dischargePlan,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.FOLLOWUP_PLAN,
                        value: values.followUpPlan,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.HOME_CARE_INSTRUCTIONS,
                        value: values.homeCareInstructions,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.FOLLOWUP_DETAILS,
                        value: values.followUpDetails,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.DISCHARGE_NOTES,
                        value: values.dischargeNotes,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.SPECIALIST_CLINIC,
                        value: serviceAreaValue || "",
                        obsDatetime: currentDateTime,
                    },
                ],
            },
        ];

        const payload = {
            encounterType: encounters.DISPOSITION,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            // navigateTo("/dispositions");
            openPatientSummary()
        } catch (error) {
            console.error("Error submitting Discharge Home information: ", error);
        }
    };

    // Updated Print function using the new syntax
    const reactToPrintFn = useReactToPrint({ contentRef });

    // Create dynamic validation schema including otherServiceArea validation
    const getValidationSchema = () => {
        const schema = validationSchema.clone();

        if (otherId) {
            return schema.shape({
                otherServiceArea: Yup.string().when('specialistClinic', {
                    is: (specialistClinic: string) => specialistClinic === otherId,
                    then: (schema) => schema.required("Other Service Area is required"),
                    otherwise: (schema) => schema.optional(),
                }),
            });
        }

        return schema;
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <AccordionWithMedication />
                <MainPaper sx={{ p: 3 }}>
                    <h2>Discharge Home Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={getValidationSchema()}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        {({ values, setFieldValue }) => {
                            // Handle specialistClinic change for "Other" option
                            useEffect(() => {
                                if (values.specialistClinic === otherId) {
                                    setShowOther(true);
                                } else {
                                    setShowOther(false);
                                    setFieldValue("otherServiceArea", "");
                                }
                            }, [values.specialistClinic, otherId, setFieldValue]);

                            return (
                                <>
                                    <div ref={contentRef} className="printable-content">
                                        <div className="print-only">
                                            <PatientInfoTab />
                                            <p>
                                                <strong>Discharge Plan:</strong> {values.dischargePlan}
                                            </p>
                                            <p>
                                                <strong>Followup Plan:</strong> {values.followUpPlan}
                                            </p>
                                            <p>
                                                <strong>Home care Instructions:</strong> {values.homeCareInstructions}
                                            </p>

                                            {/* Conditionally render Follow-Up Details */}
                                            {values.followUpPlan === concepts.YES && (
                                                <>
                                                    <p>
                                                        <strong>Follow up details:</strong> {values.followUpDetails}
                                                    </p>

                                                    <p>
                                                        <strong>Service Area:</strong> {
                                                            values.specialistClinic === otherId
                                                                ? values.otherServiceArea
                                                                : serviceAreaOptions.find(option => option.id === values.specialistClinic)?.label || values.specialistClinic
                                                        }
                                                    </p>
                                                </>
                                            )}

                                            <p>
                                                <strong>Discharge notes:</strong> {values.dischargeNotes}
                                            </p>
                                        </div>
                                    </div>

                                    <MainGrid container spacing={2}>
                                        {/* Discharge Plan */}
                                        <MainGrid item xs={6}>
                                            <TextInputField
                                                id="dischargePlan"
                                                name="dischargePlan"
                                                label="Discharge Plan"
                                                sx={{ width: "100%" }}
                                                multiline
                                                rows={3}
                                                placeholder="Write the discharge plan"
                                            />
                                        </MainGrid>

                                        {/* Follow-Up Plan */}
                                        <MainGrid item xs={6}>
                                            <RadioGroupInput
                                                name="followUpPlan"
                                                label="Follow-Up Plan"
                                                options={[
                                                    { value: concepts.YES, label: "Yes" },
                                                    { value: concepts.NO, label: "No" },
                                                ]}
                                            />
                                        </MainGrid>

                                        {/* Home Care Instructions */}
                                        <MainGrid item xs={6}>
                                            <TextInputField
                                                id="homeCareInstructions"
                                                name="homeCareInstructions"
                                                label="Home Care Instructions"
                                                sx={{ width: "100%" }}
                                                multiline
                                                rows={3}
                                                placeholder="Write specific home care instructions"
                                            />
                                        </MainGrid>

                                        {/* Conditionally render Follow-Up Details and Service Area fields */}
                                        {values.followUpPlan === concepts.YES && (
                                            <>
                                                <MainGrid item xs={6}>
                                                    <SearchComboBox
                                                        name="followUpDetails"
                                                        label="Follow-Up Details"
                                                        options={
                                                            facilities
                                                                ? facilities.map((f: any) => ({
                                                                    id: f.facility_name,
                                                                    label: f.facility_name,
                                                                }))
                                                                : []
                                                        }
                                                        multiple={false}
                                                    />
                                                </MainGrid>

                                                <MainGrid item xs={6}>
                                                    {serviceAreaOptions.length > 0 && (
                                                        <SearchComboBox
                                                            name="specialistClinic"
                                                            label=" Clinics (If applicable)"
                                                            options={serviceAreaOptions}
                                                            multiple={false}
                                                        />
                                                    )}

                                                    {/* Only show "Other Service Area" field if "Other" is selected */}
                                                    {showOther && (
                                                        <TextInputField
                                                            id="otherServiceArea"
                                                            name="otherServiceArea"
                                                            label="Other Service Area"
                                                            sx={{ mt: 2 }}
                                                        />
                                                    )}
                                                </MainGrid>
                                            </>
                                        )}

                                        {/* Discharge Notes */}
                                        <MainGrid item xs={6}>
                                            <TextInputField
                                                id="dischargeNotes"
                                                name="dischargeNotes"
                                                label="Discharge Notes"
                                                sx={{ width: "100%" }}
                                                multiline
                                                rows={4}
                                                placeholder="Write discharge notes"
                                            />
                                        </MainGrid>

                                        {/* Submit & Print */}
                                        <MainGrid item xs={12}>
                                            <button
                                                type="button"
                                                onClick={() => reactToPrintFn()}
                                                style={{
                                                    marginRight: "10px",
                                                    padding: "10px 20px",
                                                    backgroundColor: "#007bff",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Print Discharge Notes
                                            </button>
                                        </MainGrid>
                                    </MainGrid>
                                </>
                            );
                        }}
                    </FormikInit>
                </MainPaper>
            </MainGrid>
            {/* CSS for Print Handling */}
            <style jsx>{`
                @media print {
                  .print-only {
                    display: block !important; /* Ensure visibility in print */
                  }
                }
                .print-only {
                  display: none; /* Hide on screen */
                }
            `}</style>
        </MainGrid>
    );
}
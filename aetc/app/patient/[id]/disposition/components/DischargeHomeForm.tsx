"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    RadioGroupInput,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";

import * as Yup from "yup";
import { toast } from "react-toastify";

const followUpOptions = [
    { id: "healthCenter", label: "Health Center" },
    { id: "specialistClinic", label: "Specialist Clinic" },
    { id: "districtHospital", label: "District Hospital" },
];

const specialistClinicOptions = [
    { id: "cardiology", label: "Cardiology" },
    { id: "neurology", label: "Neurology" },
    { id: "orthopedics", label: "Orthopedics" },
    { id: "pediatrics", label: "Pediatrics" },
    { id: "other", label: "Other" },
];

const validationSchema = Yup.object({
    dischargePlan: Yup.string().required("Discharge Plan is required"),
    followUpPlan: Yup.string().required("Follow-Up Plan is required"),
    homeCareInstructions: Yup.string().required("Home Care Instructions are required"),
    followUpDetails: Yup.string().required("Follow-Up Details are required"),
    dischargeNotes: Yup.string().required("Discharge Notes are required"),
    specialistClinic: Yup.string(),
});

const initialValues = {
    dischargePlan: "",
    followUpPlan: "",
    homeCareInstructions: "",
    followUpDetails: "",
    dischargeNotes: "",
    specialistClinic: "",
};

export default function DischargeHomeForm() {
    const { params } = useParameters();
    const { mutate: submitEncounter } = addEncounter();
    // const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    // const { data: patientVisits } = getPatientVisitTypes(params.id as string);




    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        // const obs = [
        //     {
        //         concept: concepts.DISPOSITION_OUTCOME,
        //         value: concepts.DISCHARGE_HOME,
        //         obsDatetime: currentDateTime,
        //         group_members: [
        //             { concept: concepts.DISCHARGE_PLAN, value: values.dischargePlan, obsDatetime: currentDateTime },
        //             { concept: concepts.FOLLOW_UP_PLAN, value: values.followUpPlan, obsDatetime: currentDateTime },
        //             { concept: concepts.HOME_INSTRUCTIONS, value: values.homeCareInstructions, obsDatetime: currentDateTime },
        //             { concept: concepts.FOLLOW_UP_DETAILS, value: values.followUpDetails, obsDatetime: currentDateTime },
        //             { concept: concepts.DISCHARGE_NOTES, value: values.dischargeNotes, obsDatetime: currentDateTime },
        //             { concept: concepts.SPECIALIST_CLINIC, value: values.specialistClinic || "", obsDatetime: currentDateTime },
        //         ],
        //     },
        // ];

        // const payload = {
        //     encounterType: encounters.OUTPATIENT_DIAGNOSIS,
        //     visit: activeVisit?.uuid,
        //     patient: params.id,
        //     encounterDatetime: currentDateTime,
        //     obs,
        // };

        // try {
        //     await submitEncounter(payload);
        //     toast.success("Discharge Home information submitted successfully!");
        // } catch (error) {
        //     console.error("Error submitting Discharge Home information: ", error);
        //     toast.error("Failed to submit Discharge Home information.");
        // }
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Discharge Home Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
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

                            {/* Follow-Up Details */}
                            <MainGrid item xs={6}>
                                <SearchComboBox
                                    name="followUpDetails"
                                    label="Follow-Up Details"
                                    options={followUpOptions}
                                    multiple={false}
                                />
                            </MainGrid>

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

                            {/* Specialist Clinics */}
                            <MainGrid item xs={6}>
                                <SearchComboBox
                                    name="specialistClinic"
                                    label="Specialist Clinic (if applicable)"
                                    options={specialistClinicOptions}
                                    multiple={false}
                                />
                            </MainGrid>
                            {/* Submit & Print */}
                            <MainGrid item xs={12}>
                                <button
                                    type="button"
                                    onClick={() => alert("Discharge notes will be printed")}
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
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}

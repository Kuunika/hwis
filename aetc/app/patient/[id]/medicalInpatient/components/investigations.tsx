import {
    FormikInit,
    TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
    getInitialValues,
    getObservations,
} from "@/helpers";
import { LabOrderPlanTable } from "@/app/patient/components/panels/labOrderPlanTable";
import { BedsideResults } from "@/app/patient/components/panels/bedsideResults";
import * as Yup from "yup";

const form = {
    radiological: {
        name: concepts.ASSESSMENT,
        label: "Radiological",
    },
    additionalNotes: {
        name: concepts.ADDITIONAL_NOTES,
        label: "Other Tests",
    },
    managementPlan: {
        name: concepts.PLAN,
        label: "Management Plan",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const Investigations = ({ onClose }: { onClose: (values: any) => void }) => {
    const { ServerTime } = useServerTime();

    const handleSubmit = (values: any) => {
        const obsDatetime = ServerTime.getServerTimeString();
        const obs = getObservations(values, obsDatetime);

        // Pass the radiological, additional notes and management plan observations back to the workflow for final submission
        onClose(obs);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Instructions Banner */}
            <div style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #fbbf24",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "25px",
                fontSize: "0.95rem",
                color: "#92400e",
                fontWeight: "500"
            }}>
                Only record here if samples have been obtained/X-ray forms completed
            </div>

            {/* Bedside Results Section */}
            <div style={{ marginBottom: "30px" }}>
                <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    paddingBottom: "8px"
                }}>
                    Bedside
                </h3>
                <BedsideResults data={[]} />
            </div>

            {/* Lab Results Section */}
            <div style={{ marginBottom: "30px" }}>
                <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    paddingBottom: "8px"
                }}>
                    Laboratory
                </h3>
                <LabOrderPlanTable />
            </div>

            {/* Radiological Section */}
            <div style={{ marginBottom: "30px" }}>
                <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    paddingBottom: "8px"
                }}>
                    Radiological
                </h3>
                <FormikInit
                    validationSchema={schema}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    submitButtonText="Complete"
                >
                    <TextInputField
                        multiline
                        rows={6}
                        name={form.radiological.name}
                        label={form.radiological.label}
                        id={form.radiological.name}
                        sx={{ width: "100%", marginBottom: "10px" }}
                        placeholder="Enter radiological findings, imaging results, or interpretations..."
                    />

                    {/* Additional Notes Section */}
                    <div style={{ marginTop: "30px" }}>
                        <h3 style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginBottom: "15px",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                            paddingBottom: "8px"
                        }}>
                            Other Tests                        </h3>
                        <TextInputField
                            multiline
                            rows={6}
                            name={form.additionalNotes.name}
                            label={form.additionalNotes.label}
                            id={form.additionalNotes.name}
                            sx={{ width: "100%", marginBottom: "10px" }}
                            placeholder="Enter any additional investigation notes, observations, or recommendations..."
                        />
                    </div>

                    {/* Management Plan Section */}
                    <div style={{ marginTop: "30px" }}>
                        <h3 style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            marginBottom: "15px",
                            color: "#374151",
                            borderBottom: "2px solid #e5e7eb",
                            paddingBottom: "8px"
                        }}>
                            Management Plan
                        </h3>
                        <TextInputField
                            multiline
                            rows={6}
                            name={form.managementPlan.name}
                            label={form.managementPlan.label}
                            id={form.managementPlan.name}
                            sx={{ width: "100%" }}
                            placeholder="Enter the management plan including medications, interventions, and follow-up care..."
                        />
                    </div>
                </FormikInit>
            </div>
        </div>
    );
};
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
import * as Yup from "yup";

const form = {
    managementPlan: {
        name: concepts.PLAN,
        label: "Management Plan",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const ManagementPlan = ({ onClose }: { onClose: (values: any) => void }) => {
    const { ServerTime } = useServerTime();

    const handleSubmit = (values: any) => {
        const obsDatetime = ServerTime.getServerTimeString();
        const obs = getObservations(values, obsDatetime);

        // Pass the management plan observations back to the workflow for final submission
        onClose(obs);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Instructions Banner */}
            <div style={{
                backgroundColor: "#e0f2fe",
                border: "1px solid #0ea5e9",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "25px",
                fontSize: "0.95rem",
                color: "#0c4a6e",
                fontWeight: "500"
            }}>
                Document the comprehensive management plan including medications, interventions, and follow-up care
            </div>

            <FormikInit
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitButtonText="Complete"
            >
                <div style={{ marginBottom: "20px" }}>
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
                        rows={8}
                        name={form.managementPlan.name}
                        label={form.managementPlan.label}
                        id={form.managementPlan.name}
                        sx={{ width: "100%" }}
                        placeholder="Enter the management plan including medications, interventions, and follow-up care..."
                    />
                </div>
            </FormikInit>
        </div>
    );
};
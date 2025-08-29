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
    additionalNotes: {
        name: concepts.ADDITIONAL_NOTES,
        label: "Additional Notes",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const Investigations = ({ onClose }: { onClose: () => void }) => {
    const { ServerTime } = useServerTime();

    const handleSubmit = (values: any) => {
        const obsDatetime = ServerTime.getServerTimeString();
        const obs = getObservations(values, obsDatetime);
        onClose();
    };

    return (
        <div style={{ padding: "20px" }}>
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
                    Bedside Results
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
                    Lab Results
                </h3>
                <LabOrderPlanTable />
            </div>

            {/* Additional Notes Section */}
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "#374151",
                    borderBottom: "2px solid #e5e7eb",
                    paddingBottom: "8px"
                }}>
                    Additional Notes
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
                        name={form.additionalNotes.name}
                        label={form.additionalNotes.label}
                        id={form.additionalNotes.name}
                        sx={{ width: "100%" }}
                        placeholder="Enter any additional investigation notes, observations, or recommendations..."
                    />
                </FormikInit>
            </div>
        </div>
    );
};
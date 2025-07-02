import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllDeathReports, useUpdateDeathReport } from "@/hooks/patientReg";
import { DeathReport } from "@/interfaces";
import { useParameters } from "@/hooks";
import { BackButton } from "@/components";
import { useNavigation } from "@/hooks";
import { FaAngleLeft } from "react-icons/fa6";
import { RadioGroupInput } from "@/components"; // Import your custom RadioGroupInput
import { FormDatePickerToday } from "@/components"; // Import your custom FormDatePicker
import { SelectInputField } from "@/components";
import { FormTimePickerNow } from "@/components";


import { Formik, Form, Field } from "formik";
import dayjs from "dayjs";

export const BroughtDeadEdit = () => {
    const { params } = useParameters();
    const { navigateTo } = useNavigation();
    const [deathReport, setDeathReport] = useState<DeathReport | null>(null);
    const { data, isLoading: isLoadingReports } = getAllDeathReports();
    const updateMutation = useUpdateDeathReport();

    useEffect(() => {
        if (data) {
            const report = data.find((report) => report.id == Number(params.id));
            setDeathReport(report as DeathReport);
        }
    }, [params.id, data]);

    const handleSubmit = async (values: any) => {
        try {
            await updateMutation.mutateAsync({
                id: Number(params.id),
                data: values
            });
            navigateTo(`/registration/death/${params.id}/view`);
        } catch (error) {
            console.error("Error updating death report:", error);
        }
    };

    // Helper function to render appropriate field based on field type and name
    const renderField = (key: string, value: any) => {
        // Special handling for gender field
        if (key === "gender_deceased") {
            return (
                <RadioGroupInput
                    label={key.replace(/_/g, " ").toUpperCase()}
                    name={key}
                    options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                    ]}
                    row
                />
            );
        }
        // Special handling for date fields
        else if (key === "date_of_death" || key === "date_of_arrival" || key === "date_confirming_death" || key === "date_of_birth") {
            return (
                <FormDatePickerToday
                    name={key}
                    label={key.replace(/_/g, " ").toUpperCase()}
                    width="100%"
                />
            );
        }
        else if (key === "religion") {
            return (
                <SelectInputField

                    name={key}
                    selectItems={[
                        { name: "Christianity", value: "Christianity" },
                        { name: "Muslim", value: "Muslim" },
                        { name: "Buddhism", value: "Buddhism" },
                        { name: "Rastafarian", value: "Rastafarian" },
                        { name: "Atheist", value: "Atheist" },
                        { name: "Traditional", value: "Traditional" },
                        { name: "Other", value: "Other" },
                    ]}
                    label={key.replace(/_/g, " ").toUpperCase()}
                    id={key}
                />

            );
        }
        // Special handling for time fields
        else if (
            key === "time_of_death" ||
            key === "time_of_arrival" ||
            key === "time_of_injury" ||
            key === "time_confirming_death"
        ) {
            return (
                <FormTimePickerNow
                    name={key}
                    label={key.replace(/_/g, " ").toUpperCase()}
                    width="100%"
                />
            );
        }
        // Special handling for time fields
        // else if (key === "time_of_death" || key === "time_of_arrival") {
        //     return (
        //         <FormTimePicker
        //             name={key}
        //             label={key.replace(/_/g, " ").toUpperCase()}
        //             width="100%"
        //         />
        //     );
        // }

        // Boolean fields as checkboxes
        else if (typeof value === "boolean") {
            return (
                <Field name={key}>
                    {({ field }: any) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={key}
                                    checked={!!field.value}
                                    onChange={field.onChange}
                                />
                            }
                            label={key.replace(/_/g, " ").toUpperCase()}
                        />
                    )}
                </Field>
            );
        }
        // All other fields as text fields
        else {
            return (
                <Field name={key}>
                    {({ field }: any) => (
                        <TextField
                            fullWidth
                            label={key.replace(/_/g, " ").toUpperCase()}
                            {...field}
                            variant="outlined"
                            margin="normal"
                        />
                    )}
                </Field>
            );
        }
    };

    if (isLoadingReports || !deathReport) return <Typography>Loading...</Typography>;

    return (
        <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Box
                    onClick={() => navigateTo(`/registration/death/list`)}
                    sx={{ display: "flex", alignItems: "center", mb: 2, cursor: "pointer" }}
                >
                    <Box sx={{ width: "24px", height: "24px", fontSize: "20px" }}>
                        <FaAngleLeft />
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "21px",
                            letterSpacing: "0em",
                            ml: 1,
                        }}
                    >
                        Back to List
                    </Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                    Edit Death Report
                </Typography>

                <Formik
                    initialValues={{
                        ...deathReport,
                        time_of_death: deathReport.time_of_death
                            ? dayjs(deathReport.time_of_death).format("HH:mm:ss")
                            : "",
                        time_of_arrival: deathReport.time_of_arrival
                            ? dayjs(deathReport.time_of_arrival).format("HH:mm:ss")
                            : "",
                        time_of_injury: deathReport.time_of_injury
                            ? dayjs(deathReport.time_of_injury).format("HH:mm:ss")
                            : "",
                        time_confirming_death: deathReport.time_confirming_death
                            ? dayjs(deathReport.time_confirming_death).format("HH:mm:ss")
                            : "",
                    }} onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Grid container spacing={2}>
                                {Object.entries(deathReport).map(
                                    ([key, value]) =>
                                        key !== "id" &&
                                        key !== "created_at" &&
                                        key !== "updated_at" && (
                                            <Grid item xs={12} sm={6} key={key}>
                                                {renderField(key, value)}
                                            </Grid>
                                        )
                                )}
                            </Grid>
                            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => navigateTo(`/registration/death/list`)}
                                    sx={{ mr: 2 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Update"
                                    )}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};
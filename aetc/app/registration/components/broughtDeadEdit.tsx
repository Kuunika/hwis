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

export const BroughtDeadEdit = () => {
    const { params } = useParameters();
    const { navigateTo } = useNavigation(); // Initialize navigation
    const [deathReport, setDeathReport] = useState<DeathReport | null>(null);
    const [formData, setFormData] = useState<any>({});
    const { data, isLoading: isLoadingReports } = getAllDeathReports();
    const updateMutation = useUpdateDeathReport();

    useEffect(() => {
        if (data) {
            const report = data.find((report) => report.id == Number(params.id));
            setDeathReport(report as DeathReport);
            setFormData(report || {});
        }
    }, [params.id, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync({
                id: Number(params.id),
                data: formData
            });
            // Redirect to view page after successful update
            // navigateTo(`/brought-dead/view/${params.id}`);
            navigateTo(`/registration/death/${params.id}/view`)

        } catch (error) {
            console.error("Error updating death report:", error);
        }
    };

    if (isLoadingReports || !deathReport) return <Typography>Loading...</Typography>;

    return (
        <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Box
                    onClick={() => navigateTo(`/registration/death/list`)
                    } sx={{ display: "flex", alignItems: "center", mb: 2, cursor: "pointer" }}
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
                </Box>                <Typography variant="h5" gutterBottom>
                    Edit Death Report
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {Object.entries(deathReport).map(
                            ([key, value]) =>
                                key !== "id" &&
                                key !== "created_at" &&
                                key !== "updated_at" && (
                                    <Grid item xs={12} sm={6} key={key}>
                                        {typeof value === "boolean" ? (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name={key}
                                                        checked={!!formData[key]}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label={key.replace(/_/g, " ").toUpperCase()}
                                            />
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label={key.replace(/_/g, " ").toUpperCase()}
                                                name={key}
                                                value={formData[key] || ""}
                                                onChange={handleChange}
                                                variant="outlined"
                                                margin="normal"
                                            />
                                        )}
                                    </Grid>
                                )
                        )}
                    </Grid>
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigateTo(`/registration/death/list`)
                            }
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
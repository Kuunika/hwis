import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

import { useEffect, useState } from "react";
import { getAllDeathReports } from "@/hooks/patientReg";
import { DeathReport } from "@/interfaces";
import { useParameters } from "@/hooks";
import { BackButton } from "@/components";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigation } from "@/hooks";

export const BroughtDeadView = () => {
  const { params } = useParameters();
  const [deathReport, setDeathReport] = useState<DeathReport | null>(null);
  const { data } = getAllDeathReports();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const report = data?.find((report) => report.id == Number(params.id));
      setDeathReport(report as DeathReport);
    };
    fetchData();
  }, [params.id, data]);

  if (!deathReport) return <Typography>Loading...</Typography>;

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
        </Box>        
        <Typography variant="h5" gutterBottom>
          Death Report Details
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(deathReport).map(
            ([key, value]) =>
              key !== "id" &&
              key !== "created_at" &&
              key !== "updated_at" && (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2" color="textSecondary">
                    {key.replace(/_/g, " ").toUpperCase()}:
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : value?.toString()}
                  </Typography>
                </Grid>
              )
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

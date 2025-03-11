import { Button, Grid, Paper } from "@mui/material";
import { Vitals } from "../visits";

export const VisitHistory = () => {
  return (
    <>
      <style>
        {`
         .noData {
            border: #a3a1a1 solid 1px;
            border-style: dashed;
            border-radius: 5px;
            padding: 10px;
            text-align: center;
            margin-bottom: 10px;
            margin-top: 10px;
            margin-right: 10px;
        }
        `}
      </style>
      <Paper style={{ marginTop: "10px" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <div style={{ padding: "15px" }}>
              <div>
                <Button
                  size="large"
                  style={{
                    width: "100%",
                    backgroundColor: "#DDEEDD",
                    marginBottom: "8px",
                  }}
                  variant="outlined"
                >
                  25 Feb, 2025
                </Button>
              </div>
              <div>
                <Button
                  size="large"
                  style={{ width: "100%", marginBottom: "8px" }}
                  variant="outlined"
                >
                  26 Feb, 2025
                </Button>
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              borderLeft: "1px solid #B3B3B3",
              paddingLeft: "15px",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            <div className="noData">No Vitals were recorded</div>
            <div>
              <Vitals />
            </div>
            <div className="noData">No Investigations were recorded</div>
            <div className="noData">No Medication were recorded</div>
            <div className="noData">No Clinical Notes were recorded</div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

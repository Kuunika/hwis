import { WrapperBox, MainButton } from "@/components";
import { useVitalsGraphData } from "@/hooks";
import LineChartComponent from "./lineChart";
import { Box } from "@mui/material";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";

export const Charts = () => {
  const {
    setSelectedChartBottom,
    setSelectedChartTop,
    chartLoading,
    isLoading,
    selectedChartBottom,
    chartData,
    selectedChartTop,
  } = useVitalsGraphData();
  const handleButtonClickTop = (selectedChartType: string) => {
    setSelectedChartTop(selectedChartType);
  };

  const handleButtonClickBottom = (selectedChartType: string) => {
    setSelectedChartBottom(selectedChartType);
  };

  const inActiveButtonStyle = {
    backgroundColor: "white",
    color: "green",
    border: "1px solid green",
  };
  return (
    <ContainerLoaderOverlay height="10" loading={chartLoading || isLoading}>
      <Box
        sx={{
          display: "flex",
          gap: "1ch",
          marginTop: "1ch",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "1ch",
            }}
          >
            <MainButton
              title={"BP"}
              onClick={() => handleButtonClickTop("bp")}
              sx={{
                margin: "0 1ch 0 0",
                borderRadius: "5px",
                ...(selectedChartTop === "bp" ? {} : inActiveButtonStyle),
              }}
            />
            <MainButton
              title={"HeartRate"}
              onClick={() => handleButtonClickTop("hr")}
              sx={{
                borderRadius: "5px",
                ...(selectedChartTop === "hr" ? {} : inActiveButtonStyle),
              }}
            />
          </div>
          {selectedChartTop === "bp" && (
            <LineChartComponent
              key={`top-bp-${JSON.stringify(chartData.xAxisData)}`}
              chartData={chartData}
              xAxisData={chartData.xAxisData}
              series={[
                {
                  key: "systolicbpData",
                  label: "Systolic BP",
                  color: "#FF6B6B",
                },
                {
                  key: "diastolicbpData",
                  label: "Diastolic BP",
                  color: "#4A90E2",
                },
              ]}
            />
          )}
          {selectedChartTop === "hr" && (
            <LineChartComponent
              key={`top-hr-${JSON.stringify(chartData.xAxisData)}`}
              chartData={chartData}
              xAxisData={chartData.xAxisData}
              series={[
                { key: "heartRateData", label: "Heart Rate", color: "green" },
              ]}
            />
          )}
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "1ch",
            }}
          >
            <MainButton
              title={"Glucose"}
              onClick={() => handleButtonClickBottom("glu")}
              sx={{
                margin: "0 1ch 0 0",
                borderRadius: "5px",
                ...(selectedChartBottom === "glu" ? {} : inActiveButtonStyle),
              }}
            />
            <MainButton
              title={"Temp"}
              onClick={() => handleButtonClickBottom("temp")}
              sx={{
                margin: "0 1ch 0 0",
                borderRadius: "5px",
                ...(selectedChartBottom === "temp" ? {} : inActiveButtonStyle),
              }}
            />
            <MainButton
              title={"RR"}
              onClick={() => handleButtonClickBottom("rr")}
              sx={{
                borderRadius: "5px",
                ...(selectedChartBottom === "rr" ? {} : inActiveButtonStyle),
              }}
            />
          </div>

          {selectedChartBottom === "glu" && (
            <LineChartComponent
              key={`bottom-glu-${JSON.stringify(chartData.xAxisData)}`}
              chartData={chartData}
              xAxisData={chartData.xAxisData}
              series={[
                { key: "glucoseData", label: "Glucose", color: "purple" },
              ]}
            />
          )}
          {selectedChartBottom === "temp" && (
            <LineChartComponent
              key={`bottom-temp-${JSON.stringify(chartData.xAxisData)}`}
              chartData={chartData}
              xAxisData={chartData.xAxisData}
              series={[
                { key: "tempData", label: "Temperature", color: "orange" },
              ]}
            />
          )}
          {selectedChartBottom === "rr" && (
            <LineChartComponent
              key={`bottom-rr-${JSON.stringify(chartData.xAxisData)}`}
              chartData={chartData}
              xAxisData={chartData.xAxisData}
              series={[
                { key: "rrData", label: "Respiratory Rate", color: "cyan" },
              ]}
            />
          )}
        </div>
      </Box>
    </ContainerLoaderOverlay>
  );
};

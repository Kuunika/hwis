import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const formatDate = (value) => {
  if (value == null) return 'NaN';
  const date = new Date(value);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
};

const LineChartComponent = ({ chartData, xAxisData, series, height = 300 }) => {
  return (
    <LineChart
      xAxis={[{ scaleType: "utc", data: xAxisData, valueFormatter: (value) => (value == null ? 'No Data' : formatDate(value)) }]}
      series={series.map((s, index) => ({
        data: chartData[s.key],
        label: s.label,
        color: s.color,
        valueFormatter: (value) => (value == null ? 'No data' : value.toString()),
      }))}
      height={height}
      grid={{horizontal:true}}
      margin={{ top: 50, bottom: 30 }}
    />
  );
};

export default LineChartComponent;


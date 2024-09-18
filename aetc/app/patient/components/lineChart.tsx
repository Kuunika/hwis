import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const formatDate = (value: any) => {
  if (value == null) return 'NaN';
  const date = new Date(value);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;
};

const LineChartComponent = ({ chartData, xAxisData, series, height = 300 }: { chartData: any, xAxisData: any, series: any, height?: any }) => {
  return (
    <LineChart
      xAxis={[{ scaleType: "utc", data: xAxisData, valueFormatter: (value) => (value == null ? 'No Data' : formatDate(value)) }]}
      series={series.map((s: any, index: any) => ({
        data: chartData[s.key],
        label: s.label,
        color: s.color,
        valueFormatter: (value: any) => (value == null ? 'No data' : value.toString()),
        connectNulls: true,
      }))}
      height={height}
      grid={{ horizontal: true }}
      margin={{ top: 50, bottom: 30 }}
    />
  );
};

export default LineChartComponent;


import { ListStats } from "../Dashboard";
import dynamic from "next/dynamic";

// Found this on https://stackoverflow.com/questions/68596778/next-js-window-is-not-defined
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ListBarChartProps {
  stats: ListStats;
}

export default function ListBarChart({ stats }: ListBarChartProps) {
  const ChartData = {
    options: {
      chart: {
        id: "basic-bar",
        stacked: true,
        toolbar: { show: false },
      },
      title: {
        text: `Words Total: ${
          stats.learned + stats.learning + stats.readyToReview + stats.unlearned
        }`,
      },
      plotOptions: { bar: { horizontal: true } },
      xaxis: {
        categories: [""],
        labels: { show: false },
      },
      yaxis: {
        labels: { style: { fontWeight: 800 } },
      },
      grid: { padding: { top: -30, bottom: -10, left: -5, right: -45 } },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
    },
    series: [
      {
        name: "Ready to water",
        data: [stats.readyToReview],
      },
      {
        name: "Mature",
        data: [stats.learned],
      },
      {
        name: "Growing",
        data: [stats.learning],
      },
      {
        name: "Seeds left",
        data: [stats.unlearned],
      },
    ],
  };

  return (
    <ReactApexChart
      options={ChartData.options}
      series={ChartData.series}
      type="bar"
      width="95%"
      height="100"
    />
  );
}

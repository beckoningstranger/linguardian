import { ListStats } from "../Dashboard";
import dynamic from "next/dynamic";

// Found this on https://stackoverflow.com/questions/68596778/next-js-window-is-not-defined
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ListBarChartProps {
  stats: ListStats;
}

export default function ListPieChart({ stats }: ListBarChartProps) {
  const ChartData = {
    colors: [],
    options: {
      chart: {
        id: "basic-bar",
        stacked: true,
        toolbar: { show: false },
      },
      plotOptions: {
        pie: {
          donut: {
            background: "transparent",
            size: "70%",
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: false,
                label: "Words total",
                fontWeight: 600,
                color: "#000",
              },
            },
          },
        },
      },
      legend: { position: "bottom", fontSize: "16px" },
      grid: { padding: { top: 0, bottom: 0, left: -50, right: -50 } },

      labels: ["Ready to water", "Mature", "Growing", "Seeds left"],
      dataLabels: {
        enabled: false,
      },
    },
    series: [
      stats.readyToReview,
      stats.learned,
      stats.learning,
      stats.unlearned,
    ],
    chartOptions: {},
  };

  return (
    <ReactApexChart
      options={ChartData.options}
      series={ChartData.series}
      type="donut"
      width="100%"
      height="300"
    />
  );
}

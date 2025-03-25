"use client";

import { ListStats } from "@/lib/types";
import dynamic from "next/dynamic";

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
            size: "80%",
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: false,
                label: "Items total",
                fontWeight: 600,
                color: "#000",
              },
            },
          },
        },
      },
      grid: { padding: { top: 0, bottom: 0, left: 0, right: 0 } },

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
    <div className="">
      <ReactApexChart
        options={ChartData.options}
        series={ChartData.series}
        type="donut"
        width="100%"
        className="flex h-[336px] items-center"
      />
    </div>
  );
}

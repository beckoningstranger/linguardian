"use client";

import { ListStats } from "@/lib/types";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ListBarChartProps {
  stats: ListStats;
  height?: number;
  width?: number;
  mode: "dashboard" | "listoverview";
}

export default function ListPieChart({
  stats,
  height,
  width,
  mode,
}: ListBarChartProps) {
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
            size: "65%",
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
      legend: { show: false },
    },
    series: [
      stats.readyToReview,
      stats.learned,
      stats.learning,
      stats.unlearned,
    ],
    chartOptions: {},
  };

  if (mode === "dashboard") {
    return (
      <ReactApexChart
        options={ChartData.options}
        series={ChartData.series}
        type="donut"
        height={height}
        width={width}
      />
    );
  } else {
    return (
      <div className="hidden rounded-md bg-white/90 tablet:grid tablet:place-items-center desktopxl:row-span-2 desktopxl:grid desktopxl:w-[400px] desktopxl:place-items-center desktopxl:p-0">
        <ReactApexChart
          options={ChartData.options}
          series={ChartData.series}
          type="donut"
          height={320}
          width={320}
        />
      </div>
    );
  }
}

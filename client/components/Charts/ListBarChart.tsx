"use client";

import { ListStats } from "@/lib/types";
import dynamic from "next/dynamic";

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
        text: `Items Total: ${
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
      grid: { padding: { top: -30, bottom: -10, left: -5, right: -5 } },
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
    <div className="grid max-h-[120px] bg-white/90 py-4 tablet:hidden">
      <ReactApexChart
        options={ChartData.options}
        series={ChartData.series}
        type="bar"
        height={100}
        width={"100%"}
      />
    </div>
  );
}

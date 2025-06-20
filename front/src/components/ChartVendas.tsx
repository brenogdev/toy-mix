"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, parseISO } from "date-fns";
import { formatarMoedaBr } from "@/utils/formatarData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VendaDia {
  data: string;
  total: number;
}

interface ChartVendasProps {
  vendasPorDia: VendaDia[];
}

export default function ChartVendas({ vendasPorDia }: ChartVendasProps) {
  const data = {
    labels: vendasPorDia.map((v) => format(parseISO(v.data), "dd/MM/yyyy")),
    datasets: [
      {
        label: "Total de Vendas",
        data: vendasPorDia.map((v) => v.total),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatarMoedaBr(
              context.parsed.y
            )}`;
          },
        },
      },
    },
  };
  return <Line data={data} options={options} />;
}

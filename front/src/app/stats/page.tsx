"use client";
import Link from "next/link";
import PrivateRoute from "../../components/PrivateRoute";
import { useEffect, useState } from "react";
import api from "@/services/api";
import ChartVendas from "@/components/ChartVendas";
import { formatarMoedaBr } from "@/utils/formatarData";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function StatsPage() {
  const [vendasPorDia, setVendasPorDia] = useState<
    { data: string; total: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [topClients, setTopClients] = useState<any>(null);
  const [loadingTop, setLoadingTop] = useState(true);
  const [erroTop, setErroTop] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [erroSummary, setErroSummary] = useState("");

  useEffect(() => {
    async function fetchVendasPorDia() {
      setLoading(true);
      setErro("");
      try {
        const res = await api.get("/stats/daily-sales");
        setVendasPorDia(res.data || []);
      } catch {
        setErro("Erro ao buscar gráfico de vendas");
      }
      setLoading(false);
    }
    fetchVendasPorDia();
  }, []);

  useEffect(() => {
    async function fetchTopClients() {
      setLoadingTop(true);
      setErroTop("");
      try {
        const res = await api.get("/stats/top-clients");
        setTopClients(res.data || {});
      } catch {
        setErroTop("Erro ao buscar ranking de clientes");
      }
      setLoadingTop(false);
    }
    fetchTopClients();
  }, []);

  useEffect(() => {
    async function fetchSummary() {
      setLoadingSummary(true);
      setErroSummary("");
      try {
        const res = await api.get("/stats/summary");
        setSummary(res.data || {});
      } catch {
        setErroSummary("Erro ao buscar totais gerais");
      }
      setLoadingSummary(false);
    }
    fetchSummary();
  }, []);

  // Função para exportar para Excel
  function exportarExcel() {
    // Sheet 1: Totais gerais
    const totais = [
      ["Total de vendas", summary?.totalVendas ?? 0],
      ["Qtd. de vendas", summary?.qtdVendas ?? 0],
      ["Total de clientes", summary?.totalClientes ?? 0],
      ["Ticket médio", summary?.ticketMedio ?? 0],
    ];
    const wsTotais = XLSX.utils.aoa_to_sheet([
      ["Totais Gerais"],
      ["Descrição", "Valor"],
      ...totais,
    ]);

    // Sheet 2: Ranking
    const ranking = [
      ["Categoria", "Nome", "E-mail"],
      [
        "Maior volume",
        topClients?.maior_volume?.nome || "-",
        topClients?.maior_volume?.email || "-",
      ],
      [
        "Maior média",
        topClients?.maior_media?.nome || "-",
        topClients?.maior_media?.email || "-",
      ],
      [
        "Maior frequência",
        topClients?.maior_frequencia?.nome || "-",
        topClients?.maior_frequencia?.email || "-",
      ],
    ];
    const wsRanking = XLSX.utils.aoa_to_sheet([
      ["Ranking de Clientes"],
      ...ranking,
    ]);

    // Sheet 3: Gráfico de vendas por dia
    const vendasDia = [["Data", "Total (R$)"]].concat(
      vendasPorDia.map((v) => [v.data, v.total])
    );
    const wsVendasDia = XLSX.utils.aoa_to_sheet([
      ["Vendas por Dia"],
      ...vendasDia,
    ]);

    // Monta o workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTotais, "Totais Gerais");
    XLSX.utils.book_append_sheet(wb, wsRanking, "Ranking");
    XLSX.utils.book_append_sheet(wb, wsVendasDia, "Vendas por Dia");

    // Gera o arquivo e baixa
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "dashboard-toy-mix.xlsx"
    );
  }

  // Função para exportar para PDF
  function exportarPDF() {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text("Dashboard - Toy Mix", 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Totais Gerais", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Descrição", "Valor"]],
      body: [
        ["Total de vendas", formatarMoedaBr(summary?.totalVendas ?? 0)],
        ["Qtd. de vendas", summary?.qtdVendas ?? 0],
        ["Total de clientes", summary?.totalClientes ?? 0],
        ["Ticket médio", formatarMoedaBr(summary?.ticketMedio ?? 0)],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 8;
    doc.text("Ranking de Clientes", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Categoria", "Nome", "E-mail"]],
      body: [
        [
          "Maior volume",
          topClients?.maior_volume?.nome || "-",
          topClients?.maior_volume?.email || "-",
        ],
        [
          "Maior média",
          topClients?.maior_media?.nome || "-",
          topClients?.maior_media?.email || "-",
        ],
        [
          "Maior frequência",
          topClients?.maior_frequencia?.nome || "-",
          topClients?.maior_frequencia?.email || "-",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 8;
    doc.text("Vendas por Dia", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Data", "Total (R$)"]],
      body: vendasPorDia.map((v) => [v.data, formatarMoedaBr(v.total)]),
      theme: "grid",
      styles: { fontSize: 10 },
    });
    doc.save("dashboard-toy-mix.pdf");
  }

  return (
    <PrivateRoute>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Voltar para início
          </Link>
          <div className="flex gap-2">
            <button
              onClick={exportarExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow transition text-sm"
            >
              Exportar para Excel
            </button>
            <button
              onClick={exportarPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow transition text-sm"
            >
              Exportar para PDF
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Estatísticas</h2>
        {/* Totais gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gray-600 font-bold text-lg mb-1">
              Total de vendas
            </span>
            <div className="mt-2 text-2xl font-semibold text-blue-700">
              {loadingSummary
                ? "..."
                : erroSummary
                ? "-"
                : formatarMoedaBr(summary?.totalVendas || 0)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gray-600 font-bold text-lg mb-1">
              Qtd. de vendas
            </span>
            <div className="mt-2 text-2xl font-semibold text-blue-700">
              {loadingSummary
                ? "..."
                : erroSummary
                ? "-"
                : summary?.qtdVendas ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gray-600 font-bold text-lg mb-1">
              Total de clientes
            </span>
            <div className="mt-2 text-2xl font-semibold text-blue-700">
              {loadingSummary
                ? "..."
                : erroSummary
                ? "-"
                : summary?.totalClientes ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gray-600 font-bold text-lg mb-1">
              Ticket médio
            </span>
            <div className="mt-2 text-2xl font-semibold text-blue-700">
              {loadingSummary
                ? "..."
                : erroSummary
                ? "-"
                : formatarMoedaBr(summary?.ticketMedio || 0)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-green-600 font-bold text-lg mb-1">
              Maior volume
            </span>
            <span className="text-gray-700 text-center">
              Cliente com maior volume de vendas
            </span>
            <div className="mt-2 text-2xl font-semibold text-green-700">
              {loadingTop ? (
                "..."
              ) : erroTop ? (
                "-"
              ) : topClients?.maior_volume ? (
                <>
                  {topClients.maior_volume.nome}
                  <div className="text-xs text-gray-500 font-normal">
                    {topClients.maior_volume.email}
                  </div>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-blue-600 font-bold text-lg mb-1">
              Maior média
            </span>
            <span className="text-gray-700 text-center">
              Cliente com maior média por venda
            </span>
            <div className="mt-2 text-2xl font-semibold text-blue-700">
              {loadingTop ? (
                "..."
              ) : erroTop ? (
                "-"
              ) : topClients?.maior_media ? (
                <>
                  {topClients.maior_media.nome}
                  <div className="text-xs text-gray-500 font-normal">
                    {topClients.maior_media.email}
                  </div>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-yellow-600 font-bold text-lg mb-1">
              Maior frequência
            </span>
            <span className="text-gray-700 text-center">
              Cliente com maior frequência de compras
            </span>
            <div className="mt-2 text-2xl font-semibold text-yellow-700">
              {loadingTop ? (
                "..."
              ) : erroTop ? (
                "-"
              ) : topClients?.maior_frequencia ? (
                <>
                  {topClients.maior_frequencia.nome}
                  <div className="text-xs text-gray-500 font-normal">
                    {topClients.maior_frequencia.email}
                  </div>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Gráfico de vendas por dia
          </h3>
          <div className="h-72 flex items-center justify-center text-gray-400">
            {loading ? (
              <span>Carregando gráfico...</span>
            ) : erro ? (
              <span>{erro}</span>
            ) : vendasPorDia.length === 0 ? (
              <span>Nenhum dado de vendas.</span>
            ) : (
              <ChartVendas vendasPorDia={vendasPorDia} />
            )}
          </div>
        </div>
      </section>
    </PrivateRoute>
  );
}

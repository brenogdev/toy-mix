import React from "react";
import { ClienteNormalizado } from "../utils/normalizarClientes";
import { letraFaltante } from "../utils/letraFaltante";
import { formatarDataPtBr } from "@/utils/formatarData";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClienteCardProps {
  cliente: ClienteNormalizado;
  destaqueVolume?: boolean;
  destaqueMedia?: boolean;
  destaqueFrequencia?: boolean;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function ClienteCard({
  cliente,
  destaqueVolume,
  destaqueMedia,
  destaqueFrequencia,
  onEditar,
  onExcluir,
}: ClienteCardProps) {
  const letra = letraFaltante(cliente.nome);
  return (
    <div
      className={`border rounded p-4 mb-4 shadow-sm bg-white relative
      ${destaqueVolume ? "border-green-500 ring-2 ring-green-300" : ""}
      ${destaqueMedia ? "border-blue-500 ring-2 ring-blue-300" : ""}
      ${destaqueFrequencia ? "border-yellow-500 ring-2 ring-yellow-300" : ""}
    `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{cliente.nome}</h2>
          <p className="text-sm text-gray-600">{cliente.email}</p>
          <p className="text-sm text-gray-500">
            Nascimento: {formatarDataPtBr(cliente.nascimento)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Letra faltante</span>
          <span className="text-2xl font-mono bg-gray-100 rounded px-2 py-1 mt-1">
            {letra}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500">
          Vendas: {cliente.vendas.length}
        </span>
      </div>
      {/* Botões de ação no canto inferior direito */}
      <div className="absolute bottom-2 right-2 flex gap-2 z-10">
        <Button
          asChild
          size="icon"
          variant="ghost"
          title="Ver detalhes do cliente"
        >
          <Link href={`/clientes/${cliente.id}`}>
            <Eye className="w-4 h-4 text-gray-700" />
          </Link>
        </Button>
        {onEditar && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onEditar}
            title="Editar cliente"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
        )}
        {onExcluir && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onExcluir}
            title="Excluir cliente"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        )}
      </div>
    </div>
  );
}

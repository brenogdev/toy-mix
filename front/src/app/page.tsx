import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Bem-vindo ao Toy Mix!
      </h2>
      <p className="text-gray-600 text-center max-w-xl mb-6">
        Gerencie clientes, visualize vendas e acompanhe estatísticas da sua loja
        de brinquedos de forma simples e moderna.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/clientes"
          className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition border-t-4 border-blue-400"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Clientes</h3>
          <p className="text-gray-500">
            Cadastre, edite, remova e visualize todos os clientes da loja.
          </p>
        </Link>
        <Link
          href="/stats"
          className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition border-t-4 border-cyan-400"
        >
          <h3 className="text-xl font-semibold text-cyan-700 mb-2">
            Estatísticas
          </h3>
          <p className="text-gray-500">
            Veja gráficos de vendas, rankings de clientes e insights do negócio.
          </p>
        </Link>
      </div>
    </div>
  );
}

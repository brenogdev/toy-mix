"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrivateRoute from "../../../../components/PrivateRoute";
import api from "../../../../services/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { validarDataIso } from "../../../../utils/validarData";

const schema = z.object({
  nome: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  nascimento: z
    .string()
    .refine(
      (val) =>
        validarDataIso(val) &&
        val.slice(0, 4).length === 4 &&
        !isNaN(new Date(val).getTime()) &&
        new Date(val) <= new Date(),
      {
        message:
          "Data de nascimento inválida ou futura (ano deve ter 4 dígitos)",
      }
    ),
});

type FormData = z.infer<typeof schema>;

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", nascimento: "" },
  });

  useEffect(() => {
    async function fetchCliente() {
      setLoading(true);
      setErro("");
      try {
        const res = await api.get(`/clientes`, { params: { id } });
        const cliente = res.data?.data?.clientes?.find(
          (c: any) => Number(c.id) === Number(id)
        );
        if (!cliente) throw new Error("Cliente não encontrado");
        form.setValue("nome", cliente.info?.nomeCompleto || "");
        form.setValue("email", cliente.info?.detalhes?.email || "");
        form.setValue(
          "nascimento",
          cliente.info?.detalhes?.nascimento
            ? cliente.info.detalhes.nascimento.slice(0, 10)
            : ""
        );
      } catch (err) {
        setErro("Erro ao buscar cliente");
      }
      setLoading(false);
    }
    fetchCliente();
  }, [id, form]);

  const onSubmit = async (data: FormData) => {
    setErro("");
    try {
      await api.put(`/clientes/${id}`, data);
      toast.success("Cliente atualizado com sucesso!");
      router.push("/clientes");
    } catch {
      setErro("Erro ao salvar alterações");
      toast.error("Erro ao salvar alterações");
    }
  };

  return (
    <PrivateRoute>
      <section className="max-w-lg mx-auto">
        <Card className="p-8">
          <Form {...form}>
            {loading ? (
              <div className="text-center text-gray-400 py-12">
                Carregando...
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <div className="mb-4">
                  <Link
                    href="/clientes"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ← Voltar para clientes
                  </Link>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Editar Cliente
                </h2>
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o e-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {erro && (
                  <div className="text-red-600 text-sm text-center">{erro}</div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                  <Link
                    href="/clientes"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold transition"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            )}
          </Form>
        </Card>
      </section>
    </PrivateRoute>
  );
}

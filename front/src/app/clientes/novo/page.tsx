"use client";
import Link from "next/link";
import PrivateRoute from "../../../components/PrivateRoute";
import { useState } from "react";
import api from "../../../services/api";
import { useRouter } from "next/navigation";
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
import { validarDataIso } from "@/utils/validarData";

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

export default function NovoClientePage() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", nascimento: "" },
  });
  const [erro, setErro] = useState("");

  const onSubmit = async (data: FormData) => {
    setErro("");
    try {
      await api.post("/clientes", data);
      toast.success("Cliente cadastrado com sucesso!");
      form.reset();
      router.push("/clientes");
    } catch {
      setErro("Erro ao cadastrar cliente");
      toast.error("Erro ao cadastrar cliente");
    }
  };

  return (
    <PrivateRoute>
      <section className="max-w-lg mx-auto">
        <Card className="p-8">
          <Form {...form}>
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
                Novo Cliente
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
          </Form>
        </Card>
      </section>
    </PrivateRoute>
  );
}

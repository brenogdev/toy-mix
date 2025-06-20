"use client";
import { useParams, useRouter } from "next/navigation";
import PrivateRoute from "../../../../components/PrivateRoute";
import api from "../../../../services/api";
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
import Link from "next/link";

const schema = z.object({
  data: z.string().min(1, "Data obrigatória"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
});

type FormData = z.infer<typeof schema>;

export default function NovaVendaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { data: "", valor: 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/sales", {
        cliente_id: id,
        data: data.data,
        valor: data.valor,
      });
      toast.success("Venda cadastrada com sucesso!");
      router.push(`/clientes/${id}`);
    } catch {
      toast.error("Erro ao cadastrar venda");
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
                  href={`/clientes/${id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ← Voltar para cliente
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Nova Venda
              </h2>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da venda</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                <Link
                  href={`/clientes/${id}`}
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

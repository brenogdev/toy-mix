"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
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

const schema = z.object({
  username: z.string().min(3, "Usuário obrigatório"),
  password: z.string().min(3, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const ok = await login(data.username, data.password);
    if (ok) {
      toast.success("Login realizado com sucesso!");
      router.push("/clientes");
    } else {
      setError("Usuário ou senha inválidos");
      toast.error("Usuário ou senha inválidos");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm p-8 flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="mb-2">
              <Link href="/" className="text-blue-600 hover:underline text-sm">
                ← Voltar para início
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Entrar
            </h2>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </Card>
    </section>
  );
}

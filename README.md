# Toy Mix - Gerenciador de Clientes e Vendas

Este monorepo contém uma aplicação fullstack para gerenciar clientes e vendas de uma loja de brinquedos, com autenticação, estatísticas, exportação de dados e interface moderna.

---

## Stacks Utilizadas e Justificativas

### Backend

- **Node.js + Express:** Permite criar APIs REST de forma rápida, flexível e com grande ecossistema. Ideal para prototipação e produção.
- **Knex.js:** Query builder que facilita a escrita de queries SQL portáveis, além de gerenciar migrations e seeds.
- **PostgreSQL (ou SQLite):** Banco relacional robusto, seguro e amplamente utilizado. Suporte a constraints, joins e operações avançadas.
- **JWT:** Autenticação stateless, segura e fácil de integrar com frontends modernos.
- **Jest:** Framework de testes popular, rápido e com ótima integração ao ecossistema Node.
- **Docker:** Facilita o setup do banco e garante ambiente padronizado para todos os desenvolvedores.

### Frontend

- **Next.js + React:** Permite SSR, rotas dinâmicas, ótima performance e experiência de desenvolvimento moderna.
- **TypeScript:** Tipagem estática, maior segurança e produtividade.
- **shadcn/ui:** Biblioteca de componentes UI moderna, acessível e fácil de customizar.
- **react-hook-form + zod:** Validação robusta, reatividade e integração perfeita com formulários.
- **chart.js:** Gráficos interativos e responsivos para dashboards.
- **xlsx, file-saver:** Exportação de dados para Excel de forma simples e eficiente.
- **jsPDF, jspdf-autotable:** Geração de PDFs diretamente no navegador, sem necessidade de backend.
- **react-hot-toast:** Feedbacks visuais rápidos e modernos.

### Por que essas escolhas?

- **Produtividade:** Permitem entregar rapidamente uma solução robusta e escalável.
- **Comunidade:** Todas as stacks possuem ampla documentação e suporte.
- **Facilidade de manutenção:** Código limpo, modular e fácil de evoluir.
- **Experiência do usuário:** UI moderna, responsiva e com feedbacks claros.

---

## Exemplos de Uso da Aplicação

### 1. Cadastro e Login

- Acesse a tela de login em `/login`.
- Caso não tenha usuário, registre-se em `/auth/register` (backend) ou peça para o admin criar.
- Após login, o token é salvo automaticamente e usado em todas as requisições.

### 2. Cadastro de Cliente

- Clique em “+ Adicionar Cliente” na tela de clientes.
- Preencha nome, e-mail e data de nascimento.
- O cliente aparecerá na listagem, com opções de editar e excluir.

### 3. Cadastro de Venda

- Clique no ícone de olho para ver detalhes de um cliente.
- Clique em “+ Nova venda”, preencha data e valor, e salve.
- As vendas aparecem listadas, com scroll infinito e totalizador.

### 4. Edição e Exclusão

- Use os ícones de lápis (editar) e lixeira (excluir) ao lado de clientes e vendas.
- Confirme a ação quando solicitado.

### 5. Dashboard e Estatísticas

- Acesse “Estatísticas” no menu ou `/stats`.
- Veja totais gerais, ranking dos melhores clientes e gráfico de vendas por dia.
- Os destaques visuais mostram os clientes top em volume, média e frequência.

### 6. Exportação de Dados

- No dashboard, clique em “Exportar para Excel” ou “Exportar para PDF”.
- O arquivo gerado inclui totais, ranking e dados do gráfico.

### 7. Normalização de Dados

- O frontend trata e normaliza os dados vindos da API, mesmo que estejam aninhados ou com campos redundantes, garantindo exibição correta e consistente.

### 8. Testes Automatizados

- No backend, rode `npm test` para garantir a qualidade e cobertura dos endpoints principais.

---

## Dúvidas?

Abra uma issue ou entre em contato!

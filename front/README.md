# Front-end Toy Mix

Este projeto é o front-end moderno para a API de loja de brinquedos, desenvolvido em Next.js + TypeScript + TailwindCSS.

## Objetivo

- Cadastrar, listar, editar e deletar clientes
- Autenticação JWT
- Visualizar estatísticas de vendas
- Gráfico de vendas por dia
- Destaques visuais para clientes especiais
- Campo visual de letra faltante no nome do cliente
- Normalização de dados vindos da API (mesmo se desorganizados)

## Como rodar localmente

```bash
cd front
npm install
npm run dev
```

## Configuração

Crie um arquivo `.env.local` na pasta `front` com:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Consumo da API

- A aplicação consome a API real (ou pode ser adaptada para mock).
- O login retorna um token JWT, que é usado nas demais requisições.
- A listagem de clientes trata e normaliza o JSON conforme exemplo do backend.

## Normalização dos dados

A função utilitária `normalizarClientes` extrai apenas os campos relevantes do JSON, ignorando duplicações e propriedades desnecessárias.

## Scripts

- `npm run dev`: roda o projeto em modo desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: checagem de boas práticas

## Estrutura sugerida

- `src/app/`: páginas
- `src/components/`: componentes reutilizáveis
- `src/services/`: consumo da API
- `src/utils/`: funções utilitárias (ex: normalização)

## Prints e exemplos

(Adicione prints das telas após implementar)

---

> Desenvolvido para avaliação técnica. Para dúvidas, consulte o código ou abra uma issue.

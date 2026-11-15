# logitrack-api
API RESTful para gerenciamento de motoristas, veículos e entregas

## Tecnologias utilizadas

- Node.js — Ambiente de execução JavaScript
- TypeScript — Linguagem utilizada no backend
- Fastify — Framework para desenvolvimento da API REST
- PostgreSQL — Banco de dados (integração prevista para E2)
- Git e GitHub — Versionamento e colaboração

## Estrutura do projeto

- `src/config` — Configurações
- `src/controllers` — Controle das requisições HTTP
- `src/services` — Regras de negócio
- `src/repositories` — Acesso ao banco de dados
- `src/routes` — Definição dos endpoints
- `src/dtos` — Objetos de entrada e saída

## Como executar

### Instalar dependências
npm install

### Iniciar servidor
npm run dev

### Compilar projeto
npm run build

## Endpoint inicial

GET http://localhost:3333/

Resposta:
{
  "status": "ok",
  "message": "LogiTrack API funcionando!"
}

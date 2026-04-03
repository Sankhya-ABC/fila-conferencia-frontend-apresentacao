# Fila de Conferência — Frontend

Interface web desenvolvida com **Angular 17** para gestão da fila de conferência de notas fiscais integrada ao ERP Sankhya. Permite visualizar, filtrar e processar itens da fila, além de realizar a separação de pedidos com geração de etiquetas.

---

## 🛠️ Tecnologias

- **Angular 17**
- **Angular Material 17** (componentes de UI)
- **TypeScript 5.2**
- **Axios** (chamadas HTTP)
- **RxJS 7**

---

## 📋 Pré-requisitos

- Node.js 20+
- Angular CLI 17+

```bash
npm install -g @angular/cli@17
```

---

## ⚙️ Configuração

Edite o arquivo de ambiente conforme o contexto de execução:

**`src/environments/environment.development.ts`** (desenvolvimento):
```ts
export const environment = {
  API_GATEWAY: 'http://localhost:3000',
};
```

**`src/environments/environment.ts`** (produção): atualize com a URL da API em produção.

---

## 🚀 Instalação e execução

```bash
npm install

# Desenvolvimento
npm start
# Acesse: http://localhost:4200

# Build de produção
npm run build
```

---

## 📄 Páginas

| Rota | Página | Descrição |
|---|---|---|
| `/login` | Login | Autenticação via Sankhya |
| `/fila-conferencia` | Fila de Conferência | Listagem e filtros da fila |
| `/separacao/:numeroUnico` | Separação | Detalhe e processamento de uma nota |

Rotas protegidas por `authGuard`. A rota `/login` redireciona para a fila caso o usuário já esteja autenticado (`loginGuard`).

---

## 🧩 Serviços principais

| Serviço | Responsabilidade |
|---|---|
| `AuthService` | Login, logout e sessão do usuário |
| `ConferenciaService` | Listagem da fila com filtros |
| `SeparacaoService` | Dados de separação por NUNOTA |
| `ParceiroService` | Busca de parceiros |
| `EmpresaService` | Listagem de empresas |
| `DominioService` | Opções de campos dinâmicos |

---

## 🧱 Componentes compartilhados

- **Header** — barra de navegação com avatar e logout
- **Loading Overlay** — indicador de carregamento global
- **Toast** — notificações de feedback
- **Modal** — diálogo reutilizável

# Caseirinhos da Vovó — Documentação do Projeto

> **Status:** documento inicial (v0.1 — 23/11/2025). Tudo que estiver marcado como **[A decidir]** é uma decisão em aberto que o grupo precisa fechar antes (ou durante) a implementação do módulo correspondente.

---

## 1. Visão geral

Aplicação WEB de caráter extensionista (disciplina de Programação WEB) para auxiliar a MEI dona da confeitaria **Caseirinhos da Vovó** na gestão do negócio.

A aplicação tem **dois lados**:

| Lado | Quem usa | O que faz |
|---|---|---|
| **Loja** (vitrine) | Clientes da confeitaria | Ver o catálogo, montar um pedido e enviá-lo via WhatsApp |
| **Painel** (gestão) | A dona do negócio (e o grupo, para testes) | CRUD de pedidos, fluxo de caixa, controle de produção (Kanban), calendário de entregas |

### 1.1 Requisitos funcionais e prioridades

| Prioridade | Módulo | Descrição resumida |
|---|---|---|
| **Alta** | Pedidos (CRUD) | Registrar, listar, editar e cancelar pedidos no painel; cliente monta pedido na loja |
| **Alta** | Financeiro (CRUD) | Lançamentos de entrada/saída (fluxo de caixa), com categorias e resumos |
| **Alta** | Controle de produção | Kanban com as etapas de produção de cada pedido + painel de visão geral |
| **Média** | Calendário | Visualização dos pedidos por data de entrega |
| **Baixa** | Login | Autenticação para proteger o painel |
| **Baixa** | Integração WhatsApp | Envio do pedido montado pelo cliente via link `wa.me` |

> **[A decidir]** O requisito de **controle de estoque** foi citado na concepção do projeto, mas não aparece na lista de prioridades nem no esqueleto do backend. O grupo precisa decidir se ele: (a) sai do escopo, (b) vira um módulo próprio (`estoque`), ou (c) vira apenas um campo simples no produto (ex.: `disponivel: true/false`).

---

## 2. Tecnologias

Somente tecnologias vistas em sala, com possíveis extensões pontuais:

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | HTML, CSS e JS **puros** | Sem framework. Componentes/partials carregados via JS (`assets/js/core/partials.js`) |
| Frontend (estilo) | CSS próprio com tokens | Bootstrap é permitido, mas o projeto hoje usa CSS próprio (`assets/css/base/tokens.css`). **[A decidir]** adotar Bootstrap em telas novas ou manter 100% CSS próprio |
| Backend | Node.js (>= 18) + Express 4 | ES Modules (`"type": "module"`) |
| Upload | Multer / express-form-data | Já estão nas dependências |
| Banco | MongoDB (driver nativo `mongodb`) | Cluster no **MongoDB Atlas**. Sem Mongoose — acesso direto às collections |
| Deploy | Vercel (frontend e backend separados) | Cada pasta tem seu `vercel.json` |

---

## 3. Arquitetura geral

```
[ Navegador ]
     │  fetch() JSON
     ▼
[ frontend/ ]  HTML + CSS + JS puro (site estático na Vercel)
     │  HTTP (REST, JSON)
     ▼
[ backend/ ]   API Express (função serverless na Vercel)
     │  driver mongodb
     ▼
[ MongoDB Atlas ]
```

Pontos importantes:

- Frontend e backend são **projetos separados** (duas pastas, dois deploys). O frontend fala com o backend **somente via API REST/JSON** usando `fetch`.
- A URL base da API fica centralizada no frontend em `assets/js/core/config.js` — nunca escrever URL da API "solta" nas páginas.
- Na Vercel, o backend roda como **função serverless**: quem é exportado é o `src/app.js`; o `src/server.js` (`app.listen`) só é usado localmente.

### 3.1 Camadas do backend

O esqueleto do backend já define uma arquitetura em camadas. **Toda feature nova deve seguir esse fluxo**, criando um arquivo em cada camada:

```
routes → controllers → services → repositories → MongoDB
            │              │
       validators      constants
       middlewares
```

| Camada | Pasta | Responsabilidade | O que NÃO fazer aqui |
|---|---|---|---|
| **Routes** | `src/routes/` | Declarar as URLs e métodos HTTP, ligar aos controllers e middlewares | Lógica de negócio |
| **Controllers** | `src/controllers/` | Ler `req` (params, body, query), chamar o service, montar a resposta (`res.status().json()`) | Acessar o banco diretamente |
| **Services** | `src/services/` | Regras de negócio (ex.: "pedido cancelado não pode mudar de etapa") | Mexer em `req`/`res` |
| **Repositories** | `src/repositories/` | Único lugar que fala com o MongoDB (find, insert, update, delete) | Regras de negócio |
| **Validators** | `src/validators/` | Validar o body/params antes do controller (campos obrigatórios, tipos) | — |
| **Middlewares** | `src/middlewares/` | Autenticação, autorização, tratamento de erros, 404, upload | — |
| **Constants** | `src/constants/` | Valores fixos compartilhados (status de pedido, etapas, perfis…) | — |
| **Utils** | `src/utils/` | Helpers genéricos (datas, moeda, asyncHandler, ErroHttp) | — |

### 3.2 Estrutura de pastas (estado atual)

```
backend/
├── database/
│   ├── migrations/        # (vazio) scripts de criação de índices [A decidir se será usado]
│   └── seeds/             # (vazio) scripts para popular dados de teste
├── src/
│   ├── app.js             # ✅ cria o app Express, middlewares globais, registra rotas
│   ├── server.js          # ✅ app.listen — só para rodar local
│   ├── config/            # ✅ database.js (conexão Atlas com cache) | env, cors, upload (vazios)
│   ├── constants/         # (vazios) status-pedido, etapas-producao, categorias-fluxo-caixa, perfis, tipos-pedido
│   ├── controllers/       # (vazios) auth, usuario, produto, categoria, pedido, producao, fluxo-caixa, upload
│   ├── middlewares/       # (vazios) autenticacao, autorizacao, erros, nao-encontrado, upload, validacao
│   ├── models/            # ✅ catalogoModels.js (teste de conexão) — [A decidir] manter pasta ou migrar tudo p/ repositories
│   ├── repositories/      # (vazios) categoria, fluxo-caixa, pedido, producao, produto, usuario
│   ├── routes/            # ✅ catalogoRoutes.js (rotas /teste) | demais vazios, index.js vazio
│   ├── services/          # (vazios)
│   ├── utils/             # (vazios) async-handler, datas, erro-http, moeda
│   └── validators/        # (vazios)
└── uploads/               # destino do multer em dev (ver seção 8)

frontend/
├── index.html             # home / vitrine
├── pages/
│   ├── auth/              # login.html, cadastro.html ✅
│   ├── loja/              # encomenda.html, pedido-enviado.html
│   └── painel/            # pedidos.html, fluxo-caixa.html, controle-producao.html, calendario.html
├── partials/              # headers, footers, menus reutilizados (injetados via JS)
├── assets/
│   ├── css/               # base/ (tokens, reset…), components/, pages/
│   └── js/
│       ├── core/          # config.js (URL da API), dom.js, eventos.js, partials.js
│       ├── components/    # JS de componentes (carrossel, card-produto…)
│       ├── pages/         # 1 arquivo JS por página
│       ├── services/      # funções que chamam a API (fetch) — ex.: produto-service.js
│       └── utils/         # formatadores, máscaras, validadores
└── data/mocks/            # dados falsos usados enquanto a API não existe
```

> Convenção de nomes do backend: arquivos em **kebab-case** com sufixo da camada: `pedido.controller.js`, `pedido.service.js`, `pedido.repository.js`, `pedido.routes.js`, `pedido.validator.js`. Os arquivos `catalogo*` (sem sufixo) foram o teste inicial — **[A decidir]** removê-los quando as rotas reais existirem.

---

## 4. Banco de dados (MongoDB)

- Conexão via `src/config/database.js` (já implementado, com cache de conexão para a Vercel).
- Banco definido na string de conexão ou em `DB_NAME` (ver seção 10).
- Sem Mongoose: os repositories usam o driver nativo (`db.collection('pedidos').find(...)`).

### 4.1 Collections propostas

| Collection | Conteúdo | Módulo |
|---|---|---|
| `usuarios` | Contas de acesso ao painel (e clientes, se houver cadastro) | Login |
| `categorias` | Categorias de produto (bolos, cucas, doces…) | Catálogo |
| `produtos` | Itens do catálogo da loja | Catálogo |
| `pedidos` | Pedidos com itens, cliente, entrega, status e etapa de produção | Pedidos / Produção / Calendário |
| `lancamentos` | Entradas e saídas do fluxo de caixa | Financeiro |

> **[A decidir]** Se a produção (Kanban) será um campo dentro de `pedidos` (proposta abaixo — mais simples) ou uma collection separada `producao`. A proposta deste documento é **campo dentro do pedido**, já que cada card do Kanban é um pedido.

### 4.2 Esquema dos documentos (proposta)

Como MongoDB não impõe esquema, **este documento é o contrato**: todos devem gravar os campos com estes nomes/tipos. Valores monetários: **[A decidir]** gravar em centavos (inteiro, recomendado — evita erro de ponto flutuante) ou em reais (decimal). Datas: sempre `Date` do Mongo (ISO), nunca string `dd/mm`.

```js
// usuarios
{
  _id: ObjectId,
  nome: "Maria da Silva",
  email: "maria@email.com",        // único (criar índice)
  senhaHash: "...",                 // NUNCA a senha pura — ver seção 7
  perfil: "admin" | "cliente",      // valores em constants/perfis.js
  telefone: "(45) 99999-9999",      // opcional
  criadoEm: Date
}

// categorias
{ _id: ObjectId, nome: "Cucas", slug: "cucas", ordem: 1, ativa: true }

// produtos
{
  _id: ObjectId,
  nome: "Cuca de goiabada",
  descricao: "...",
  preco: 2500,                      // centavos (ver [A decidir] acima)
  categoriaId: ObjectId,            // ref. a categorias
  imagemUrl: "/uploads/cuca.jpg",   // ver seção 8
  disponivel: true,
  criadoEm: Date
}

// pedidos
{
  _id: ObjectId,
  codigo: "PED-0042",               // código curto p/ a cliente citar no WhatsApp
  cliente: {                        // embutido — cliente pode não ter cadastro
    nome: "João",
    telefone: "(45) 98888-8888"
  },
  itens: [
    { produtoId: ObjectId, nome: "Cuca de goiabada", precoUnitario: 2500, quantidade: 2 }
    // nome/preço copiados no momento do pedido (se o produto mudar depois, o pedido não muda)
  ],
  total: 5000,
  observacoes: "Sem cobertura",
  tipo: "entrega" | "retirada",     // constants/tipos-pedido.js
  dataEntrega: Date,                // usada pelo calendário
  endereco: { ... },                // só se tipo === "entrega" — [A decidir] campos
  status: "recebido",               // ver 4.3
  etapaProducao: "fila",            // ver 4.3 (coluna do Kanban)
  origem: "loja" | "painel",        // veio do site ou foi digitado pela dona
  criadoEm: Date,
  atualizadoEm: Date
}

// lancamentos (fluxo de caixa)
{
  _id: ObjectId,
  tipo: "entrada" | "saida",
  valor: 5000,                      // sempre positivo; o tipo diz o sinal
  categoria: "venda",               // constants/categorias-fluxo-caixa.js
  descricao: "Pedido PED-0042",
  pedidoId: ObjectId | null,        // preenchido quando o lançamento vem de um pedido
  data: Date,
  criadoEm: Date
}
```

### 4.3 Constantes de domínio (preencher em `src/constants/`)

Propostas iniciais — **[A decidir]** os valores finais **com a cliente** (ela conhece o processo de produção real):

```js
// status-pedido.js — ciclo de vida do pedido (visão do negócio)
export const STATUS_PEDIDO = ["recebido", "confirmado", "em_producao", "pronto", "entregue", "cancelado"];

// etapas-producao.js — colunas do Kanban (visão da cozinha)
export const ETAPAS_PRODUCAO = ["fila", "preparo", "assando", "finalizacao", "pronto"];

// categorias-fluxo-caixa.js
export const CATEGORIAS_FLUXO_CAIXA = {
  entrada: ["venda", "outros"],
  saida: ["ingredientes", "embalagens", "transporte", "equipamentos", "outros"]
};

// perfis.js
export const PERFIS = ["admin", "cliente"];

// tipos-pedido.js
export const TIPOS_PEDIDO = ["entrega", "retirada"];
```

> **[A decidir]** Se `status` e `etapaProducao` serão campos separados (proposta acima) ou um campo só. Separados é mais flexível (ex.: pedido "confirmado" ainda nem entrou na fila do Kanban), mas exige manter os dois coerentes no service.

---

## 5. API REST — contrato

### 5.1 Convenções gerais

- Prefixo: **todas** as rotas de negócio sob `/api` (ex.: `GET /api/pedidos`). Registrar tudo no `src/routes/index.js` e ele no `app.js`.
- JSON em tudo (`Content-Type: application/json`), exceto upload (multipart).
- Nomes de recurso no **plural, em português, kebab-case**: `/api/pedidos`, `/api/fluxo-caixa`.
- Códigos HTTP: `200` OK, `201` criado, `204` deletado sem corpo, `400` dados inválidos, `401` não autenticado, `403` sem permissão, `404` não encontrado, `500` erro interno.
- **Formato de erro padronizado** (produzido pelo `erros.middleware.js` + classe `ErroHttp` de `utils/erro-http.js`):

```json
{ "erro": { "mensagem": "Pedido não encontrado", "codigo": 404 } }
```

- Formato de lista **[A decidir]**: array puro (`[...]`) ou envelope com paginação (`{ "dados": [...], "total": 42 }`). Para o tamanho deste projeto, array puro + filtros por query string deve bastar.

### 5.2 Endpoints por módulo

#### Pedidos — prioridade ALTA (`pedido.routes.js`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/pedidos` | Lista pedidos. Filtros via query: `?status=`, `?dataInicio=&dataFim=` (calendário usa isso) |
| `GET` | `/api/pedidos/:id` | Detalhe de um pedido |
| `POST` | `/api/pedidos` | Cria pedido (usado pela loja **e** pelo painel) |
| `PUT` | `/api/pedidos/:id` | Edita dados do pedido |
| `PATCH` | `/api/pedidos/:id/status` | Muda só o status (body: `{ "status": "confirmado" }`) |
| `PATCH` | `/api/pedidos/:id/etapa` | Move o card no Kanban (body: `{ "etapa": "preparo" }`) |
| `DELETE` | `/api/pedidos/:id` | **[A decidir]** apagar de verdade ou apenas `status: "cancelado"` (recomendado: cancelar, para não perder histórico do financeiro) |

#### Financeiro — prioridade ALTA (`fluxo-caixa.routes.js`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/fluxo-caixa` | Lista lançamentos. Filtros: `?tipo=`, `?dataInicio=&dataFim=`, `?categoria=` |
| `GET` | `/api/fluxo-caixa/resumo` | Totais do período: entradas, saídas, saldo (para os cards do painel) |
| `POST` | `/api/fluxo-caixa` | Cria lançamento manual |
| `PUT` | `/api/fluxo-caixa/:id` | Edita lançamento |
| `DELETE` | `/api/fluxo-caixa/:id` | Remove lançamento |

> **[A decidir]** Lançamento automático: quando um pedido vira `entregue` (ou `pronto`?), o service de pedidos cria uma `entrada` no fluxo de caixa com `pedidoId` preenchido? Recomendado, mas precisa definir o gatilho e o que acontece se o pedido for cancelado depois.

#### Produção / Kanban — prioridade ALTA (`producao.routes.js`)

Se a produção ficar dentro do pedido (proposta da seção 4.1), este módulo quase não precisa de rotas próprias:

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/producao/kanban` | Pedidos ativos agrupados por etapa: `{ "fila": [...], "preparo": [...] }` |
| `GET` | `/api/producao/painel` | Números da visão geral (qtd. por etapa, entregas do dia…) — **[A decidir]** o que exatamente o painel mostra |

(A movimentação de cards usa `PATCH /api/pedidos/:id/etapa`.)

#### Catálogo — produtos e categorias (suporte à loja)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Lista produtos (`?categoria=slug`, `?disponivel=true`) — usado pela vitrine |
| `GET` | `/api/produtos/:id` | Detalhe |
| `POST` | `/api/produtos` | Cria produto (painel) |
| `PUT` | `/api/produtos/:id` | Edita |
| `DELETE` | `/api/produtos/:id` | Remove (ou `disponivel: false`) |
| `GET` | `/api/categorias` | Lista categorias |
| `POST/PUT/DELETE` | `/api/categorias...` | CRUD de categorias (painel) |

#### Autenticação — prioridade BAIXA (`auth.routes.js`, `usuario.routes.js`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/cadastro` | Cria usuário (tela `cadastro.html`) |
| `POST` | `/api/auth/login` | Valida credenciais e devolve token/sessão (ver seção 7) |
| `GET` | `/api/usuarios/eu` | Dados do usuário logado |

#### Upload — (`upload.routes.js`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/uploads` | Recebe imagem (multipart via multer), devolve `{ "url": "..." }` para salvar no produto |

### 5.3 Exemplo de fluxo completo (criar pedido pela loja)

```
1. Cliente monta o pedido em pages/loja/encomenda.html
2. JS da página chama pedidoService.criar(dados)   → POST /api/pedidos
3. validacao.middleware + pedido.validator conferem o body (400 se inválido)
4. pedido.controller → pedido.service:
     - calcula total no SERVIDOR (nunca confiar no total vindo do front)
     - gera codigo "PED-00xx", status "recebido", etapa "fila"
5. pedido.repository insere na collection pedidos
6. Resposta 201 com o pedido criado
7. Front redireciona p/ pedido-enviado.html e monta o link do WhatsApp (seção 9)
```

---

## 6. Frontend — integração com a API

- **Toda chamada à API** fica em `assets/js/services/` (um arquivo por recurso: `pedido-service.js`, `produto-service.js`, `fluxo-caixa-service.js`…). As páginas (`assets/js/pages/`) chamam os services, nunca `fetch` direto.
- A URL base vem de `assets/js/core/config.js` (trocar entre `http://localhost:3000` e a URL da Vercel num lugar só).
- Enquanto a API de um módulo não existe, usar `data/mocks/` (como já é feito em `mocks/home.js`) — e **remover o mock** quando o endpoint real ficar pronto.
- Padrão sugerido de service:

```js
// assets/js/services/pedido-service.js
import { API_URL } from "../core/config.js";

export async function criarPedido(dados) {
  const resposta = await fetch(`${API_URL}/api/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error((await resposta.json()).erro.mensagem);
  return resposta.json();
}
```

- Kanban (controle-producao.html): **[A decidir]** drag-and-drop nativo (API HTML5 `draggable`) ou botões "mover para →" (bem mais simples e funciona no celular — recomendado para a 1ª versão).
- Calendário (calendario.html): **[A decidir]** montar a grade do mês com JS puro (tabela 7 colunas) ou usar uma lib (ex.: FullCalendar — fugiria um pouco das tecnologias de aula). Recomendado: grade própria em JS puro consumindo `GET /api/pedidos?dataInicio=&dataFim=`.

---

## 7. Autenticação e segurança (prioridade baixa, mas ler antes de fazer)

Decisões em aberto — escolher quando o módulo for implementado:

- **[A decidir] Mecanismo de sessão:** JWT no `localStorage` (mais comum em aula, simples com API separada) vs. cookie de sessão. Com front e back em domínios diferentes na Vercel, **JWT tende a ser mais simples**.
- **[A decidir] Biblioteca de hash de senha:** `bcryptjs` (JS puro, instala fácil no Windows) é a extensão recomendada. **Nunca** salvar senha em texto puro.
- **Proteção de rotas:** `autenticacao.middleware.js` (está logado?) + `autorizacao.middleware.js` (é admin?). Regra geral:
  - Loja: `GET /api/produtos`, `GET /api/categorias`, `POST /api/pedidos` → **públicas**
  - Painel: todo o resto → **protegidas** (quando o login existir; até lá, deixar aberto e avisar na apresentação)
- **CORS:** hoje `origin: '*'` em `app.js`. Antes da entrega, restringir à URL do frontend na Vercel (**[A decidir]** manter aberto durante o desenvolvimento).
- Validar **sempre no backend** (validators), mesmo que o front já valide — o front é só conveniência.

---

## 8. Upload de imagens — ⚠️ atenção à Vercel

O multer salvando em `backend/uploads/` **funciona apenas localmente**. Na Vercel o sistema de arquivos da função é temporário: arquivos enviados **somem** a cada deploy/execução.

**[A decidir]** — opções, da mais simples à mais robusta:

1. **Imagens no repositório do frontend** (`frontend/assets/images/produtos/`, como já é feito hoje) e o campo `imagemUrl` do produto guarda esse caminho. Sem upload em produção — a dona manda a foto pro grupo e alguém commita. *Mais simples, recomendado para a disciplina.*
2. **Vercel Blob** ou **Cloudinary** (plano gratuito) — upload de verdade em produção, mas é uma extensão fora do conteúdo de aula.
3. Guardar a imagem **no MongoDB** (base64/GridFS) — não recomendado (documentos grandes, lento).

O módulo `upload.*` do backend só precisa existir de fato se a opção 2 for escolhida.

---

## 9. Integração com WhatsApp (prioridade baixa)

**Não** usar a API oficial do WhatsApp Business (paga/burocrática). A integração é um **link `wa.me` montado no frontend**:

```js
const texto = encodeURIComponent(
  `Olá! Gostaria de fazer um pedido (${pedido.codigo}):\n` +
  pedido.itens.map(i => `• ${i.quantidade}x ${i.nome}`).join("\n") +
  `\nTotal: R$ ${formatarMoeda(pedido.total)}\nEntrega: ${dataFormatada}`
);
window.open(`https://wa.me/55XXXXXXXXXXX?text=${texto}`);
```

Fluxo: o pedido é **salvo primeiro na API** (`POST /api/pedidos`) e **depois** o cliente é levado ao WhatsApp com a mensagem pronta. Assim o painel registra o pedido mesmo que o cliente não envie a mensagem.

> **[A decidir]** Número da confeitaria: guardar no `config.js` do frontend.

---

## 10. Variáveis de ambiente

Backend — arquivo `backend/.env` (NÃO commitar; já deve estar no `.gitignore`). Na Vercel, cadastrar em *Settings → Environment Variables*.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `STRING_CONEXAO` | ✅ | String do MongoDB Atlas (`mongodb+srv://...`) |
| `DB_NAME` | opcional | Nome do banco, se não estiver na string de conexão |
| `PORT` | opcional | Porta local (padrão 3000) |
| `SEGREDO_JWT` | futura | Quando o login for implementado |

Exemplo de `.env`:

```
STRING_CONEXAO=mongodb+srv://usuario:senha@cluster.mongodb.net/caseirinhos
PORT=3000
```

---

## 11. Como rodar localmente

```bash
# Backend
cd backend
npm install
# criar o arquivo .env (seção 10)
npm run dev          # sobe em http://localhost:3000
# testes rápidos: GET http://localhost:3000/teste  e  /teste-banco

# Frontend
# é estático: abrir frontend/index.html com a extensão Live Server do VS Code
# (abrir o arquivo direto no navegador quebra os fetch de partials por CORS de file://)
```

---

## 12. Ordem de desenvolvimento sugerida (backend)

Cada passo entrega algo testável (usar Postman/Insomnia/extensão REST Client antes de ligar o front):

1. **Base comum** — `utils/erro-http.js`, `utils/async-handler.js`, `middlewares/erros.middleware.js`, `middlewares/nao-encontrado.middleware.js`, `routes/index.js` com prefixo `/api`, e preencher `src/constants/`. *(Desbloqueia todo o resto.)*
2. **Catálogo** — CRUD de `categorias` e `produtos` + ligar a vitrine (substitui os mocks da home). É o CRUD mais simples, bom para aprender o fluxo das camadas.
3. **Pedidos** — CRUD completo + criação pela loja (encomenda.html).
4. **Produção** — `PATCH /etapa`, `GET /kanban` + tela controle-producao.html.
5. **Financeiro** — CRUD de lançamentos + resumo + tela fluxo-caixa.html (+ decisão do lançamento automático).
6. **Calendário** — só consome `GET /api/pedidos?dataInicio=&dataFim=` (pouco backend novo).
7. **Login** — auth + middlewares + proteger rotas do painel.
8. **WhatsApp** — link `wa.me` no fluxo da loja.

Divisão: os módulos 3, 4 e 5 podem andar em paralelo depois do passo 1, pois cada um tem sua própria fatia de camadas (routes/controller/service/repository/validator).

---

## 13. Resumo das decisões em aberto ([A decidir])

| # | Decisão | Opções | Seção |
|---|---|---|---|
| 1 | Escopo do estoque | fora do escopo / módulo próprio / campo `disponivel` | 1.1 |
| 2 | Bootstrap nas telas novas | adotar / manter CSS próprio | 2 |
| 3 | Produção: embutida no pedido ou collection própria | recomendação: embutida | 4.1 |
| 4 | Valores monetários | centavos (int, recomendado) / reais (decimal) | 4.2 |
| 5 | Valores finais de status/etapas/categorias | validar com a cliente | 4.3 |
| 6 | `status` e `etapaProducao` separados ou campo único | recomendação: separados | 4.3 |
| 7 | Formato de listas da API | array puro (recomendado) / envelope paginado | 5.1 |
| 8 | DELETE de pedido | apagar / cancelar (recomendado) | 5.2 |
| 9 | Lançamento automático no caixa ao entregar pedido | sim (definir gatilho) / não | 5.2 |
| 10 | Kanban: drag-and-drop ou botões | recomendação: botões na v1 | 6 |
| 11 | Calendário: JS puro ou lib | recomendação: JS puro | 6 |
| 12 | Sessão: JWT ou cookie | recomendação: JWT | 7 |
| 13 | Hash de senha | recomendação: bcryptjs | 7 |
| 14 | CORS restrito em produção | sim, antes da entrega | 7 |
| 15 | Imagens em produção | repo (recomendado) / Vercel Blob / Cloudinary | 8 |
| 16 | Pasta `models/` e arquivos `catalogo*` | migrar p/ repositories e remover | 3.2 |
| 17 | Uso de `database/migrations` e `seeds` | seeds de teste são úteis; migrations talvez não | 3.2 |

---

*Documento vivo: atualizar este arquivo sempre que uma decisão for fechada (trocar o **[A decidir]** pela decisão tomada e a data).*

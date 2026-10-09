# AGENTS.md — Monetis Web (Angular)

Frontend do Monetis, plataforma de finanças pessoais. Consome a API .NET do repositório irmão `../monetis`. É um projeto de estudos: ao propor ou realizar qualquer alteração, explique em 1–2 frases o porquê da decisão.

Fontes de verdade neste repo:

- Contrato da API: `API-backend.md` na raiz (DTOs TypeScript de todos os endpoints, validações e erros).
- Skills Angular: `.skills/angular-developer` e `.skills/angular-new-app`, registradas no `opencode.json`. Use-as ao criar código Angular.
- Design: `DESIGN.md` na raiz (filosofia, tabela componente → tokens, exemplos certo/errado). Os **valores** dos tokens vivem só em `src/styles.scss`; em conflito entre os dois, vale o `styles.scss` e o `DESIGN.md` deve ser corrigido. Leia o `DESIGN.md` antes de criar ou alterar qualquer tela.

## 1. Comandos

- `ng serve` — dev server (porta 4200).
- `ng build` — build de produção AOT.
- `ng test` — testes unitários via **Vitest + jsdom** (builder `@angular/build:unit-test`, não Karma).
  - `ng test --watch=false` — execução única.
  - `ng test --filter="NomeDoSuite"` — roda só os testes cujo nome casa com o regex (verificado).
  - `ng test --include="src/app/features/categories"` — roda os specs de uma pasta.
- `npx prettier --write .` — formatação (`.prettierrc`: printWidth 100, singleQuote, parser `angular` em HTML).

Gotchas:

- **Nunca rode `npx vitest` diretamente** — falha com `JIT compilation failed for injectable [PlatformLocation]`. Use sempre `ng test`.
- **Não existe linter**: `ng lint` e `npm run lint` não existem no repo. Não os invoque nem coloque no DoD.
- Orçamentos de build que quebram `ng build`: SCSS de componente > 8kB erro (> 4kB warning), bundle inicial > 1MB erro.
- Ambientes em `src/environments/environment*.ts`: dev e prod apontam para `http://localhost:5074`.
- O working tree pode conter features não commitadas de outras sessões em paralelo (fase Red do TDD). Se `ng test` falhar em arquivo que você não tocou, rode `git status` antes de investigar.

Ordem de verificação para concluir tarefa: `ng test --watch=false` → `ng build` → `npx prettier --check .`.

#IGNORE O TDD(vamos focar em code mais rápido)

## 2. Metodologia: TDD obrigatório

Ciclo Red-Green-Refactor por tarefa:

1. **Red**: escreva primeiro o `*.spec.ts` cobrindo caso feliz e bordas (erro 400 da API, saldo negativo). Confirme que falha pela razão certa.
2. **Green**: código mínimo para passar.
3. **Refactor**: limpe duplicações mantendo os testes verdes.

Foco dos testes de UI: comportamento observável no DOM (botão habilitado/desabilitado, mensagem de erro), não detalhes internos.

## 3. Regras Angular (não negociáveis)

- Somente standalone; `changeDetection: ChangeDetectionStrategy.OnPush` em todo componente; injeção via `inject()` no corpo da classe (sem construtor).
- Só sintaxe nativa de controle de fluxo: `@if`, `@for` (sempre com `track`), `@switch`. Proibido `*ngIf`, `*ngFor`, `*ngSwitch`.
- Reatividade: `input()`, `output()`, `computed()`, `signal()`; `effect()` apenas para side-effects externos (nunca para alterar estado). Proibido `@Input`, `@Output` e getters como reatividade.
- `.subscribe()` manual proibido em componentes. Ponte HTTP → Signals nos state services com `firstValueFrom()` (padrão do repo) ou `toSignal()`.
- Formulários: Reactive Forms tipados estritamente, `FormControl` com `{ nonNullable: true }`.
- Lazy loading obrigatório em todas as rotas (`loadComponent`/`loadChildren`).
- Sem `any` (dado desconhecido: `unknown` + narrowing explícito); sem NgModule.
- Host bindings só pelo bloco `host: { }` do `@Component`.
- Prefera `[class.nome]="condicao"` a `ngClass`/`ngStyle`.
- Código, nomes de arquivos e commits em inglês; textos de UI em pt-BR.
- Nomenclatura no padrão do `ng generate` da versão instalada (`feature-name.component.ts`).

## 4. Estrutura e dependências

```
src/app/
  core/                  # singletons: auth, theme, guards, interceptors, shell, i18n
  shared/                # sem regra de negócio: enums/labels, pipes, UI genérica
  features/<feature>/    # models/, services/, components/, routes.ts
```

- `features/*` → `core/` e `shared/`; `features/*` não importam de outra `feature`; `shared/` não importa `core/` nem `features/`.
- Dentro de cada feature: `*-api.service.ts` (HTTP fino + DTOs) e `*-state.service.ts` (signals e orquestração).
- **Ao criar uma feature, registre a rota manualmente em `src/app/app.routes.ts`** como filho do shell. É fácil esquecer e não há teste que falhe por isso.
- Shell responsivo em `core/components/shell` (sidenav desktop, bottom-nav mobile).

## 5. Integração com a API (.NET)

- URL base sempre via `environment.apiUrl`, nunca hardcoded.
- Enums chegam como inteiros: espelhe em `shared/models/enums.ts` com labels pt-BR (`*_LABELS`); exiba sempre pelo dicionário.
- Sem cálculos financeiros no cliente (soma de saldos, estornos): a fonte da verdade é a API. Exibição com `CurrencyPipe` (pt-BR/BRL).
- Datas ISO 8601 UTC → converter para fuso local só na exibição (`DatePipe`).
- Erros normalizados no `core/interceptors/auth.interceptor.ts` em `ApiError` (aceita string de `BadRequest("msg")` ou objeto `{ statusCode, message, errorCode, details }`).
- Locale `pt-BR` vem de `app.config.ts` (`LOCALE_ID`) + `core/i18n.ts` (`registerLocaleData`); componentes que usam pipes de data/moeda importam `core/i18n`.

## 6. Autenticação e segurança

- JWT via `core/interceptors/auth.interceptor.ts` (header Bearer). Token encapsulado no `AuthService` (signals); componentes nunca acessam `localStorage`.
- Resposta 401 → logout + navegação para `/auth/login` (já tratado no interceptor).
- Guards `authGuard` e `guestGuard` em `core/guards`.
- Proibido `console.log` de token, senha, CPF ou dados bancários. Proibido `[innerHTML]` com dados da API.

## 7. Tema, mobile e acessibilidade

- Material 3, violeta da marca ≈ `#820AD1`. Tokens globais em `styles.scss`: `--nu-*` (superfícies, marca, texto) e `--app-*` (income, expense, pending, overdue), via `light-dark()`.
- Cores fixas (`#hex`, `rgb()`, `rgba()`, `hsl()`), `!important` e `::ng-deep` proibidos em SCSS de componente — use `var(--nu-*)` e `var(--app-*)`. `var(--mat-sys-*)` só onde o Material exigir.
- Tema claro/escuro exclusivamente via `ThemeService` em `core/services`: classe `.dark`/`.light` + `colorScheme` no `<html>`, persistido em localStorage (fallback `prefers-color-scheme`).
- Mobile-first: base ~360px e expansão só com `@media (min-width: ...)` — nunca `max-width`. Alvos de toque ≥ 48×48px. Respeitar `env(safe-area-inset-*)` nas barras fixas.
- `mat-table` vira lista de cards abaixo de 768px; evitar scroll horizontal como padrão.
- Acessibilidade WCAG 2.2 AA: `aria-hidden` em ícones decorativos, `aria-label` pt-BR em botões só de ícone, nunca remover `:focus-visible`, respeitar `prefers-reduced-motion`, contraste 4.5:1 (texto) e 3:1 (controles). Receita vs despesa nunca diferenciadas apenas por cor (sempre sinal `+`/`−` ou rótulo).

### 7.1 Design: regras normativas

Detalhes e exemplos em `DESIGN.md`. Aqui ficam só as regras que o agente não pode errar.

**Obrigatório**

- Espaçamento, raio, sombra e duração de transição via token. Número solto (`border-radius: 20px`, `transition: 0.3s`) é proibido; se o token não existir, crie em `styles.scss` antes de usar.
- Card: fundo `--nu-surface-card`, borda `1px solid var(--nu-border)`, raio de card, sem sombra pesada. Glow (`--nu-primary-glow`) só no card de saldo; os demais não têm.
- Hover com `translateY(-2px)` só em card clicável e só dentro de `@media (prefers-reduced-motion: no-preference)`.
- Texto informativo (rótulos, legendas, "Fatura atual") usa `--nu-text-secondary` ou mais forte. `--nu-text-muted` só em placeholder, item desabilitado e elemento decorativo, porque não atinge 4.5:1.
- Texto sobre `--nu-primary` usa `--nu-on-primary` (crie em `styles.scss` se faltar), com contraste ≥ 4.5:1 nos dois temas. Não assuma branco.
- Valores monetários com `font-variant-numeric: tabular-nums`. Movimentações (receita, despesa, transferência) com sinal explícito `+`/`−` e cor semântica; saldos e totais sem sinal; resultado líquido e variações com sinal.
- Privacidade de saldo: o botão de olho fica dentro do card de saldo no desktop e no header no mobile. Quando oculto, **todos** os valores monetários da tela viram `••••••`, não só o do card.
- Quick actions: no máximo 4 (Pagar, Transferir, Receber, Cartões), círculo de 56px, fundo `--nu-surface-subtle`, ícone em `--nu-primary`, rótulo em `0.75rem`. Não duplique itens da sidebar.
- Cartão de crédito: chip "Crédito", fatura atual em destaque e limite disponível com barra de progresso (`mat-progress-bar` com `aria-label` pt-BR).
- Todo componente que exibe dados da API trata 4 estados, e o spec cobre cada um:
  - **loading**: skeleton; nunca exiba `R$ 0,00` como placeholder.
  - **vazio**: ícone + texto curto + CTA no mesmo estilo do feed.
  - **erro**: mensagem pt-BR vinda do `ApiError` + ação de tentar de novo.
  - **conteúdo**.

**Proibido**

- Cor fixa, `!important`, `::ng-deep`, media query `max-width`.
- Comunicar status só por cor (sempre sinal ou rótulo).
- Usar nome, logo ou assets do Nubank na UI. O Nubank é apenas inspiração visual; a marca na tela é Monetis.
- Inventar variação visual fora do `DESIGN.md` (novo raio, nova sombra, novo tom). Se precisar, proponha o token em vez de improvisar.

### 7.2 Verificação visual

Não há ferramenta automatizada de lint/a11y/screenshot no repo. Ao concluir mudança de UI, confira manualmente: 360px e 1280px, tema claro e escuro, navegação por teclado (`:focus-visible` visível) e contraste dos textos novos pelo DevTools.

Se achar que Stylelint (`color-no-hex`), axe-core ou Playwright com screenshots valeria a pena, **não instale**: registre a sugestão com justificativa e aguarde autorização (seção 11).

## 8. Testes (Vitest)

#IGNORE O TDD(vamos focar em code mais rápido)

- Runner é Vitest, não Jasmine: use `vi.fn()`, `vi.spyOn()`. Asserções booleanas são `toBe(true)` / `toBe(false)` — **`toBeTrue()`/`toBeFalse()` não existem** e quebram o build do teste.
- Mock de state service: objeto comum com `signal(...)` nos getters e `vi.fn()` nos métodos, via `{ provide: X, useValue: mock }`.
- Services de API: `HttpTestingController` com `provideHttpClientTesting()` — assertar URL exata (`environment.apiUrl` + path), método e body; `httpMock.verify()` no `afterEach`.
- Specs ao lado da implementação (`*.spec.ts`).
- `ng test` roda a suíte inteira: qualquer spec quebrado (inclusive de outra feature) derruba a execução.

## 9. Commits (Conventional Commits)

Formato: `<tipo>(<escopo>): <descrição curta em inglês, imperativo, minúscula, sem ponto>`.

- Tipos: `feat`, `fix`, `test`, `refactor`, `style`, `docs`, `chore`, `perf`.
- Mensagem **exclusivamente em inglês** (ex.: `feat(auth): implement jwt interceptor`).
- Escopos úteis: `auth`, `accounts`, `cards`, `categories`, `expenses`, `incomes`, `subscriptions`, `transfers`, `dashboard`, `core`, `shared`.

## 10. Definition of Done

#IGNORE O TDD(vamos focar em code mais rápido)

- [ ] TDD seguido (spec antes da implementação).
- [ ] `ng test --watch=false` 100% verde.
- [ ] `ng build` sem erros e sem estourar budgets.
- [ ] `npx prettier --check .` limpo.
- [ ] Sem `any`, NgModule, diretivas legadas, `.subscribe()` manual em componentes.
- [ ] Sem cores fixas nem `::ng-deep`; validado em 360px e 1280px, nos dois temas.
- [ ] Estilos só com tokens (sem números soltos de raio/sombra/transição); estados loading, vazio e erro implementados e testados.
- [ ] Contraste dos textos novos conferido (≥ 4.5:1 texto, ≥ 3:1 controles), sem `--nu-text-muted` em texto informativo.
- [ ] Se a mudança exigiu token novo, ele está em `styles.scss` e documentado no `DESIGN.md`.
- [ ] Navegabilidade por teclado e labels de acessibilidade conferidos.
- [ ] Commit Conventional Commits em inglês.

## 11. Nunca fazer sem pedir

- Atualizar dependências ou adicionar bibliotecas (nenhuma alteração em `package.json` sem autorização).
- Editar `angular.json`, `tsconfig*.json` ou configs de build sem justificativa técnica.
- Contornar o backend: se faltar endpoint/campo, registre como impedimento em vez de replicar regra de negócio no cliente.
- Adicionar ferramentas de qualidade visual (Stylelint, axe-core, Playwright ou similares): sugira com justificativa, não instale.
- Alterar o valor de um token existente em `styles.scss` (cor, raio, espaçamento): isso muda o app inteiro. Criar token novo é permitido; mudar um existente exige aprovação.

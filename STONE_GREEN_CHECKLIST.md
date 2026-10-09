# Stone Green Redesign — Checklist de Implementação

> Plano de redesign completo: troca de marca violeta → verde Stone, nova paleta, sidebar, cards, quick actions, toast de erro e renomeação de tokens `--nu-*` → `--m-*`.

---

## Fase 1 — Tokens e Tema (base, sem teste)

### 1.1 Renomear tokens `--nu-*` → `--m-*` em `src/styles.scss`

- [x] `--nu-primary` → `--m-primary`
- [x] `--nu-primary-rgb` → `--m-primary-rgb`
- [x] `--nu-primary-glow` → `--m-primary-glow`
- [x] `--nu-primary-hover` → `--m-primary-hover`
- [x] `--nu-primary-container` → `--m-primary-container`
- [x] `--nu-on-primary` → `--m-on-primary`
- [x] `--nu-bg-canvas` → `--m-bg-canvas`
- [x] `--nu-surface-sidebar` → `--m-surface-sidebar`
- [x] `--nu-surface-card` → `--m-surface-card`
- [x] `--nu-surface-card-hover` → `--m-surface-card-hover`
- [x] `--nu-surface-raised` → `--m-surface-raised`
- [x] `--nu-surface-subtle` → `--m-surface-subtle`
- [x] `--nu-border` → `--m-border`
- [x] `--nu-border-strong` → `--m-border-strong`
- [x] `--nu-border-focus` → `--m-border-focus`
- [x] `--nu-text-primary` → `--m-text-primary`
- [x] `--nu-text-secondary` → `--m-text-secondary`
- [x] `--nu-text-muted` → `--m-text-muted`
- [x] `--nu-radius-control` → `--m-radius-control`
- [x] `--nu-radius-card` → `--m-radius-card`
- [x] `--nu-radius-dialog` → `--m-radius-dialog`
- [x] `--nu-radius-pill` → `--m-radius-pill`
- [x] `--nu-space-*` → `--m-space-*`
- [x] `--nu-shadow-hover` → `--m-shadow-hover`
- [x] `--nu-glow-primary` → `--m-glow-primary`
- [x] `--nu-duration-fast` → `--m-duration-fast`
- [x] `--nu-duration-base` → `--m-duration-base`
- [x] `--nu-ease` → `--m-ease`

### 1.2 Atualizar valores dos tokens (nova paleta Stone Green)

**Light mode:**

- [x] `--m-primary`: `#00A868`
- [x] `--m-primary-hover`: `#008050`
- [x] `--m-primary-container`: `#E6F8F0`
- [x] `--m-on-primary`: `#FFFFFF`
- [x] `--m-primary-glow`: `rgba(0, 168, 104, 0.15)`
- [x] `--m-bg-canvas`: `#F4F7F5`
- [x] `--m-surface-card`: `#FFFFFF`
- [x] `--m-surface-card-hover`: `#EAEFEA`
- [x] `--m-surface-subtle`: `#E8EDE9`
- [x] `--m-border`: `rgba(0, 0, 0, 0.07)`
- [x] `--m-border-focus`: `#008050`
- [x] `--m-text-primary`: `#0E1712`
- [x] `--m-text-secondary`: `#5C6861`
- [x] `--m-text-muted`: `#6B7A70`

**Dark mode:**

- [x] `--m-primary`: `#00D084`
- [x] `--m-primary-hover`: `#00E896`
- [x] `--m-primary-container`: `rgba(0, 208, 132, 0.12)`
- [x] `--m-on-primary`: `#042618`
- [x] `--m-primary-glow`: `rgba(0, 208, 132, 0.25)`
- [x] `--m-bg-canvas`: `#0A0F0D`
- [x] `--m-surface-card`: `#121A16`
- [x] `--m-surface-card-hover`: `#1A2620`
- [x] `--m-surface-subtle`: `#1A2620`
- [x] `--m-border`: `rgba(255, 255, 255, 0.07)`
- [x] `--m-border-focus`: `#00D084`
- [x] `--m-text-primary`: `#F5FAF7`
- [x] `--m-text-secondary`: `#8E9F96`
- [x] `--m-text-muted`: `#5A6B60`

### 1.3 Tema Material

- [x] Criar paleta customizada `mat.$stone-green-palette` com tons derivados de `#00A868`
- [x] Atualizar `$light-theme` para usar a nova paleta
- [x] Atualizar `$dark-theme` para usar a nova paleta
- [x] Remover referência a `mat.$violet-palette`

### 1.4 Migrar para `light-dark()`

- [x] Substituir bloco `:root.light` / `:root.dark` por `light-dark()` inline nos tokens
- [x] Manter fallback para browsers antigos se necessário
- [x] Validar que `color-scheme` continua funcionando

### 1.5 Renomear classes utilitárias em `styles.scss`

- [x] `.nu-avatar` → `.m-avatar`
- [x] `.nu-tag` → `.m-tag`
- [x] `.nu-icon-circle` → `.m-icon-circle`
- [x] `.nu-pill-badge` → `.m-pill-badge`
- [x] `.nu-skeleton` → `.m-skeleton`
- [x] `.nu-progress-track` → `.m-progress-track`
- [x] `.nu-progress-fill` → `.m-progress-fill`
- [x] `.nu-empty-state` → `.m-empty-state`
- [x] `.nu-empty-icon` → `.m-empty-icon`
- [x] `.nu-empty-title` → `.m-empty-title`
- [x] `.nu-empty-desc` → `.m-empty-desc`
- [x] `.nu-card` → `.m-card`
- [x] `.nu-eyebrow` → `.m-eyebrow`

### 1.6 Atualizar todos os componentes (busca e substituição global)

- [x] `src/app/**/*.scss` — substituir `var(--nu-*)` por `var(--m-*)`
- [x] `src/app/**/*.html` — substituir classes `.nu-*` por `.m-*`
- [x] `src/app/**/*.ts` — substituir referências a tokens se houver

### 1.7 Atualizar `DESIGN.md`

- [x] Seção 2.1 (Superfícies) — nova paleta
- [x] Seção 2.2 (Marca) — nova paleta
- [x] Seção 2.3 (Semânticas) — manter, ajustar se necessário
- [x] Seção 2.4 (Texto) — nova paleta
- [x] Seção 3 (Forma, espaço, movimento) — renomear tokens
- [x] Seção 4 (Componentes → tokens) — renomear tokens
- [x] Seção 5.1 (Shell) — ajustar descrição
- [x] Seção 5.3 (Cartão de crédito) — barra customizada 3px
- [x] Seção 5.6 (Quick actions) — remover círculo no desktop
- [x] Seção 6 (Estados) — toast em vez de banner inline
- [x] Seção 8 (Exemplos) — atualizar exemplos com novos tokens

---

## Fase 2 — Sidebar (`shell.component`)

### 2.1 Desktop

- [x] Item ativo: manter `border-left: 3px solid var(--m-primary)` + `--m-primary-container` translúcido
- [x] Avatar: adicionar `border: 2px solid var(--m-primary)` no `.m-avatar`
- [x] Bloco do usuário: tornar clicável com `routerLink="/profile"`
- [x] Adicionar label "Minha Conta" ao lado do e-mail
- [x] Remover tag "ULTRAVIOLETA" → substituir por "STONE" ou remover

### 2.2 Mobile

- [x] Manter bottom nav com pills translúcidas
- [x] Ajustar tamanho para 48x48px se necessário
- [x] Avatar com borda verde no header mobile
- [x] Olho de privacidade e tema com controles acessíveis

### 2.3 Specs

- [x] Atualizar `shell.component.spec.ts` para refletir novo comportamento (bloco clicável, label "Minha Conta")
- [x] Testar item ativo com nova cor
- [x] Testar navegação para `/profile`

---

## Fase 3 — Dashboard (`dashboard-home.component`)

### 3.1 Card de Saldo

- [x] Trocar "Ver contas" → "Extrato completo →" (manter `routerLink="/extrato"`)
- [x] Badge compacto para resultado do mês: `+ R$ 0,00 (+0.0%)` em pill translúcida
- [x] Cor do badge: `--app-income` (positivo) / `--app-expense` (negativo)
- [x] Manter botão de olho dentro do card (desktop) e no header (mobile)
- [x] Manter glow no card de saldo

### 3.2 Card de Cartão de Crédito

- [x] Mover link do bottom para topo direito: "Faturas e limites →"
- [x] Substituir `mat-progress-bar` por barra customizada de 3px:
  - [x] Trilho: `--m-surface-subtle`
  - [x] Preenchimento: `--m-primary` (verde Stone)
  - [x] Altura: 3px
  - [x] Border-radius: `--m-radius-pill`
  - [x] Manter `aria-label` pt-BR
- [x] Manter chip "Crédito" e ícone
- [x] Remover botão "Ver faturas e despesas" do bottom

### 3.3 Card de Fluxo do Mês

- [x] Métricas de Receitas/Despesas em colunas equilibradas (layout em grid 2 colunas)
- [x] Manter mini gráfico proporcional
- [x] Cores: Receitas `--app-income`, Despesas `--app-expense`
- [x] Manter resultado líquido com sinal

### 3.4 Specs

- [x] Atualizar `dashboard-home.component.spec.ts` para refletir:
  - [x] "Extrato completo" em vez de "Ver contas"
  - [x] Badge compacto de resultado do mês
  - [x] Link "Faturas e limites" no topo direito
  - [x] Barra customizada 3px (sem `mat-progress-bar`)
  - [x] Layout em colunas do fluxo do mês

---

## Fase 4 — Quick Actions

### 4.1 Desktop

- [x] Remover círculo de fundo (`.m-icon-circle`)
- [x] Ícone minimalista (Material Symbols) com cor `--m-text-secondary`
- [x] Hover: cor `--m-primary` + `translateY(-2px)`
- [x] Rótulo abaixo do ícone
- [x] Manter os 4 itens canônicos: Pagar, Transferir, Receber, Cartões

### 4.2 Mobile

- [x] Manter círculo 48x48px com fundo `--m-surface-subtle` translúcido
- [x] Hover: cor `--m-primary`
- [x] Área de toque ≥ 48x48px

### 4.3 Specs

- [x] Atualizar spec para refletir quick actions
- [x] Testar comportamento e acessibilidade

---

## Fase 5 — Toast de Erro

### 5.1 Criar componente `core/components/error-toast/error-toast.component`

- [x] Criar `error-toast.component.ts`
- [x] Criar `error-toast.component.html`
- [x] Criar `error-toast.component.scss`
- [x] Criar `error-toast.component.spec.ts`

### 5.2 Comportamento

- [x] Posição: fixo no rodapé direito (desktop) ou topo (mobile)
- [x] Título: "Falha de sincronização"
- [x] Mensagem: "Não foi possível carregar os dados financeiros mais recentes."
- [x] Ação: botão "Reconectar"
- [x] Detalhes técnicos: apenas `console.error`
- [x] Auto-dismiss após 10s ou ação do usuário
- [x] Animação de entrada/saída (respeitar `prefers-reduced-motion`)

### 5.3 Integração

- [x] Criar serviço `ErrorToastService` com signal para controlar visibilidade
- [x] Integrar com tratamento de erro no dashboard / interceptor
- [x] Remover banner inline `.dashboard-error-state` do dashboard
- [x] Adicionar toast ao shell (visível em todas as páginas)

### 5.4 Specs

- [x] Testar exibição do toast
- [x] Testar botão "Reconectar"
- [x] Testar auto-dismiss
- [x] Testar que detalhes técnicos não aparecem na UI

---

## Fase 6 — Rotas Novas (se necessário)

### 6.1 Perfil (`/profile`)

- [x] Verificar se existe rota de perfil
- [x] Redirecionar para `/accounts` em `app.routes.ts`
- [x] Adicionar link no shell (bloco do usuário)

### 6.2 Extrato (`/extrato`)

- [x] Verificar se existe rota de extrato
- [x] Redirecionar para `/expenses` em `app.routes.ts`
- [x] Adicionar link no card de saldo

---

## Fase 7 — Validação Final

### 7.1 Testes

- [x] `ng test --watch=false` — 100% verde
- [x] Todos os specs atualizados passando

### 7.2 Build

- [x] `ng build` — sem erros
- [x] Sem estourar budgets (SCSS de componente < 8kB, bundle inicial < 1MB)

### 7.3 Formatação

- [x] `npx prettier --check .` — limpo

### 7.4 Verificação Visual

- [x] 360px e 1280px
- [x] Tema claro e escuro
- [x] Navegação por teclado (`:focus-visible` visível)
- [x] Contraste dos textos novos (≥ 4.5:1 texto, ≥ 3:1 controles)
- [x] Sem `--m-text-muted` em texto informativo
- [x] Estados loading, vazio e erro funcionando

### 7.5 Regras do AGENTS.md

- [x] Sem `any`, NgModule, diretivas legadas, `.subscribe()` manual
- [x] Sem cores fixas nem `::ng-deep`
- [x] Estilos só com tokens (sem números soltos de raio/sombra/transição)
- [x] Tokens novos documentados no `DESIGN.md`
- [x] Commit Conventional Commits em inglês

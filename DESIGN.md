# DESIGN.md — Monetis Web

Versão 1.0 · 2026-10-07 · Referência de design para agentes de código.
Regras gerais do repo estão no `AGENTS.md`. Este arquivo cobre só a camada visual.

**Precedência:** `src/styles.scss` (valores dos tokens) > `DESIGN.md` > preferência do agente.
Se um valor aqui divergir do `styles.scss`, o `styles.scss` vale e este arquivo deve ser corrigido.

Palavras **MUST / MUST NOT / SHOULD** seguem o sentido da RFC 2119.

---

## 1. Regras (leia primeiro)

### MUST

1. Estilos de componente consomem **apenas tokens**: `--nu-*` e `--app-*`. `--mat-sys-*` só onde o Material exigir.
2. Raio, espaçamento, sombra e duração de transição vêm de token (seção 3). Número solto é proibido.
3. Texto informativo usa `--nu-text-secondary` ou `--nu-text-primary`. `--nu-text-muted` só para placeholder, item desabilitado e elemento decorativo.
4. Texto sobre fundo `--nu-primary` usa `--nu-on-primary`.
5. Valores monetários usam `CurrencyPipe` (pt-BR/BRL) e `font-variant-numeric: tabular-nums`.
6. Receita, despesa e status nunca são comunicados só por cor: sempre sinal (`+`/`−`) ou rótulo/badge.
7. Todo componente que mostra dados da API implementa os 4 estados da seção 6 (loading, vazio, erro, conteúdo) e tem spec para cada um.
8. Todo botão só de ícone tem `aria-label` em pt-BR; todo ícone decorativo tem `aria-hidden="true"`.
9. Todo elemento interativo tem `:focus-visible` visível (contorno com `--nu-border-focus`).
10. Tema claro e escuro funcionam nos dois; o escuro é o padrão visual.

### MUST NOT

- `#hex`, `rgb()`, `rgba()`, `hsl()`, `!important`, `::ng-deep` em SCSS de componente.
- Media query `max-width` (mobile-first, só `min-width`).
- Preto puro `#000` ou branco puro como fundo de superfície no escuro.
- Sombra pesada. Elevação é feita por superfície + borda; sombra só no hover (seção 3.4).
- Glow fora do card de saldo e de estados de foco/seleção.
- Nome, logo ou assets do Nubank na UI. O Nubank é inspiração visual; a marca na tela é **Monetis**.
- Inventar raio, sombra, tom ou espaçamento novo. Se faltar, **crie o token** em `styles.scss` e documente aqui.
- Alterar o valor de um token existente sem aprovação (muda o app inteiro).

### SHOULD

- Separar camadas por **borda + superfície**, não só por diferença de tom (os fundos escuros são muito próximos entre si).
- Manter SCSS de componente abaixo de 4kB (erro do build em 8kB).
- Preferir `[class.x]="cond"` a `ngClass`.

---

## 2. Tokens de cor

Tabelas de **referência**. Fonte real: `src/styles.scss`. Tokens marcados com ★ podem não existir ainda: crie-os antes de usar.

### 2.1 Superfícies

| Token                     | Claro                 | Escuro                      | Uso                                |
| :------------------------ | :-------------------- | :-------------------------- | :--------------------------------- |
| `--nu-bg-canvas`          | `#F4F5F8`             | `#0B0B0F`                   | Fundo da aplicação                 |
| `--nu-surface-card`       | `#FFFFFF`             | `#14141D`                   | Cards, painéis, sidebar            |
| `--nu-surface-card-hover` | `#F8F9FC`             | `#1A1A26`                   | Hover em itens e cards clicáveis   |
| `--nu-surface-raised`     | `#FFFFFF`             | `#222230`                   | Modais, popovers, gavetas          |
| `--nu-surface-subtle`     | `#ECEEF2`             | `#181824`                   | Chips, botões secundários, atalhos |
| `--nu-border`             | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` | Divisórias e contorno de cards     |
| `--nu-border-strong` ★    | definir (≥ 3:1)       | definir (≥ 3:1)             | Contorno de inputs e controles     |
| `--nu-border-focus`       | `#820AD1`             | `#A855F7`                   | Foco e seleção                     |

`--nu-border` (8% de opacidade) é decorativo e **não** atende 3:1. Controles interativos (inputs, checkbox, select) usam `--nu-border-strong`.

### 2.2 Marca

| Token                    | Claro                      | Escuro                     | Uso                              |
| :----------------------- | :------------------------- | :------------------------- | :------------------------------- |
| `--nu-primary`           | `#820AD1`                  | `#A855F7`                  | Ação principal, ícones de ação   |
| `--nu-on-primary` ★      | `#FFFFFF`                  | `#0B0B0F`                  | Texto/ícone sobre `--nu-primary` |
| `--nu-primary-hover`     | `#6D08AF`                  | `#B76EFF`                  | Hover do botão primário          |
| `--nu-primary-container` | `#F3E8FF`                  | `rgba(168, 85, 247, 0.12)` | Item ativo, badges               |
| `--nu-primary-glow`      | `rgba(130, 10, 209, 0.15)` | `rgba(168, 85, 247, 0.25)` | Glow do card de saldo            |

Por que `--nu-on-primary` é escuro no tema escuro: branco sobre `#A855F7` dá cerca de 4:1 e não passa nos 4,5:1 para texto normal; `#0B0B0F` sobre `#A855F7` passa. Confira com a ferramenta de contraste do DevTools ao ajustar.

### 2.3 Semânticas de domínio

| Token           | Claro     | Escuro    | Uso                                 |
| :-------------- | :-------- | :-------- | :---------------------------------- |
| `--app-income`  | `#107C41` | `#4ADE80` | Receitas, entradas, superávit       |
| `--app-expense` | `#C5221F` | `#F87171` | Despesas, saídas, faturas de cartão |
| `--app-pending` | `#8C6B00` | `#FACC15` | Pendentes, faturas abertas          |
| `--app-overdue` | `#BA1A1A` | `#FCA5A5` | Em atraso                           |

### 2.4 Texto

| Token                 | Claro     | Escuro    | Uso permitido                                |
| :-------------------- | :-------- | :-------- | :------------------------------------------- |
| `--nu-text-primary`   | `#111116` | `#F5F5F7` | Títulos, valores, rótulos principais         |
| `--nu-text-secondary` | `#5A5D6B` | `#9E9EA8` | Legendas, rótulos de apoio, "Fatura atual"   |
| `--nu-text-muted`     | `#8F92A1` | `#636372` | **Só** placeholder, desabilitado, decorativo |

`--nu-text-muted` fica em torno de 3:1 e **não** cumpre 4,5:1. Usá-lo em texto que o usuário precisa ler é bug de acessibilidade.

---

## 3. Tokens de forma, espaço e movimento

Todos ★: se não existirem em `styles.scss`, crie com estes valores.

### 3.1 Raio

| Token                 | Valor    | Uso                            |
| :-------------------- | :------- | :----------------------------- |
| `--nu-radius-control` | `12px`   | Inputs, itens de navegação     |
| `--nu-radius-card`    | `20px`   | Cards                          |
| `--nu-radius-dialog`  | `24px`   | Diálogos e gavetas             |
| `--nu-radius-pill`    | `9999px` | Botões, chips, badges, atalhos |

### 3.2 Espaçamento (base 4px)

`--nu-space-1` 4px · `-2` 8px · `-3` 12px · `-4` 16px · `-5` 20px · `-6` 24px · `-8` 32px · `-10` 40px.
Padding interno de card: `--nu-space-5` (mobile) e `--nu-space-6` (≥ 768px). Espaço entre cards: `--nu-space-4`.

### 3.3 Tipografia

Família: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

| Papel           | Tamanho    | Peso | Onde                                 |
| :-------------- | :--------- | :--- | :----------------------------------- |
| Saldo (display) | `2rem`+    | 700  | Valor do card de saldo               |
| Título de tela  | `1.5rem`   | 700  | Saudação/cabeçalho da página         |
| Seção           | `1.125rem` | 600  | "Histórico recente", títulos de card |
| Corpo           | `0.875rem` | 400  | Texto, linhas de lista               |
| Rótulo          | `0.75rem`  | 500  | Legendas, rótulo de atalho, eyebrow  |

Eyebrow ("RESUMO FINANCEIRO"): `0.75rem`, peso 600, caixa alta, `--nu-primary`.
O título de tela é **contextual** ("Boa noite, {nome}"), não genérico.

### 3.4 Sombra e movimento

| Token                | Valor sugerido                    | Uso                             |
| :------------------- | :-------------------------------- | :------------------------------ |
| `--nu-shadow-hover`  | `0 8px 24px rgba(0, 0, 0, 0.25)`  | Hover de card clicável (escuro) |
| `--nu-glow-primary`  | `0 0 32px var(--nu-primary-glow)` | Somente card de saldo           |
| `--nu-duration-fast` | `150ms`                           | Hover, foco, troca de cor       |
| `--nu-duration-base` | `250ms`                           | Expandir/colapsar, entrada      |
| `--nu-ease`          | `cubic-bezier(0.2, 0, 0, 1)`      | Todas as transições             |

Valores com `rgba()` ficam **dentro do `styles.scss`**, nunca no componente.

Todo movimento (transição, `translateY`, animação de skeleton) fica sob `@media (prefers-reduced-motion: no-preference)` ou é desligado em `reduce`.

---

## 4. Componentes → tokens

| Componente        | Fundo                                             | Borda                                      | Raio                  | Texto/ícone                                      | Hover / foco                                                             |
| :---------------- | :------------------------------------------------ | :----------------------------------------- | :-------------------- | :----------------------------------------------- | :----------------------------------------------------------------------- |
| Card              | `--nu-surface-card`                               | `1px solid var(--nu-border)`               | `--nu-radius-card`    | primary / secondary                              | Só se clicável: `-2px` + `--nu-surface-card-hover` + `--nu-shadow-hover` |
| Card de saldo     | `--nu-surface-card`                               | `--nu-border`                              | `--nu-radius-card`    | valor `--nu-text-primary`, rótulo secondary      | `box-shadow: var(--nu-glow-primary)` fixo                                |
| Sidebar           | `--nu-surface-card`                               | `border-right: 1px solid var(--nu-border)` | —                     | secondary; ativo: `--nu-text-primary`            | Item ativo: `--nu-primary-container`                                     |
| Item de navegação | transparente                                      | —                                          | `--nu-radius-control` | secondary                                        | Hover: `--nu-surface-card-hover`                                         |
| Quick action      | `--nu-surface-subtle`                             | —                                          | círculo 56px          | ícone `--nu-primary`; rótulo `0.75rem` secondary | Hover: `--nu-surface-card-hover`                                         |
| Botão primário    | `--nu-primary`                                    | —                                          | `--nu-radius-pill`    | `--nu-on-primary`                                | Hover: `--nu-primary-hover`                                              |
| Botão secundário  | transparente                                      | `1px solid var(--nu-border-strong)`        | `--nu-radius-pill`    | `--nu-text-primary`                              | Hover: `--nu-surface-card-hover`                                         |
| Input (outline)   | transparente                                      | `1px solid var(--nu-border-strong)`        | `--nu-radius-control` | primary; placeholder `--nu-text-muted`           | Foco: borda `--nu-border-focus`                                          |
| Diálogo           | `--nu-surface-raised`                             | `--nu-border`                              | `--nu-radius-dialog`  | primary                                          | —                                                                        |
| Chip/badge        | `--nu-surface-subtle` ou `--nu-primary-container` | —                                          | `--nu-radius-pill`    | cor semântica + **rótulo textual**               | —                                                                        |
| Item de feed      | transparente                                      | divisória `--nu-border`                    | —                     | título primary; data/categoria secondary         | Hover: `--nu-surface-card-hover`                                         |
| Skeleton          | `--nu-surface-subtle`                             | —                                          | do elemento que imita | —                                                | Shimmer só com motion permitido                                          |

Alvos de toque ≥ 48×48px em qualquer controle (o círculo de 56px do atalho já cumpre).

---

## 5. Padrões de tela

### 5.1 Shell

- **Desktop (≥ 1024px):** sidebar de `16.5rem` com logo Monetis, navegação, tema e logout. Usuário (avatar + e-mail) no rodapé.
- **Mobile:** header compacto (avatar, olho de saldo, tema, logout) + bottom navigation com `padding-bottom: env(safe-area-inset-bottom)` e alvos de 48px.
- Item ativo: `--nu-primary-container` translúcido. Não use bloco sólido do roxo.
- "Modo Claro/Escuro" é item secundário, sem fundo próprio competindo com a navegação.

### 5.2 Dashboard (ordem vertical)

1. Eyebrow + título contextual.
2. **Card de saldo** — rótulo "Saldo em conta", valor em display, resultado do mês com sinal, botão de olho **dentro do card** (desktop) ou no header (mobile).
3. **Quick actions** — no máximo 4: **Pagar, Transferir, Receber, Cartões**. Linha rolável no mobile, grade no desktop. Não repita itens da sidebar.
4. **Cartão de crédito** e **Fluxo do mês** lado a lado (≥ 768px), empilhados abaixo disso.
5. **Histórico recente** (feed, seção 5.4).

### 5.3 Cartão de crédito

- Chip "Crédito" + ícone de cartão.
- Fatura atual em destaque (`--app-expense` só se houver valor a pagar; com sinal ou rótulo).
- Limite disponível com barra de progresso (`mat-progress-bar`) e `aria-label` pt-BR. A barra comunica **uso** do limite; o texto ao lado repete o percentual (nunca só cor).
- Borda com reflexo metálico sutil: implemente com `border-image`/gradiente via tokens, definido no `styles.scss`.
- Botão "Ver faturas e despesas" é secundário (com borda `--nu-border-strong`), nunca um pill sem contorno.

### 5.4 Feed de transações

- Lista em formato de extrato, **não** tabela cinza. Abaixo de 768px, `mat-table` vira lista de cards.
- Item: avatar circular com ícone da categoria (`aria-hidden`), título em peso 500, data/categoria em secondary, valor à direita com `+`/`−` e cor semântica.
- Agrupamento por data quando houver mais de um dia.

### 5.5 Valores monetários e privacidade

| Tipo                                           | Sinal                 | Exemplo         |
| :--------------------------------------------- | :-------------------- | :-------------- |
| Movimentação (receita, despesa, transferência) | **Sempre** `+` ou `−` | `− R$ 450,00`   |
| Saldo e total acumulado                        | Sem sinal             | `R$ 2.000,00`   |
| Resultado líquido, variação, resultado do mês  | **Sempre** `+` ou `−` | `+ R$ 2.000,00` |

- Sem cálculo financeiro no cliente (regra do `AGENTS.md`): formatar sim, somar não.
- Se não existir, crie um pipe puro em `shared/pipes` para exibir sinal + moeda, usando `CurrencyPipe`/locale `pt-BR`.
- **Privacidade:** o estado "ocultar valores" é um `signal` global em `core` (um só). Quando ativo, **todos** os valores monetários da tela mostram `••••••`. O botão de olho tem `aria-label` ("Ocultar valores" / "Mostrar valores") e `aria-pressed`.

### 5.6 Atalhos (Quick actions)

- Círculo de `3.5rem`, fundo `--nu-surface-subtle`, ícone `--nu-primary`, rótulo `0.75rem` centralizado.
- Lista canônica fixa (seção 5.2). Para adicionar atalho, atualize este arquivo primeiro.

---

## 6. Estados (obrigatório em todo componente com dados)

| Estado   | O que mostrar                                                                                       | Proibido                              |
| :------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------ |
| Loading  | Skeleton com a mesma forma do conteúdo final                                                        | Exibir `R$ 0,00` como placeholder     |
| Vazio    | Ícone (`aria-hidden`) + texto curto + **CTA** no mesmo estilo (ex.: "Registrar primeira transação") | Card em branco                        |
| Erro     | Mensagem pt-BR vinda do `ApiError` + ação "Tentar novamente"                                        | Mensagem técnica/stack para o usuário |
| Conteúdo | O layout normal                                                                                     | —                                     |

Os specs verificam cada estado pelo DOM (texto, botão, `aria-*`), alinhado ao TDD do `AGENTS.md`.

---

## 7. Acessibilidade (WCAG 2.2 AA)

- Contraste: texto normal ≥ 4,5:1; texto grande e controles ≥ 3:1.
- Controles interativos usam `--nu-border-strong` (o `--nu-border` não basta).
- Foco: `:focus-visible` nunca removido; contorno com `--nu-border-focus`.
- Toque: ≥ 48×48px.
- Movimento: respeitar `prefers-reduced-motion`.
- Status nunca só por cor: sinal `+`/`−` ou badge textual ("Pago", "Pendente", "Vencido").
- Ícone decorativo `aria-hidden="true"`; botão só de ícone com `aria-label` pt-BR.
- Mobile-first: base 360px, expansão em `min-width: 600px`, `768px`, `1024px`, `1280px`. Sem scroll horizontal por padrão.

---

## 8. Exemplos

### 8.1 Card (certo)

```scss
.card {
  background: var(--nu-surface-card);
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-card);
  padding: var(--nu-space-5);

  @media (min-width: 768px) {
    padding: var(--nu-space-6);
  }
}

.card--clickable {
  transition:
    transform var(--nu-duration-fast) var(--nu-ease),
    background-color var(--nu-duration-fast) var(--nu-ease);

  @media (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-2px);
      background: var(--nu-surface-card-hover);
      box-shadow: var(--nu-shadow-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--nu-border-focus);
    outline-offset: 2px;
  }
}
```

### 8.2 Card (errado)

```scss
.card {
  background: #14141d; /* cor fixa */
  border: 1px solid rgba(255, 255, 255, 0.08); /* rgba no componente */
  border-radius: 20px; /* número solto */
  box-shadow: 0 10px 40px rgba(168, 85, 247, 0.5); /* sombra pesada + glow indevido */
  transition: all 0.3s; /* sem token, sem reduced-motion */
}
.card ::ng-deep .mat-mdc-button {
  color: white !important;
} /* proibido */
```

### 8.3 Item de feed (certo)

```html
<li class="feed-item">
  <span class="feed-item__avatar" aria-hidden="true">
    <mat-icon>{{ categoryIcon() }}</mat-icon>
  </span>
  <div class="feed-item__info">
    <span class="feed-item__title">{{ transaction().description }}</span>
    <span class="feed-item__meta"
      >{{ transaction().date | date: 'dd/MM' }} · {{ categoryLabel() }}</span
    >
  </div>
  <span
    class="feed-item__amount"
    [class.feed-item__amount--income]="isIncome()"
    [class.feed-item__amount--expense]="!isIncome()"
  >
    {{ signedAmount() }}
  </span>
</li>
```

`.feed-item__amount--income { color: var(--app-income); }` e `--expense` com `var(--app-expense)`; o sinal `+`/`−` vem no texto, não só na cor.

### 8.4 Botão primário (certo × errado)

```scss
/* certo */
.btn-primary {
  background: var(--nu-primary);
  color: var(--nu-on-primary);
  border-radius: var(--nu-radius-pill);
  min-height: 48px;
  &:hover {
    background: var(--nu-primary-hover);
  }
}

/* errado: branco fixo pode reprovar contraste no escuro */
.btn-primary {
  background: var(--nu-primary);
  color: #fff;
  border-radius: 999px;
}
```

---

## 9. Checklist por componente

- [ ] Só tokens (sem cor fixa, sem número solto de raio/sombra/transição).
- [ ] Funciona e foi visto em **claro e escuro**, a **360px e 1280px**.
- [ ] Estados loading, vazio, erro e conteúdo implementados e testados.
- [ ] Contraste conferido; `--nu-text-muted` não usado em texto informativo.
- [ ] Foco visível, teclado ok, `aria-label` em botões de ícone, alvos ≥ 48px.
- [ ] Respeita `prefers-reduced-motion`.
- [ ] SCSS < 4kB.
- [ ] Token novo criado? Está no `styles.scss` **e** documentado aqui.

---

## 10. Histórico

- **1.0 (2026-10-07):** reescrita a partir do guia "Nubank Ultravioleta". Correções: `--nu-text-muted` restrito (contraste), `--nu-on-primary` e `--nu-border-strong` adicionados, `#9B30FF` removido (sem token), exceção de sinal para saldos, tokens de raio/espaço/movimento, estados obrigatórios, lista canônica de atalhos, posição do olho de privacidade.

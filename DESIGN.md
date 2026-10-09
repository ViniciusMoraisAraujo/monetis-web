# DESIGN.md — Monetis Web

Versão 2.0 · 2026-10-07 · Referência de design para agentes de código.
Regras gerais do repo estão no `AGENTS.md`. Este arquivo cobre só a camada visual.

**Precedência:** `src/styles.scss` (valores dos tokens) > `DESIGN.md` > preferência do agente.
Se um valor aqui divergir do `styles.scss`, o `styles.scss` vale e este arquivo deve ser corrigido.

Palavras **MUST / MUST NOT / SHOULD** seguem o sentido da RFC 2119.

---

## 1. Regras (leia primeiro)

### MUST

1. Estilos de componente consomem **apenas tokens**: `--m-*`, `--app-*` e `--text-*` (aliases legados `--nu-*` mantidos apenas para retrocompatibilidade em `styles.scss`). `--mat-sys-*` só onde o Material exigir.
2. Raio, espaçamento, sombra e duração de transição vêm de token (seção 3). Número solto é proibido.
3. Texto informativo usa `--m-text-secondary` ou `--m-text-primary` (`--text-secondary` / `--text-primary`). `--m-text-muted` só para placeholder, item desabilitado e elemento decorativo.
4. Texto sobre fundo `--m-primary` usa `--m-on-primary`.
5. Valores monetários usam `CurrencyPipe` (pt-BR/BRL) e `font-variant-numeric: tabular-nums`.
6. Receita, despesa e status nunca são comunicados só por cor: sempre sinal (`+`/`−`) ou rótulo/badge.
7. Todo componente que mostra dados da API implementa os 4 estados da seção 6 (loading, vazio, erro, conteúdo) e tem spec para cada um.
8. Todo botão só de ícone tem `aria-label` em pt-BR; todo ícone decorativo tem `aria-hidden="true"`.
9. Todo elemento interativo tem `:focus-visible` visível (contorno com `--m-border-focus`).
10. Tema claro e escuro funcionam nos dois; o escuro (Stone Dark) é o padrão visual.

### MUST NOT

- `#hex`, `rgb()`, `rgba()`, `hsl()`, `!important`, `::ng-deep` em SCSS de componente.
- Media query `max-width` (mobile-first, só `min-width`).
- Preto puro `#000` ou branco puro como fundo de superfície no escuro.
- Sombra pesada. Elevação é feita por superfície + borda; sombra só no hover (seção 3.4).
- Glow fora do card de saldo e de estados de foco/seleção.
- Nome, logo ou assets de terceiros (Nubank, Stone, etc.) na UI. A marca na tela é **Monetis**.
- Inventar raio, sombra, tom ou espaçamento novo. Se faltar, **crie o token** em `styles.scss` e documente aqui.
- Alterar o valor de um token existente sem aprovação (muda o app inteiro).

### SHOULD

- Separar camadas por **borda + superfície**, não só por diferença de tom (os fundos escuros são muito próximos entre si).
- Manter SCSS de componente abaixo de 4kB (erro do build em 8kB, warning em 4kB).
- Preferir `[class.x]="cond"` a `ngClass`.

---

## 2. Tokens de cor

Tabelas de **referência**. Fonte real: `src/styles.scss`.

### 2.1 Superfícies (Stone Dark/Light Matrix)

| Token                                            | Claro (Light)         | Escuro (Stone Dark)         | Uso                                |
| :----------------------------------------------- | :-------------------- | :-------------------------- | :--------------------------------- |
| `--app-bg` / `--m-bg-canvas`                     | `#F4F7F5`             | `#0A0F0D`                   | Fundo da aplicação (grafite Stone) |
| `--app-surface` / `--m-surface-card`             | `#FFFFFF`             | `#121A16`                   | Cards e superfícies elevadas       |
| `--app-surface-hover` / `--m-surface-card-hover` | `#EAEFEA`             | `#1A2620`                   | Hover e contraste interativo       |
| `--m-surface-sidebar`                            | `#FFFFFF`             | `#0D1411`                   | Barra lateral / sidebar            |
| `--m-surface-raised`                             | `#FFFFFF`             | `#1A2620`                   | Diálogos e gavetas elevadas        |
| `--m-surface-subtle`                             | `#E8EDE9`             | `#1A2620`                   | Chips, controles, atalhos          |
| `--app-border` / `--m-border`                    | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.07)` | Divisórias e bordas finas          |
| `--m-border-strong`                              | `rgba(0, 0, 0, 0.15)` | `rgba(255, 255, 255, 0.14)` | Controles e botões outline         |
| `--app-border-focus` / `--m-border-focus`        | `#008050`             | `#00D084`                   | Foco e seleção ativa               |

### 2.2 Marca (Stone Green Brand)

| Token                   | Valor                                          | Uso                                             |
| :---------------------- | :--------------------------------------------- | :---------------------------------------------- |
| `--stone-green-900`     | `#042618`                                      | Fundo de contraste escuro, container profundo   |
| `--stone-green-700`     | `#008050`                                      | Foco claro, hover do botão primário             |
| `--stone-green-500`     | `#00A868`                                      | Cor primária Stone Brand (botões e ações)       |
| `--stone-green-400`     | `#00D084`                                      | Destaque vibrante, dark mode accent, barras 3px |
| `--stone-green-100`     | `#E6F8F0`                                      | Container suave claro                           |
| `--m-primary`           | `light-dark(#00A868, #00D084)`                 | Cor primária responsiva ao tema                 |
| `--m-primary-hover`     | `light-dark(#008050, #00E896)`                 | Hover em botões e links primários               |
| `--m-primary-container` | `light-dark(#E6F8F0, rgba(0, 208, 132, 0.12))` | Fundos translúcidos de itens ativos e badges    |
| `--m-on-primary`        | `light-dark(#FFFFFF, #042618)`                 | Texto sobre o fundo primário                    |
| `--text-accent`         | `light-dark(#008050, #00D084)`                 | Textos de destaque, links e acentos             |

### 2.3 Semânticas de domínio

| Token           | Cor       | Uso                                              |
| :-------------- | :-------- | :----------------------------------------------- |
| `--app-income`  | `#00D084` | Receitas, entradas, saldo positivo (Stone Green) |
| `--app-expense` | `#FF5C5C` | Despesas, faturas (Vermelho Coral técnico)       |
| `--app-pending` | `#E5A800` | Pendentes, faturas abertas                       |
| `--app-overdue` | `#FF5C5C` | Em atraso                                        |

### 2.4 Tipografia

| Token              | Claro     | Escuro    | Uso permitido                                |
| :----------------- | :-------- | :-------- | :------------------------------------------- |
| `--text-primary`   | `#0E1712` | `#F5FAF7` | Títulos, valores tabulares, texto forte      |
| `--text-secondary` | `#5C6861` | `#8E9F96` | Legendas, rótulos de apoio, "Fatura atual"   |
| `--m-text-muted`   | `#6B7A70` | `#5A6B60` | **Só** placeholder, desabilitado, decorativo |

`--m-text-muted` fica em torno de 3:1 e **não** cumpre 4,5:1. Usá-lo em texto que o usuário precisa ler é bug de acessibilidade.

---

## 3. Tokens de forma, espaço e movimento

Fonte: `styles.scss`.

### 3.1 Raio

| Token                | Valor    | Uso                            |
| :------------------- | :------- | :----------------------------- |
| `--m-radius-control` | `10px`   | Inputs, itens de navegação     |
| `--m-radius-card`    | `16px`   | Cards                          |
| `--m-radius-dialog`  | `20px`   | Diálogos e gavetas             |
| `--m-radius-pill`    | `9999px` | Botões, chips, badges, atalhos |

### 3.2 Espaçamento (base 4px)

`--m-space-1` 4px · `-2` 8px · `-3` 12px · `-4` 16px · `-5` 20px · `-6` 24px · `-8` 32px · `-10` 40px.
Padding interno de card: `--m-space-5` (mobile) e `--m-space-6` (≥ 768px). Espaço entre cards: `--m-space-4`.

### 3.3 Tipografia

Família: `Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

| Papel           | Tamanho    | Peso | Onde                                 |
| :-------------- | :--------- | :--- | :----------------------------------- |
| Saldo (display) | `2rem`+    | 700  | Valor do card de saldo               |
| Título de tela  | `1.5rem`   | 700  | Saudação/cabeçalho da página         |
| Seção           | `1.125rem` | 600  | "Histórico recente", títulos de card |
| Corpo           | `0.875rem` | 400  | Texto, linhas de lista               |
| Rótulo          | `0.75rem`  | 500  | Legendas, rótulo de atalho, eyebrow  |

Eyebrow ("RESUMO FINANCEIRO"): `0.75rem`, peso 600, caixa alta, `--m-primary`.
O título de tela é **contextual** ("Boa noite, {nome}"), não genérico.

### 3.4 Sombra e movimento

| Token               | Valor                            | Uso                        |
| :------------------ | :------------------------------- | :------------------------- |
| `--m-shadow-hover`  | `0 4px 16px rgba(0, 0, 0, 0.2)`  | Hover de card clicável     |
| `--m-glow-primary`  | `0 0 24px var(--m-primary-glow)` | Somente card de saldo      |
| `--m-duration-fast` | `150ms`                          | Hover, foco, troca de cor  |
| `--m-duration-base` | `250ms`                          | Expandir/colapsar, entrada |
| `--m-ease`          | `cubic-bezier(0.2, 0, 0, 1)`     | Todas as transições        |

Valores com `rgba()` ficam **dentro do `styles.scss`**, nunca no componente.

Todo movimento (transição, `translateY`, animação de skeleton) fica sob `@media (prefers-reduced-motion: no-preference)` ou é desligado em `reduce`.

---

## 4. Componentes → tokens

| Componente        | Fundo                                            | Borda                                     | Raio                  | Texto/ícone                                  | Hover / foco                                                           |
| :---------------- | :----------------------------------------------- | :---------------------------------------- | :-------------------- | :------------------------------------------- | :--------------------------------------------------------------------- |
| Card              | `--m-surface-card`                               | `1px solid var(--m-border)`               | `--m-radius-card`     | primary / secondary                          | Só se clicável: `-2px` + `--m-surface-card-hover` + `--m-shadow-hover` |
| Card de saldo     | `--m-surface-card`                               | `--m-border`                              | `--m-radius-card`     | valor `--m-text-primary`, rótulo secondary   | `box-shadow: var(--m-glow-primary)` fixo                               |
| Sidebar           | `--m-surface-card`                               | `border-right: 1px solid var(--m-border)` | —                     | secondary; ativo: `--m-text-primary`         | Item ativo: `--m-primary-container` + borda lateral 3px                |
| Item de navegação | transparente                                     | —                                         | `--m-radius-control`  | secondary                                    | Hover: `--m-surface-card-hover`                                        |
| Quick action      | Transparente (desk) / `--m-surface-subtle` (mob) | —                                         | círculo 48px (mob)    | ícone `--m-text-secondary`; rótulo `0.75rem` | Hover: cor `--m-primary` + `translateY(-2px)`                          |
| Botão primário    | `--m-primary`                                    | —                                         | `--m-radius-pill`     | `--m-on-primary`                             | Hover: `--m-primary-hover`                                             |
| Botão secundário  | transparente                                     | `1px solid var(--m-border-strong)`        | `--m-radius-pill`     | `--m-text-primary`                           | Hover: `--m-surface-card-hover`                                        |
| Input (outline)   | transparente                                     | `1px solid var(--m-border-strong)`        | `--m-radius-control`  | primary; placeholder `--m-text-muted`        | Foco: borda `--m-border-focus`                                         |
| Diálogo           | `--m-surface-raised`                             | `--m-border`                              | `--m-radius-dialog`   | primary                                      | —                                                                      |
| Chip/badge        | `--m-surface-subtle` ou `--m-primary-container`  | —                                         | `--m-radius-pill`     | cor semântica + **rótulo textual**           | —                                                                      |
| Item de feed      | transparente                                     | divisória `--m-border`                    | —                     | título primary; data/categoria secondary     | Hover: `--m-surface-card-hover`                                        |
| Skeleton          | `--m-surface-subtle`                             | —                                         | do elemento que imita | —                                            | Shimmer só com motion permitido                                        |

Alvos de toque ≥ 48×48px em qualquer controle.

---

## 5. Padrões de tela (Postura Fintech Stone)

### 5.1 Shell

- **Desktop (≥ 1024px):** sidebar ultra-funcional de `16.5rem` com logo Monetis e badge `STONE`.
- **Item ativo:** pill sutil com texto claro e barra de acento lateral (`background-color: light-dark(rgba(0,168,104,0.08), rgba(0,208,132,0.12)); border-left: 3px solid var(--text-accent); font-weight: 600`).
- **Perfil no topo:** avatar com borda fina verde (`border: 2px solid var(--text-accent)`). Bloco clicável navegando para `/profile` (redireciona para `/accounts`) com rótulo "Minha Conta / Dados bancários".
- **Mobile:** header compacto (avatar com borda verde, saudação, olho de privacidade, tema, logout) + bottom navigation com alvos ≥ 48px e suporte a `env(safe-area-inset-bottom)`.

### 5.2 Dashboard (ordem vertical e densidade)

1. **Header:** Eyebrow `RESUMO FINANCEIRO` + saudação personalizada ("Bom dia/Boa tarde/Boa noite, [Nome]").
2. **Toast de sincronização:** Toast sutil fixo via `ErrorToastComponent` no rodapé (desktop) ou topo (mobile) quando houver falha de rede: "Falha de sincronização", mensagem amigável e botão "Reconectar". Detalhes técnicos ficam exclusivamente no `console.error`.
3. **Card de Saldo:** "Saldo em Conta", display forte em `tabular-nums`, link direto `Extrato completo →` para `/extrato` em `var(--text-accent)`, badge compacto `+ R$ 0,00 este mês` em pill translúcida (`rgba(0,208,132,0.1)`).
4. **Quick actions:** Minimalistas no desktop sem círculo de fundo, ícone com hover em elevação `-2px` e verde Stone (`north_east`, `swap_horiz`, `south_west`, `credit_card`). No mobile, containers circulares de 48px para toque acessível.
5. **Visão geral (Cartão de Crédito e Fluxo do Mês):** Ambos com a mesma altura e proporção.
   - Cartão de Crédito: chip "Crédito", barra ultrafina de 3px (`.limit-track-ultra`) em Verde Stone (`#00D084`) e link direto `Faturas e limites →`.
   - Fluxo do Mês: layout em 2 colunas equilibradas (Receitas em `#00D084`, Despesas em `#FF5C5C`), barra ultrafina proporcional de 3px (`.flow-track-ultra`), e resultado líquido com sinal explícito.
6. **Histórico recente:** Feed de transações com status em pill badges e empty state ilustrado com CTAs.

### 5.3 Cartão de crédito e Fluxo

- Barra de limite: Linha ultrafina de 3px indicando o consumo em `#00D084` e saldo disponível.
- Fluxo: Barra ultrafina proporcional de 3px com receitas (`#00D084`) e despesas (`#FF5C5C`), seguido do resultado líquido.

### 5.4 Feed de transações

- Lista em formato de extrato com bordas sutis.
- Item: avatar circular com ícone da movimentação, título, categoria e data, valor à direita com sinal `+`/`−` e badge de status ("Recebida", "Paga", "Pendente").

### 5.5 Valores monetários e privacidade

| Tipo                                           | Sinal                 | Exemplo         |
| :--------------------------------------------- | :-------------------- | :-------------- |
| Movimentação (receita, despesa, transferência) | **Sempre** `+` ou `−` | `− R$ 450,00`   |
| Saldo e total acumulado                        | Sem sinal             | `R$ 2.000,00`   |
| Resultado líquido, variação, resultado do mês  | **Sempre** `+` ou `−` | `+ R$ 2.000,00` |

- **Privacidade:** quando ativado, todos os valores monetários da tela viram `••••••`. Botão com `aria-label` e `aria-pressed`.

---

## 6. Estados (obrigatório em todo componente com dados)

| Estado   | O que mostrar                                                                                       | Proibido                            |
| :------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------- |
| Loading  | Skeleton com a mesma forma do conteúdo final                                                        | Exibir `R$ 0,00` como placeholder   |
| Vazio    | Ícone (`aria-hidden`) + texto curto + **CTA** no mesmo estilo (ex.: "Registrar primeira transação") | Card em branco                      |
| Erro     | Toast sutil "Falha de sincronização" + botão "Reconectar"; erro técnico no console                  | Mensagem técnica/URL para o usuário |
| Conteúdo | O layout normal                                                                                     | —                                   |

Os specs verificam cada estado pelo DOM (texto, botão, `aria-*`), alinhado ao `AGENTS.md`.

---

## 7. Acessibilidade (WCAG 2.2 AA)

- Contraste: texto normal ≥ 4,5:1; texto grande e controles ≥ 3:1.
- Controles interativos usam `--m-border-strong` (o `--m-border` não basta).
- Foco: `:focus-visible` nunca removido; contorno com `--m-border-focus`.
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
  background: var(--m-surface-card);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-card);
  padding: var(--m-space-5);

  @media (min-width: 768px) {
    padding: var(--m-space-6);
  }
}

.card--clickable {
  transition:
    transform var(--m-duration-fast) var(--m-ease),
    background-color var(--m-duration-fast) var(--m-ease);

  @media (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-2px);
      background: var(--m-surface-card-hover);
      box-shadow: var(--m-shadow-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--m-border-focus);
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
  background: var(--m-primary);
  color: var(--m-on-primary);
  border-radius: var(--m-radius-pill);
  min-height: 48px;
  &:hover {
    background: var(--m-primary-hover);
  }
}

/* errado: branco fixo pode reprovar contraste no escuro */
.btn-primary {
  background: var(--m-primary);
  color: #fff;
  border-radius: 999px;
}
```

---

## 9. Checklist por componente

- [ ] Só tokens (sem cor fixa, sem número solto de raio/sombra/transição).
- [ ] Funciona e foi visto em **claro e escuro**, a **360px e 1280px**.
- [ ] Estados loading, vazio, erro e conteúdo implementados e testados.
- [ ] Contraste conferido; `--m-text-muted` não usado em texto informativo.
- [ ] Foco visível, teclado ok, `aria-label` em botões de ícone, alvos ≥ 48px.
- [ ] Respeita `prefers-reduced-motion`.
- [ ] SCSS < 4kB.
- [ ] Token novo criado? Está no `styles.scss` **e** documentado aqui.

---

## 10. Histórico

- **2.0 (2026-10-07):** Redesign completo Stone Green Fintech (`#00A868`, `#00D084`, `#0A0F0D`). Renomeação e unificação dos tokens `--nu-*` para `--m-*`. Toast global de falha de sincronização substituindo banner técnico, cards com barras ultrafinas de 3px, sidebar com badge `STONE` e bloco de perfil clicável, quick actions minimalistas no desktop.
- **1.0 (2026-10-07):** Reescrita a partir do guia inicial. Correções de contraste, acessibilidade e estados obrigatórios.

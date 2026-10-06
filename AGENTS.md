AGENTS.md — Monetis Web (Angular)

Frontend do Monetis, plataforma de finanças pessoais. Consome a API REST em .NET do repositório monetis.
É um projeto de estudos: ao propor ou realizar qualquer alteração, explique em 1–2 frases o porquê da decisão.

Regra geral: na dúvida, siga a documentação oficial (angular.dev, material.angular.dev, WCAG 2.2 AA) e não invente padrão próprio. Sempre consulte e aplique as skills do projeto em `.agents/skills/` (`angular-developer` e `angular-new-app`).

1. Metodologia de Desenvolvimento: TDD (Test-Driven Development)

Obrigatório seguir o ciclo Red-Green-Refactor rigorosamente:

Red: Escreva primeiro o teste unitário/integração descrevendo o comportamento esperado. O teste deve falhar (ou nem compilar).

Green: Escreva a quantidade mínima de código necessária para fazer o teste passar.

Refactor: Limpe duplicações, melhore nomes e garanta conformidade com as regras sem alterar o comportamento garantido pelo teste.

Por quê: O TDD força o design desacoplado desde o início, evita código não testável ou morto e impede regressões contratuais com a API .NET.

2. Stack

Angular: Versão especificada no package.json (proibido fazer upgrade de major/minor sem solicitação explícita).

TypeScript: Modo strict habilitado (noImplicitAny, strictNullChecks, etc.).

UI: Angular Material (Material Design 3) + SCSS moderno (mixins e @use).

Estado & Reatividade:

Estado local e de tela: Signals (signal, computed).

Integração HTTP/RxJS: use toSignal() (ou httpResource/rxResource caso a versão do Angular seja 19+) em serviços de estado.

Proibido: .subscribe() manual em componentes para popular signals ou variáveis. Se inevitável em casos isolados, use takeUntilDestroyed(inject(DestroyRef)).

PWA: Instalável via @angular/pwa (sem cache de requisições autenticadas por enquanto).

Por quê: Versões e bibliotecas fixas evitam que o agente quebre o build com modernizações acidentais. A ponte declarativa entre HTTP e Signals impede vazamentos de memória e inconsistências de ciclo de vida.

3. Comandos de Validação

Confira os scripts em package.json. O fluxo padrão de trabalho:

ng test — Executa a suíte de testes (TDD: deve rodar antes e depois de cada alteração).

ng build — Build de produção com AOT (service worker do PWA só atua em prod).

ng lint / npm run lint — Validação estática de tipagem e estilo.

ng serve — Servidor de desenvolvimento local.

Critério de Conclusão: Nenhuma tarefa é dada como finalizada sem que ng test, ng lint e ng build passem sem erros nem warnings.

4. Regras de Código Angular

Componentes: Apenas standalone. Proibido criar NgModule.

Change Detection: changeDetection: ChangeDetectionStrategy.OnPush obrigatório em todo componente.

Control Flow: Nova sintaxe nativa @if, @for (sempre com expressão no track), @switch. Proibido *ngIf, *ngFor e *ngSwitch.

Injeção de Dependência: Utilize exclusivamente inject() no corpo da classe (evite construtores com injeção).

Entrada/Saída reativa: Use input(), output(), computed() e effect() (use effect apenas para logging/sincronização externa, nunca para alterar estado). Proibido @Input, @Output e getters como reatividade.

Formulários: Reactive Forms estritamente tipados (FormGroup, FormControl com { nonNullable: true }).

Roteamento: Lazy loading obrigatório em todas as rotas (loadComponent ou loadChildren).

Tipagem Estrita: Sem any. Se o dado for desconhecido, use unknown e faça narrowing explícito.

Host bindings: Use o bloco host: { ... } do decorator @Component. Proibido @HostBinding e @HostListener.

Classes/Estilos: Prefira [class.nome-classe]="condicao" a ngClass/ngStyle.

Convenção de Idioma: Código (nomes de variáveis, funções, classes, arquivos, commits) em inglês. Textos da interface do usuário em português (pt-BR).

Nomenclatura: Siga o padrão do ng generate da versão instalada (ex.: feature-name.component.ts).

Por quê: O conjunto de Signals + OnPush garante renderizações cirúrgicas e previsíveis em dispositivos móveis, eliminando o overhead de change detection global da Zone.js.

5. Estrutura de Pastas e Dependências

src/app/
  core/        # Singletons da app: auth, guards, interceptors funcionais, theme, API base config
  shared/      # Utilitários sem regra de negócio: pipes, UI components puros, diretivas, enums/formatters comuns
  features/
    auth/
    accounts/
    cards/
    categories/
    expenses/
    incomes/
    subscriptions/
    transfers/
    dashboard/


Regras de Dependência:

features/* podem importar de core/ e shared/.

features/* não podem importar diretamente de outra feature. Se duas features precisam compartilhar dados ou lógica de estado, promova o contrato ou serviço para core/ (se for estado global de sessão/saldo) ou shared/ (se for UI/modelo).

shared/ não importa de core/ nem de features/.

Cada feature deve conter suas próprias pastas: /models, /services (*-api.service.ts e *-state.service.ts), /components e routes.ts.

Por quê: Aplica a regra de dependência unidirecional da Clean Architecture, evitando acoplamento cíclico e garantindo que cada feature possa ser deletada ou refatorada de forma isolada.

6. Mobile First e Acessibilidade (WCAG 2.2 AA)

Mobile First: Escreva o SCSS base para telas móveis (~360px) e aplique @media (min-width: ...) para expandir. Nunca use max-width.

Breakpoints do Material: Use o BreakpointObserver do CDK no TS quando a hierarquia do DOM precisar mudar entre mobile e desktop.

Navegação Adaptativa: Bottom navigation bar em mobile; gaveta lateral (mat-sidenav) em tablet e desktop.

Touch Targets: Alvos clicáveis com dimensão mínima de 48×48px (recomendação Material 3; o mínimo do WCAG 2.2 AA é 24×24px).

Unidades: Layout fluido (rem, %, clamp()). Proibido larguras fixas em px para contêineres e páginas.

Safe Area: Respeite env(safe-area-inset-*) em barras de navegação fixas (top/bottom).

Tabelas de Dados: Em telas < 768px, transforme mat-table em lista de cartões empilhados (cards). Evite rolagem horizontal como padrão.

Acessibilidade:

Imagens e ícones decorativos: aria-hidden="true".

Botões que contêm apenas ícone: obrigatório aria-label descritivo em pt-BR.

Contraste mínimo de 4.5:1 para texto e 3:1 para controles interativos.

Nunca retire :focus-visible ou outline de foco. Respeite prefers-reduced-motion.

Por quê: Aplicativos financeiros são consumidos majoritariamente no celular. O design mobile-first garante priorização visual e usabilidade tátil.

7. Design System, Cores e Tema (Material 3)

Semente da Marca: Violeta escuro (estilo Nubank, aprox. #820AD1). Use o schematic @angular/material:theme-color para gerar paletas Material 3 consistentes.

Cores Semânticas de Domínio: Definidas globalmente em styles.scss (nunca duplicadas em componentes):

:root {
  --app-income: light-dark(#1b6e3c, #7ddb9a);  /* Receita */
  --app-expense: light-dark(#ba1a1a, #ffb4ab); /* Despesa */
}


Alternância de Tema Claro/Escuro:

Controlada exclusivamente por um ThemeService em core/services/theme.service.ts.

Sincronize tanto a classe .dark / .light no elemento raiz quanto document.documentElement.style.colorScheme.

Inicialização: leia o valor salvo no localStorage; se ausente, adote window.matchMedia('(prefers-color-scheme: dark)').matches.

Regras de Estilização:

Proibido cores fixas (#hex, rgb) nos arquivos SCSS de componentes. Utilize variáveis de sistema var(--mat-sys-*) ou var(--app-*).

Proibido !important ou ::ng-deep para sobrescrever componentes do Angular Material. Use os design tokens e mixins da biblioteca.

WCAG 1.4.1: Nunca diferencie receita e despesa apenas por cor. Sempre inclua o sinal visual (+ ou −), rótulo de texto ou ícone semântico.

Por quê: O desacoplamento por design tokens previne telas quebradas no dark mode e centraliza mudanças visuais de marca em um único ponto.

8. Integração com a API (.NET)

Configuração de Ambiente: A URL base da API vem de environment.ts (apiUrl: 'http://localhost:5074'), nunca hardcoded.

Divisão de Responsabilidades:

*-api.service.ts: Fino, executa apenas requisições HTTP via HttpClient e tipagem de entrada/saída (DTOs).

*-state.service.ts: Gerencia signals, conversão de DTOs para modelos de tela e orquestração de chamadas.

Mapeamento de DTOs e Tipagem:

DTOs vs. View Models: Mantenha os DTOs crus da API (ex.: AccountResponseDto, CreateExpenseRequestDto) separados das entidades de exibição da UI se houver transformação necessária.

Enums Numéricos: A API .NET retorna enums como inteiros (0, 1, 2). Declare dicionários constantes ou TypeScript enums espelhados em shared/models/ com os respectivos labels em pt-BR para exibição.

Tratamento de Moeda: Valores decimais chegam como number. O front-end apenas exibe formatado com CurrencyPipe (locale: 'pt-BR', moeda 'BRL'). Não realize cálculos financeiros no cliente (soma de saldos, estornos); a fonte da verdade é a API.

Tratamento de Datas: A API trafega datas em ISO 8601 UTC. Converta para fuso horário local exclusivamente no momento da exibição (ex.: DatePipe).

Normalização de Erros: O interceptor HTTP funcional deve capturar erros de validação (tanto strings de BadRequest("msg") quanto objetos { statusCode, message, errorCode }) e normalizá-los em uma interface única ApiError.

Por quê: Cálculos em ponto flutuante no JavaScript geram dízimas e inconsistências com o tipo decimal do C#. Separar a camada de API do estado viabiliza mock e testes unitários independentes.

9. Autenticação e Segurança

Autenticação: Baseada em JWT via header Authorization: Bearer <token> através de um HttpInterceptorFn em core/interceptors/auth.interceptor.ts.

AuthService: Singleton em core/services/auth.service.ts expondo signals (ex.: isAuthenticated = computed(...), currentUser = signal(...)).

Armazenamento: O token fica encapsulado no AuthService. Componentes nunca acessam localStorage diretamente.

Guards e Redirecionamento: Use CanActivateFn. Respostas HTTP 401 Unauthorized tratadas no interceptor disparam o logout e navegam para /auth/login.

Higienização: Proibido uso de [innerHTML] com dados originados da API. Se for estritamente necessário, passe pelo DomSanitizer do Angular sem chamadas a métodos bypassSecurityTrust*.

Logs: Proibido usar console.log para imprimir tokens, senhas, CPF ou dados bancários do usuário.

Por quê: O isolamento do armazenamento no AuthService prepara a aplicação para futura substituição por cookies HttpOnly sem impacto nos componentes.

10. Diretrizes de Testes e TDD

Ordem de Execução: Para qualquer nova funcionalidade, bugfix ou alteração de contrato:

Criar o arquivo *.spec.ts com o cenário de teste cobrindo o caso feliz e casos de borda (ex.: erro 400 da API, saldo negativo).

Rodar ng test e verificar que o teste falhou pelo motivo correto.

Implementar o código mínimo no serviço ou componente.

Garantir que os testes passaram.

Refatorar se necessário.

Foco dos Testes de UI: Valide a interação do usuário e saídas observáveis no DOM (botão habilitado/desabilitado, mensagem de erro exibida), não os detalhes internos de implementação privada do componente.

Mocks: Testes de serviços de API devem usar HttpTestingController (ou provideHttpClientTesting()). Serviços de tela devem receber mocks dos serviços de API via TestBed.overrideProvider.

Por quê: Testes focados em comportamento resistem a refatorações estruturais e protegem o usuário final contra regressões visíveis.

11. Padrão de Commits (Conventional Commits)

Todo commit deve seguir rigorosamente a especificação Conventional Commits com mensagens exclusivamente em inglês:

Formato:
`<tipo>(<escopo opcional>): <descrição curta no imperativo>`

Tipos permitidos:
- `feat`: Nova funcionalidade para o usuário.
- `fix`: Correção de bug.
- `test`: Adição, ajuste ou refatoração de testes (etapa Red/Green do ciclo TDD).
- `refactor`: Refatoração de código sem alteração de comportamento externo (etapa Refactor do TDD).
- `style`: Formatação, linting ou ajustes visuais de CSS sem impacto na lógica.
- `docs`: Alterações puramente em documentação (ex.: README.md, AGENTS.md).
- `chore`: Atualizações de build, tarefas de configuração de ferramentas ou repositório.
- `perf`: Melhoria mensurável de desempenho.

Regras e Boas Práticas:
- Mensagem exclusivamente em inglês e no imperativo (ex.: `feat(auth): implement jwt interceptor`, não `feat(auth): adicionado interceptor`).
- Início em letra minúscula e sem ponto final na linha de cabeçalho.
- Escopos recomendados mapeiam as camadas ou features do projeto: `auth`, `accounts`, `cards`, `categories`, `expenses`, `incomes`, `dashboard`, `core`, `shared`.
- No fluxo TDD, encoraja-se isolar commits de testes e implementação quando aplicável (ex.: `test(accounts): add balance calculation spec` seguido de `feat(accounts): implement balance calculation`).

Por quê: Conventional Commits estruturam semanticamente o histórico do projeto, facilitam a revisão de código durante o TDD, viabilizam geração automatizada de changelogs e garantem conformidade com padrões globais de engenharia de software.

12. Definição de Pronto (Definition of Done)

Uma tarefa só pode ser considerada pronta se todos os itens abaixo forem atendidos:

[ ] Ciclo TDD seguido (testes criados antes da implementação).

[ ] ng test passando 100% dos testes sem falhas.

[ ] ng lint e ng build sem erros ou alertas de tipagem.

[ ] Sem any, sem NgModule, sem diretivas legadas (*ngIf, *ngFor).

[ ] Nenhum .subscribe() manual em componentes ou sem cleanup configurado.

[ ] Nenhuma cor fixa ou ::ng-deep nos arquivos SCSS.

[ ] Validado visualmente e funcionalmente em resoluções mobile (360px) e desktop (1280px).

[ ] Validado nos temas Claro e Escuro.

[ ] Navegabilidade total por teclado e labels de acessibilidade conferidos.

[ ] Commits seguindo estritamente a especificação Conventional Commits em inglês.

13. O que Nunca Fazer Sem Pedir

Atualizar dependências: Não altere versões no package.json nem adicione bibliotecas externas sem autorização expressa.

Alterar configurações do projeto: Não edite angular.json, tsconfig*.json ou configurações de build sem justificar previamente a necessidade técnica.

Contornar o Backend: Nunca tente replicar no cliente regras de negócio pertencentes à API .NET. Se faltar um endpoint ou campo, registre como impedimento e descreva o ajuste necessário no contrato.

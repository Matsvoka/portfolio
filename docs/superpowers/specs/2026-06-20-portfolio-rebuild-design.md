# Portfolio Rebuild — Design

> Status: **design completo, aguardando revisão final do usuário antes de virar plano de implementação.**

## 0. Contexto e referências

- **PRODUCT.md / DESIGN.md** (raiz do repo) — fonte de verdade para tom, princípios, paleta lime e regras de uso.
- **Referência estrutural**: [marcoditoro.com.br/pt](https://www.marcoditoro.com.br/pt) — fluxo About/Experience/Projects/Skills/Education, escaneável. Hero centralizado com foto, nome, subtítulo, email e ícones de contato (GitHub/LinkedIn) abaixo, sem CTA. **Não copiar o visual**, só a estrutura.
- **Referência de stack**: [github.com/Frombull/site-feliz](https://github.com/Frombull/site-feliz) — Next.js 15 (App Router) + TypeScript + Tailwind v4 + lucide-react. Página em grid 2 colunas. **Borrow stack, not visual restraint.**
- Repo: criado do zero nesta sessão.

## 1. Decisões fechadas

| Tópico | Decisão |
|---|---|
| Conteúdo (CV, experiências, projetos reais) | Placeholder por agora. |
| Ferramenta interativa embutida | Mocks leves do zero (Doctag, GraphIt, HCP App), uma interação-chave cada, dados fictícios. Não embutir/iframe código real. |
| Idiomas | Só PT-BR por agora. Sem next-intl. Header já reserva espaço pra um seletor de idioma (placeholder visual "PT-BR ⌄", sem lógica). |
| CTAs de contato | Email + LinkedIn + GitHub (ícones), visíveis no **Hero e no Footer** (decisão revisada — não ficam no header) + Download de CV em PDF (no footer). Sem formulário de contato. |
| Arquitetura de navegação | Shell único de scroll (`/`) + páginas próprias por projeto (`/projetos/[slug]`). |
| Tema padrão | **Escuro**, com toggle persistido (localStorage). |
| Tipografia | **Geist Sans** (display/corpo, via `next/font`, pesos 100–900) + **JetBrains Mono** (metadados: datas, tags, labels). |

## 2. Stack & arquitetura — ✅ aprovado

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.** Sem next-intl. Deploy: Vercel.
- **Rotas:**
  - `/` — scroll único: Header fixo → Hero/Sobre → Experiência → [Projetos | Skills+Formação] → Footer/Contato.
  - `/projetos/[slug]` — case study completa de cada projeto.
  - Sem rota de índice `/projetos` separada.

## 3. Modelo de conteúdo — ✅ aprovado

```ts
type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  tags: string[];            // stack -> badges com ícone
  role: string;
  narrative: string[];       // parágrafos da case study
  demoIndex: number;         // depois de quantos parágrafos de `narrative` o demo aparece (0 = logo após o cabeçalho)
  demo:
    | { type: 'mock'; component: string }   // chave no registry de src/components/project-mocks/
    | { type: 'video'; src: string }
    | { type: 'gif'; src: string }
    | { type: 'none' };
  links?: { github?: string; live?: string };
};

type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  logo?: string;
  projectSlugs?: string[];   // liga Experience aos Projects relacionados
};
```

- **Projeto "pessoal" vs "ligado a experiência"** é **derivado**, não é um campo: um `Project` é pessoal se seu `slug` não aparece em nenhum `ExperienceEntry.projectSlugs`. Projetos pessoais aparecem direto na seção Projetos da home; projetos ligados a um emprego aparecem só como chip clicável dentro daquela entrada de Experiência (ver seção 5.3).
- `Skills`: lista tipada (categoria + itens, cada item com nome + ícone).
- `Education`: lista tipada (grau + instituição + período).
- Fora de escopo: certificados, idiomas, QR code (YAGNI).

## 4. Componente compartilhado: `ProjectPreviewCard`

Usado em dois contextos com o mesmo conteúdo (título+seta, preview de mídia, descrição, tecnologias):

- **`variant="popover"`**: acionado pelo chip de projeto dentro de uma entrada de Experiência.
- **`variant="inline"`**: renderizado direto na seção Projetos da home (projetos pessoais), sem necessidade de clique/hover.

Estrutura interna (linhas, nessa ordem): Título + seta (canto) → preview (imagem/vídeo/gif, placeholder neutro) → descrição → tecnologias (ícone + nome, separadas por "·", com "+N" se não couber tudo numa linha). **O card inteiro é clicável**, leva para `/projetos/[slug]`.

No `variant="popover"`: comportamento de tooltip customizado — hover exibe, clique persiste (dispensável via clique fora ou tecla Esc, garantindo caminho 100% por teclado). Sem outline no card (só uma sombra única via `filter: drop-shadow` no wrapper, cobrindo o contorno combinado de card+tail). O tail é um quadrado de 16px rotacionado 45°, mesma cor de fundo do card, parcialmente escondido atrás dele (z-index negativo). Direção de expansão (cima/baixo) é **responsiva**: escolhe o lado que cabe por completo na viewport. No hover do card já persistido, a seta muda de cinza para Lime Deep.

## 5. Home — design por seção

### 5.1 Header/Nav fixo
Logo/iniciais à esquerda. Anchor nav (Sobre/Experiência/Projetos/Skills/Formação) com underline lime no item ativo. À direita: toggle de tema, seguido do seletor de idioma (placeholder "PT-BR ⌄", sem lógica de i18n). **Sem ícones de contato** (ficam só no Hero e Footer). Mobile: nav colapsa num menu.

### 5.2 Hero/Sobre
Centralizado (inspirado no marcoditoro, mas sem CTA): foto redonda (placeholder, ~200px) com anel lime, nome em Geist Sans peso 900/tracking apertado, subtítulo de cargo (mono, uppercase), ícones de contato (email/GitHub/LinkedIn) abaixo. Sem email em texto, sem botões de CTA — a nav e o scroll guiam o resto.

### 5.3 Experiência
Timeline vertical: linha e dots em cinza (`Bone Muted`) para entradas passadas; dot lime com leve glow só na entrada atual. Cada entrada é um grupo [logo da empresa (acompanha a altura do bloco de texto) + cargo (maior peso/tamanho, Lime Deep se for a entrada atual) + nome da empresa (peso médio, neutro) + data (mono, neutro)], com gap maior entre cargo/nome e menor entre nome/data. Acima da entrada, se houver `projectSlugs`, label "Projetos" (mono, discreto) + chips clicáveis (hover/press) que abrem o `ProjectPreviewCard` (`variant="popover"`).

### 5.4 Projetos (home) + Skills + Formação — grid de 2 colunas
A partir da seção Projetos, a página vira um grid de 2 colunas (colapsa para 1 coluna em mobile):
- **Coluna principal (larga)**: seção Projetos — só projetos pessoais (ver derivação na seção 3), cada um renderizado como `ProjectPreviewCard` (`variant="inline"`), empilhados.
- **Coluna lateral (estreita)**: Skills (categoria + chips com ícone, sem grid de ícones repetitivo) e, abaixo, Formação (grau em destaque, instituição abaixo, data abaixo da instituição).

Skills e Formação continuam como anchors próprios do header nav (`#skills`, `#formacao`) mesmo estando visualmente agrupados na coluna lateral ao lado de Projetos — o anchor aponta para o sub-bloco dentro do grid, não para uma seção full-width separada.

### 5.5 Footer/Contato
Centralizado (rima com o Hero): CTA de download de CV (botão lime fill) → ícones de contato (email/GitHub/LinkedIn) → copyright em mono. Herda o tema ativo.

## 6. Página de projeto (`/projetos/[slug]`) + mock-widgets

- **Template**: cabeçalho (título, tags, links de GitHub/live) → narrativa intercalada com o slot de demo na posição indicada por `demoIndex` (0 = demo logo após o cabeçalho; N = depois do N-ésimo parágrafo). Permite que cada projeto decida se o demo precisa de contexto prévio ou não.
- **Slot de demo**: renderiza `mock` (componente React lazy-loaded), `video`, `gif` ou nada, conforme `Project.demo`.
- **Convenção de pastas**: `src/components/project-mocks/<slug>/index.tsx` — um componente por projeto (`doctag/`, `graphit/`, `hcp/`), resolvido via registry pela chave `demo.component`.
- **Lazy-loading**: `next/dynamic` com `ssr: false` + skeleton de loading, para não pesar o bundle de páginas que não usam aquele mock.
- **Acessibilidade dos mocks**: caminho 100% via teclado para a interação-chave de cada mock (ex: mover uma tag também funciona com setas+enter, não só drag-and-drop) + suporte a `prefers-reduced-motion`.

## 7. Tema, tipografia, motion, não-funcionais

- **Tema**: claro/escuro via CSS variables (tokens do DESIGN.md), toggle persistido em localStorage, **padrão escuro**.
- **Tipografia**: Geist Sans (display/corpo) + JetBrains Mono (metadados/labels/datas/tags), via `next/font`.
- **Motion**: responsivo (feedback real em hover/focus/press/drag), nunca coreografado — sem scroll-reveal ou orquestração de entrada. `prefers-reduced-motion` suportado em toda transição (inclusive nos mock-widgets).
- **Não-funcionais**: lazy-load dos mocks (seção 6); `next/image` para logos de empresa e screenshots/previews; WCAG AA (contraste, navegação por teclado completa); deploy Vercel.

## 8. Próximos passos

1. ~~Brainstorming das seções 4.1–4.3~~ — concluído.
2. Self-review do spec (placeholders, contradições, ambiguidade, escopo).
3. Usuário revisa o spec final escrito.
4. Invocar a skill `superpowers:writing-plans` para o plano de implementação.

# Portfolio Rebuild — Design (em progresso)

> Status: **brainstorming em andamento**. Este arquivo é o estado da sessão de design — decisões já fechadas + o que falta cobrir. Ao retomar, releia PRODUCT.md e DESIGN.md, depois continue a partir de "Próximos passos" no final deste arquivo, seção "## 5. Home — design por seção" em diante.

## 0. Contexto e referências

- **PRODUCT.md / DESIGN.md** (raiz do repo) — fonte de verdade para tom, princípios, paleta lime e regras de uso. Releia antes de qualquer decisão de design ou conteúdo.
- **Referência estrutural**: [marcoditoro.com.br/pt](https://www.marcoditoro.com.br/pt) — fluxo About/Experience/Projects/Skills/Education, escaneável, lista de projetos com logo+descrição, ícones de contato, CV em PDF. Visual minimalista — **não copiar o visual**, só a estrutura.
- **Referência de stack**: [github.com/Frombull/site-feliz](https://github.com/Frombull/site-feliz) — Next.js 15 (App Router) + TypeScript + Tailwind v4 + next-intl + lucide-react + animejs. Página única em grid 2 colunas. **Borrow stack, not visual restraint** (PRODUCT.md) — e **não** usar animejs/scroll-reveal/orquestração de entrada (proibido por DESIGN.md: "Don't add heavy or gimmicky animation").
- Repo deste projeto: estava vazio (só CLAUDE.md/PRODUCT.md/DESIGN.md) no início desta sessão — projeto a ser criado do zero.

## 1. Decisões já fechadas (respostas do usuário)

| Tópico | Decisão |
|---|---|
| Conteúdo (CV, experiências, projetos reais) | **Placeholder por agora** — conteúdo real entra depois, fora desta sessão. Estruturar com placeholders claramente marcados. |
| Ferramenta interativa embutida | Não é uma única tool — são **mocks de pequenas funções** de projetos reais do usuário: **Doctag** (app desktop de tagging de documentos, Electron+React+Postgres embutido), **GraphIt** (ferramenta de grafos/visualização, migrando de HTML vanilla pra React/Vite), **HCP App** (sistema de produção, FastAPI+React). Alguns projetos terão mock interativo, outros só vídeo/gif. |
| Natureza do mock | **Recriações leves do zero** — componentes React simples, isolados, com dados fictícios, ilustrando **uma interação-chave** de cada projeto (ex: arrastar uma tag no Doctag, desenhar um nó no GraphIt). **Não** embutir/iframe código real dos apps. |
| Idiomas | **Só PT-BR por agora.** Sem next-intl nesta fase; nada impede adicionar i18n depois, mas não faz parte do escopo atual. |
| CTAs de contato | **Email + LinkedIn + GitHub** (ícones, sempre visíveis) **+ Download de CV em PDF**. Sem formulário de contato. |
| Arquitetura de navegação | **Aprovada: Approach A** — shell único de scroll (`/`) escaneável em ~30s + páginas próprias por projeto (`/projetos/[slug]`) com a case study completa. Rejeitadas: expansão inline sem rota própria (conflita com exigência de página própria por projeto do PRODUCT.md) e site multi-página tradicional (mata o "scan em 30s"). |

## 2. Stack & arquitetura — ✅ aprovado

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.** Sem next-intl (PT-BR único). Deploy alvo: Vercel.
- **Rotas:**
  - `/` — scroll único: Hero/Sobre → Experiência → Projetos → Skills → Formação → Footer/Contato.
  - `/projetos/[slug]` — case study completa de cada projeto (narrativa, stack, papel, mock ou vídeo/gif, links).
  - Sem rota de índice `/projetos` separada (a seção da home já lista todos — YAGNI).

## 3. Modelo de conteúdo — ✅ aprovado

Arquivos TS tipados em `src/content/` (sem CMS), fonte única consumida tanto pela home quanto pela página de projeto.

```ts
type Project = {
  slug: string;
  title: string;
  oneLiner: string;          // lista compacta da home
  tags: string[];            // stack/skills -> badges
  role: string;
  narrative: string[];       // parágrafos da case study
  demo:
    | { type: 'mock'; component: string }   // chave do widget React
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
  projectSlugs?: string[];   // liga Experience aos Projects relacionados
};
```

- `Skills`: lista tipada simples (categoria + itens).
- `Education`: lista tipada simples (grau + instituição + período).
- **Fora de escopo** (não pedido no PRODUCT.md): certificados, idiomas, QR code — presentes no site-feliz mas não entram aqui (YAGNI).

## 4. Pendente — próximas seções do design a apresentar

Ainda não apresentadas/aprovadas nesta sessão. Retomar a skill `superpowers:brainstorming` (etapa "Presentar design sections") e cobrir, uma a uma, com aprovação do usuário a cada bloco:

### 4.1 Home — design por seção
- Header/nav fixo: anchor nav (Sobre/Experiência/Projetos/Skills/Formação) + toggle de tema + ícones de contato (email/LinkedIn/GitHub) — inspirado na nav do marcoditoro.com.br, mas com identidade lime.
- Hero/Sobre: como evitar o anti-padrão "hero genérico com gradiente blob" (PRODUCT.md anti-reference) — propor layout alternativo.
- Experiência: cada entrada pode listar chips/links de `projectSlugs` relacionados.
- Projetos: lista compacta na home (título + oneLiner + tags + link) — **sem** mock pesado aqui, isso fica só na página própria.
- Skills, Formação: estrutura simples, sem grid de ícones repetitivo (anti-referência: "identical icon-card grids").
- Footer/Contato: CTA de download de CV + ícones de contato.

### 4.2 Página de projeto (`/projetos/[slug]`) + sistema de mock-widgets
- Template da case study: cabeçalho (título, tags, links), narrativa, slot de demo.
- Slot de demo: renderiza `mock` (componente React lazy-loaded), `video`, `gif` ou nada, conforme o campo `demo` do Project.
- Convenção de pastas/nomes pros componentes de mock (um por projeto: Doctag, GraphIt, HCP).
- Lazy-loading dos mocks (evitar custo de bundle na home).
- Acessibilidade dos mocks (teclado, prefers-reduced-motion) — requisito do PRODUCT.md (WCAG AA).

### 4.3 Tema, tipografia, motion, não-funcionais
- Tema claro/escuro: implementação via CSS variables (tokens já definidos em DESIGN.md) + toggle persistido (localStorage), tema padrão a decidir (sugestão: dark, a confirmar com usuário).
- Tipografia: DESIGN.md sugere Space Grotesk / Geist Sans / IBM Plex Sans (display) + JetBrains Mono / IBM Plex Mono (metadata) — escolher e confirmar.
- Motion: responsivo, nunca coreografado (nada de scroll-reveal/orquestração tipo site-feliz); suporte a `prefers-reduced-motion` em toda transição.
- Não-funcionais: performance (lazy-load de mocks, `next/image` pra logos/screenshots), WCAG AA, deploy Vercel.

## 5. Próximos passos

1. Retomar brainstorming a partir da seção 4.1 (Home — design por seção), uma seção por vez, com aprovação do usuário.
2. Seguir para 4.2 e 4.3.
3. Self-review do spec (placeholders, contradições, ambiguidade, escopo).
4. Usuário revisa o spec final escrito.
5. Invocar a skill `superpowers:writing-plans` para o plano de implementação.

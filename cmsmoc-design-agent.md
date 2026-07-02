# CMSMOC Design System Agent v5.0
**Conselho Municipal de Saúde de Montes Claros — Manual de Agente**

> Este documento é o manual de raciocínio para agentes de IA (Claude Code, Codex, Cursor, etc.) que geram artefatos HTML/CSS para o CMSMOC. Leia-o integralmente antes de escrever qualquer linha de código. Os valores atômicos estão em `cmsmoc-tokens.json` — nunca hardcode cores ou URLs de logo sem consultar o JSON.

---

## 1. IDENTIDADE E PRINCÍPIOS

O CMSMOC é o órgão de controle social da saúde pública em Montes Claros, MG. Seus documentos comunicam autoridade institucional, transparência democrática e rigor técnico a dois públicos simultaneamente:
- **Técnico-jurídico**: conselheiros, gestores, Ministério da Saúde.
- **Popular**: cidadãos, usuários do SUS, participantes de conferências.

**Princípios inegociáveis de design:**
1. **Autoridade sem arrogância** — navy escuro + hierarquia tipográfica clara = credibilidade. Não usar fontes decorativas fora do sistema.
2. **Acessibilidade visual como norma** — contraste mínimo AA. Nunca texto amarelo em fundo branco. Nunca texto cinza claro em fundo colorido.
3. **Consistência acima de criatividade** — Montserrat + Open Sans são a voz institucional. Não substituir.
4. **Stripe tricolor é identidade** — amarelo / verde / azul no topo, sempre, em todos os documentos institucionais impressos ou digitais.
5. **Print-first quando aplicável** — documentos de reunião devem renderizar perfeitamente em A4 sem intervenção manual.

---

## 2. QUANDO USAR CADA TIPO DE DOCUMENTO

### 2.1 Ata Ordinária / Extraordinária
- **Propósito**: registro legal de reunião plenária do Conselho.
- **Layout**: scroll vertical contínuo, cabeçalho escuro (navy), seções com `page-break-inside: avoid`.
- **Componentes obrigatórios**: stripe tricolor, cabeçalho duplo (logo sec-exec + logo CMS), tabela info (data/hora/local/quórum), seção de falas por pauta, lista de encaminhamentos, rodapé com assinatura.
- **Print**: `@media print { @page { size: A4; margin: 18mm 15mm; } }` — NUNCA margem < 10mm.
- **Fonte conf**: NÃO. Usar Montserrat + Open Sans.

### 2.2 Resumo Executivo / Relatório de Diagnóstico
- **Propósito**: síntese estratégica para gestores e plenário.
- **Layout**: pode ter sidebar de navegação sticky se > 4 seções. Cabeçalho escuro.
- **Componentes**: stripe, cabeçalho, cards de métricas (KPI cards), gráficos inline (se houver), tabelas comparativas, seção de recomendações com badges de prioridade.
- **Diferencial**: uso de badges semânticos (success/warning/danger) para status de indicadores.

### 2.3 Nota Técnica / Parecer
- **Propósito**: documento formal com argumentação jurídico-técnica.
- **Layout**: fundo claro (off-white), logo preto, sem sidebar, texto corrido com hierarquia de títulos.
- **Componentes**: header light (logo black em fundo off-white), numeração de seções em eyebrow, citações legais em blockquote estilizado, rodapé com dados de identificação.
- **Print**: crítico. Verificar `background-color` em `@media print` — usar `-webkit-print-color-adjust: exact` para faixas coloridas.

### 2.4 Pré-Conferência / Conferência de Saúde
- **Propósito**: ata ou relatório de etapa pré-conferência / conferência municipal.
- **Fonte**: Georama obrigatória (identidade 11ª CMS).
- **Paleta estendida**: blue_sus (#1A5EA8), green_cms (#3AAA35), yellow_cms (#F5C800).
- **Stripe**: variante conferência (4 faixas).
- **Layout específico**: propostas em grid 2 colunas, delegados em cards por segmento (usuário / trabalhador / gestor).

### 2.5 Dashboard / App Interno (SerTão Conselheiro, AutoDoc)
- **Layout**: sidebar fixa + área de conteúdo com `height: 100vh; overflow: hidden` NO WRAPPER (não no body).
- **Body**: NUNCA `overflow: hidden` direto no body — quebrará scroll em documentos abertos no mesmo contexto.
- **Componentes**: nav lateral, topbar com usuário logado, cards de módulos, tabelas com paginação.
- **Responsividade**: sidebar colapsa em `< 768px` para hamburguer.

### 2.6 PWA / App Mobile-First (SerTão Conselheiro mobile, Dani Doces)
- **Layout**: `max-width: 430px; margin: auto` com bottom nav.
- **Touch targets**: mínimo 44px de altura.
- **Sem sidebar** — usar bottom nav ou tabs.

### 2.7 Portaria / Instrução Normativa
- **Layout**: fundo branco puro, logo preto, margens generosas (≥ 25mm no print).
- **Tipografia**: hierarquia formal (PORTARIA Nº XX/XXXX em caps, sans-serif weight 900).
- **Sem gradientes** — documento formal jurídico pede sobriedade.
- **Rodapé**: local, data, nome, cargo e assinatura em posição fixa no final.

---

## 3. COMPONENTES — CATÁLOGO COMPLETO

### 3.1 Stripe Tricolor (OBRIGATÓRIO)
```html
<div class="cms-stripe"></div>
```
```css
.cms-stripe {
  height: 5px;
  background: linear-gradient(to right, #F5C400 33.3%, #1E8A4A 33.3% 66.6%, #1B6CB5 66.6%);
}
```
**Regra**: primeiro elemento após `<body>`. Presente em todos os documentos exceto PWA mobile e apps de tela cheia.

---

### 3.2 Cabeçalho Escuro (Dark Header)
```html
<header class="doc-header">
  <div class="header-inner">
    <div class="header-logos">
      <img src="[sec_exec_white]" alt="Secretaria Executiva" style="height:60px;object-fit:contain;">
      <img src="[cms_white]" alt="CMS Montes Claros" style="height:60px;object-fit:contain;">
    </div>
    <p class="header-eyebrow">ATA · 267ª REUNIÃO ORDINÁRIA</p>
    <h1 class="header-title">Título do <em>Documento</em></h1>
    <p class="header-sub">Subtítulo ou metadado complementar</p>
  </div>
</header>
```
```css
.doc-header { background: #0D2E5A; color: white; padding: 60px 48px 48px; position: relative; overflow: hidden; }
.doc-header::before { content:''; position:absolute; right:-50px; top:-50px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, rgba(245,196,0,.15) 0%, transparent 65%); pointer-events:none; }
.header-inner { max-width: 960px; margin: 0 auto; }
.header-logos { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,.15); padding-bottom:20px; margin-bottom:24px; }
.header-eyebrow { font-family: var(--font-d); font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#F5C400; margin-bottom:10px; }
.header-title { font-family:var(--font-d); font-size:clamp(28px,4vw,44px); font-weight:900; letter-spacing:-1.5px; line-height:1.05; margin-bottom:10px; }
.header-title em { color:#F5C400; font-style:normal; }
.header-sub { font-size:14px; color:rgba(255,255,255,.6); font-weight:300; }
```

---

### 3.3 Cabeçalho Claro (Light Header)
Para notas técnicas e portarias:
```html
<header class="doc-header-light">
  <div class="header-inner">
    <div class="header-logos-light">
      <img src="[sec_exec_black]" alt="Secretaria Executiva" style="height:55px;object-fit:contain;">
      <img src="[cms_black]" alt="CMS Montes Claros" style="height:55px;object-fit:contain;">
    </div>
    <h1 class="header-title-light">NOTA TÉCNICA Nº 01/2026</h1>
  </div>
</header>
```
```css
.doc-header-light { background: #F7F8FA; border-bottom: 3px solid #1B6CB5; padding: 32px 48px; }
.header-logos-light { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.header-title-light { font-family:var(--font-d); font-size:clamp(18px,3vw,28px); font-weight:900; color:#0D2E5A; letter-spacing:-1px; }
```

---

### 3.4 Tabela de Informações (info-table)
```html
<table class="info-table">
  <tr><td>Reunião</td><td>267ª Reunião Ordinária</td></tr>
  <tr><td>Data</td><td>18 de junho de 2026</td></tr>
  <tr><td>Local</td><td>Câmara Municipal de Montes Claros</td></tr>
  <tr><td>Quórum</td><td>19 conselheiros presentes</td></tr>
</table>
```
```css
.info-table { width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; border:1px solid #E5E7EB; }
.info-table td { padding:10px 16px; border-top:1px solid #E5E7EB; font-size:13.5px; }
.info-table tr:nth-child(even) td { background:#F7F8FA; }
.info-table td:first-child { font-family:var(--font-d); font-weight:700; color:#0D2E5A; width:160px; font-size:11px; text-transform:uppercase; letter-spacing:.5px; }
```

---

### 3.5 Bloco de Fala (fala)
```html
<div class="fala">
  <div class="fala-nome">Conselheiro Roberto Coelho Ferreira · Segmento Usuário</div>
  <p>Manifestou preocupação com os prazos de implantação da Policlínica no Córrego da Melancia.</p>
</div>
```
```css
.fala { background:white; border-left:4px solid #1B6CB5; border-radius:0 8px 8px 0; padding:14px 18px; border:1px solid #E5E7EB; border-left:4px solid #1B6CB5; margin-bottom:10px; }
.fala-nome { font-family:var(--font-d); font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#1B6CB5; margin-bottom:6px; }
```
**Variantes de cor de borda por segmento:**
- Usuário: `#1B6CB5` (azul)
- Trabalhador: `#1E8A4A` (verde)
- Gestor: `#d97706` (warning/laranja)
- Prestador: `#6B7280` (muted)

---

### 3.6 Lista de Encaminhamentos (enc-list)
```html
<div class="enc-list">
  <div class="enc-item">
    <div class="enc-n">1</div>
    <div class="enc-text">
      <strong>Formalizar pedido de informação</strong> sobre cronograma da Policlínica ao SMS.
      <span class="enc-resp">Responsável: Secretaria Executiva · Prazo: 30 dias</span>
    </div>
  </div>
</div>
```
```css
.enc-list { display:flex; flex-direction:column; gap:8px; }
.enc-item { display:flex; gap:12px; align-items:flex-start; padding:12px 16px; background:white; border:1px solid #E5E7EB; border-radius:8px; }
.enc-n { min-width:28px; height:28px; background:#F5C400; color:#0D2E5A; border-radius:5px; display:flex; align-items:center; justify-content:center; font-family:var(--font-d); font-size:12px; font-weight:900; flex-shrink:0; }
.enc-resp { display:block; font-size:11px; color:#6B7280; margin-top:4px; font-style:italic; }
```

---

### 3.7 KPI Cards (para resumos executivos e dashboards)
```html
<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-label">Total de Propostas</div>
    <div class="kpi-value">328</div>
    <div class="kpi-sub">9 pré-conferências</div>
  </div>
  <div class="kpi-card kpi-success">
    <div class="kpi-label">Quórum Atingido</div>
    <div class="kpi-value">19/25</div>
    <div class="kpi-sub">76% de presença</div>
  </div>
</div>
```
```css
.kpi-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:16px; margin:24px 0; }
.kpi-card { background:white; border:1px solid #E5E7EB; border-radius:12px; padding:20px; border-top:4px solid #1B6CB5; box-shadow:0 4px 20px rgba(0,0,0,.05); }
.kpi-card.kpi-success { border-top-color:#16a34a; }
.kpi-card.kpi-warning { border-top-color:#d97706; }
.kpi-card.kpi-danger  { border-top-color:#dc2626; }
.kpi-label { font-family:var(--font-d); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6B7280; margin-bottom:8px; }
.kpi-value { font-family:var(--font-d); font-size:36px; font-weight:900; color:#0D2E5A; letter-spacing:-2px; line-height:1; }
.kpi-sub { font-size:12px; color:#6B7280; margin-top:6px; }
```

---

### 3.8 Badge de Status
```html
<span class="badge badge-success">Aprovado</span>
<span class="badge badge-warning">Pendente</span>
<span class="badge badge-danger">Reprovado</span>
<span class="badge badge-info">Em análise</span>
```
```css
.badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:999px; font-family:var(--font-d); font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
.badge-success { background:#dcfce7; color:#15803d; }
.badge-warning { background:#fef9c3; color:#92400e; }
.badge-danger  { background:#fee2e2; color:#991b1b; }
.badge-info    { background:#dbeafe; color:#1e40af; }
```

---

### 3.9 Blockquote Legal (citação de lei, resolução)
```html
<blockquote class="legal-quote">
  <p>Art. 1º O Conselho Municipal de Saúde, em caráter permanente e deliberativo, órgão colegiado composto por representantes do governo, prestadores de serviço, profissionais de saúde e usuários...</p>
  <cite>Lei nº 8.142/1990, Art. 1º, § 2º</cite>
</blockquote>
```
```css
.legal-quote { background:#F7F8FA; border-left:4px solid #0D2E5A; border-radius:0 8px 8px 0; padding:16px 20px; margin:20px 0; }
.legal-quote p { font-size:14px; color:#374151; font-style:italic; line-height:1.8; margin-bottom:8px; }
.legal-quote cite { font-family:var(--font-d); font-size:11px; font-weight:700; color:#0D2E5A; text-transform:uppercase; letter-spacing:1px; font-style:normal; }
```

---

### 3.10 Cards de Delegado (Conferências)
```html
<div class="segmento-bloco">
  <h3 class="segmento-title">Segmento Usuário</h3>
  <div class="delegados-grid">
    <div class="delegado-card">
      <div class="delegado-n">01</div>
      <div class="delegado-nome">Maria das Graças Silva</div>
      <div class="delegado-org">Associação de Bairro — Todos os Santos</div>
    </div>
  </div>
</div>
```
```css
.segmento-title { font-family:var(--font-conf, var(--font-d)); font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#1A5EA8; border-bottom:2px solid #F5C800; padding-bottom:8px; margin-bottom:16px; }
.delegados-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:10px; }
.delegado-card { background:white; border:1px solid #E5E7EB; border-radius:8px; padding:12px 16px; display:flex; gap:10px; align-items:flex-start; }
.delegado-n { font-family:var(--font-conf, var(--font-d)); font-size:10px; font-weight:900; color:#F5C800; background:#0D2E5A; border-radius:4px; padding:2px 6px; flex-shrink:0; }
.delegado-nome { font-weight:700; font-size:13px; color:#0D2E5A; }
.delegado-org { font-size:11px; color:#6B7280; margin-top:2px; }
```

---

### 3.11 Sidebar de Navegação (documentos longos / dashboards)
```html
<main class="layout-sidebar">
  <aside class="sidebar-nav">
    <h3 class="sidebar-title">Navegação</h3>
    <ul class="sidebar-menu">
      <li><a href="#sec1">1. Abertura</a></li>
      <li><a href="#sec2">2. Pauta</a></li>
    </ul>
  </aside>
  <div class="main-content"><!-- conteúdo --></div>
</main>
```
```css
.layout-sidebar { max-width:1000px; margin:0 auto; padding:48px; display:grid; grid-template-columns:240px 1fr; gap:40px; }
.sidebar-nav { position:sticky; top:30px; height:fit-content; background:white; border:1px solid #E5E7EB; border-radius:12px; padding:20px; box-shadow:0 4px 20px rgba(0,0,0,.05); }
.sidebar-title { font-family:var(--font-d); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#0D2E5A; margin-bottom:12px; }
.sidebar-menu { list-style:none; display:flex; flex-direction:column; gap:8px; }
.sidebar-menu a { font-size:13px; color:#6B7280; text-decoration:none; font-weight:500; transition:color .2s; }
.sidebar-menu a:hover { color:#1B6CB5; }
@media (max-width:768px) { .layout-sidebar { grid-template-columns:1fr; padding:24px; } .sidebar-nav { display:none; } }
```

---

## 4. REGRAS CRÍTICAS — NUNCA VIOLAR

### 4.1 Scroll e Body
```css
/* CORRETO */
body { font-family: var(--font-b); background: var(--cms-off); color: var(--cms-ink); line-height: 1.7; }

/* PROIBIDO — trava scroll em documentos */
body { overflow: hidden; height: 100vh; } /* ← NUNCA */
```
`overflow: hidden` em `body` só é permitido no wrapper de apps/dashboards, nunca no body global de documentos.

### 4.2 Print A4
```css
@media print {
  body { background: #fff; color: #000; overflow: visible; height: auto; }
  .sidebar-nav, .btn-print, .back-top, .nav-bar { display: none !important; }
  @page { size: A4; margin: 18mm 15mm; }
  .section, .enc-item, .fala { page-break-inside: avoid; }
  /* Preservar cores de fundo em print: */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

### 4.3 Full-bleed em Print (problema recorrente)
Se uma seção tem `background-color` e precisa ir de borda a borda no A4:
```css
/* Problema: @page margin cria espaço em branco nas laterais */
/* Solução: negative margin + padding compensado */
.full-bleed-print {
  margin-left: -15mm;
  margin-right: -15mm;
  padding-left: 15mm;
  padding-right: 15mm;
}
```

### 4.4 Contraste de Cor Obrigatório
| Combinação | Resultado | Status |
|---|---|---|
| Branco em navy (#0D2E5A) | 12:1 | ✅ |
| Navy em amarelo (#F5C400) | 7:1 | ✅ |
| Branco em blue (#1B6CB5) | 4.6:1 | ✅ |
| Amarelo em branco | 1.4:1 | ❌ PROIBIDO |
| Muted (#6B7280) em off-white | 3.2:1 | ⚠️ Só para textos ≥ 14px |

### 4.5 Responsividade Mínima
Todo documento deve ter ao mínimo:
```css
@media (max-width: 768px) {
  .layout-sidebar { grid-template-columns: 1fr; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .header-inner { padding: 32px 20px; }
  body { font-size: 14px; }
}
@media (max-width: 480px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .delegados-grid { grid-template-columns: 1fr; }
}
```

---

## 5. ESTRUTURA HTML BOILERPLATE

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TIPO] · [NÚMERO/ANO] · CMS Montes Claros</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    /* 1. CSS Variables */
    :root { /* copiar bloco de cmsmoc-tokens.json → css_variables_block */ }
    /* 2. Reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-b); background: var(--cms-off); color: var(--cms-ink); line-height: 1.7; font-size: 15px; }
    /* 3. Stripe */
    .cms-stripe { height: 5px; background: linear-gradient(to right, #F5C400 33.3%, #1E8A4A 33.3% 66.6%, #1B6CB5 66.6%); }
    /* 4. Componentes (copiar apenas os necessários para o tipo de documento) */
    /* 5. Print */
    @media print { /* ... */ }
    /* 6. Responsivo */
    @media (max-width: 768px) { /* ... */ }
  </style>
</head>
<body>
  <div class="cms-stripe"></div>
  <header class="doc-header"><!-- ... --></header>
  <main><!-- conteúdo --></main>
  <footer class="doc-footer">
    <strong>Conselho Municipal de Saúde de Montes Claros – MG</strong><br>
    [Tipo do documento] · [Número] · [Ano]
  </footer>
</body>
</html>
```

---

## 6. CHECKLIST PRÉ-ENTREGA

Antes de finalizar qualquer artefato HTML, verificar:

- [ ] CSS variables `:root {}` inclui todos os tokens de `cmsmoc-tokens.json`
- [ ] Google Fonts importado no `<head>`
- [ ] Stripe tricolor presente e correto
- [ ] Cabeçalho com logos corretos para fundo claro/escuro
- [ ] `body` sem `overflow: hidden` nem `height: 100vh`
- [ ] `@media print` com `@page { size: A4 }` e `print-color-adjust: exact`
- [ ] Contraste de texto verificado nas combinações de cor usadas
- [ ] `@media (max-width: 768px)` presente
- [ ] `lang="pt-BR"` no `<html>`
- [ ] `<title>` no formato: `[TIPO] · [NÚMERO] · CMS Montes Claros`
- [ ] Se conferência: Georama importada e `--font-conf` aplicada

---

*CMSMOC Design System Agent v5.0 · Secretaria Executiva · Montes Claros, MG · 2026*

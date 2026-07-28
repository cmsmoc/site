# Especificação de Design (UI/UX) - Dashboard de Reativação CLS Montes Claros

## 1. Visão Geral
Este documento detalha as diretrizes de UI/UX para a transformação dos Anexos VI (Justificativa) e VII (Plano de Trabalho) em um hotsite/dashboard premium em página única (Single Page Application - SPA). O objetivo é apresentar o "Projeto Rede Integrada de Reativação dos 12 CLS" de forma moderna, limpa e com alto impacto visual.

## 2. Identidade Visual e Paleta de Cores
A interface adotará uma abordagem institucional premium, remetendo ao SUS, mas com um toque de modernidade e sofisticação (estilo GovTech).

*   **Cor Principal (Fundo de seções hero e cabeçalhos):** Azul Marinho SUS Escuro (`#0A2540` ou `#103154`) - Transmite segurança, oficialidade e confiança.
*   **Cor Secundária (Destaques e botões de ação principal):** Amarelo Ouro (`#FFC107` ou `#F4A261`) - Transmite energia, iluminação e chama a atenção para dados cruciais.
*   **Cor de Suporte (Sucesso, crescimento e ícones de saúde):** Verde Bandeira Mudo (`#2A9D8F` ou `#2E7D32`).
*   **Cor de Fundo Geral:** Cinza muito claro (`#F8F9FA`) para o corpo da página e Branco (`#FFFFFF`) para o interior de cards e painéis, garantindo alta legibilidade.
*   **Tipografia:** 
    *   *Títulos:* **Inter** ou **Montserrat** (Semibold/Bold) - modernas, limpas e geométricas.
    *   *Corpos de Texto:* **Roboto** ou **Open Sans** (Regular) - excelente legibilidade em telas.

## 3. Estrutura de Layout e Organização (Single Page HTML)

O hotsite será dividido nas seguintes sessões:

### Seção 1: Hero Section (Cabeçalho Impactante)
*   **Background:** Imagem com sobreposição (overlay) em Azul Marinho transparente, mostrando pessoas de uma comunidade e profissionais de saúde (ou abstração de rede).
*   **Conteúdo:**
    *   Título grande: "Rede Integrada de Reativação e Fortalecimento Institucional"
    *   Subtítulo: "12 Conselhos Locais de Saúde de Montes Claros – MG"
    *   *Badges* (Etiquetas) em destaque: "Orçamento: R$ 100.000,00" | "Abrangência: 12 Territórios".
    *   Botão "Ver Detalhes do Projeto" (Desliza suavemente para a próxima seção).

### Seção 2: Contexto e Justificativa (Anexo VI)
Esta seção traduz a densidade de texto do Anexo VI em leitura escaneável e atraente.
*   **Layout:** Grid assimétrico (ex: 60% texto / 40% destaques gráficos).
*   **O Problema (Diagnóstico):** Apresentado em parágrafos curtos, utilizando fontes grandes e espaçadas.
*   **Destaque "Teoria da Unimontes" (Fundamentação Acadêmica):**
    *   Um bloco de destaque estilizado (estilo *Card* flutuante).
    *   Fundo levemente sombreado, borda esquerda espessa na cor Verde Bandeira ou Amarelo Ouro.
    *   Ícone acadêmico/institucional sutil como marca d'água de fundo.
    *   *Texto do destaque:* Foco tipográfico nas palavras-chave originais: **"subfinanciamento crônico"**, **"assimetrias estruturais"**, **"altos custos de transação"** e **"baixa densidade de capital social"**.
*   **A Solução (Rede Integrada):** Apresentada abaixo da justificativa, com 3 colunas de ícones vetoriais:
    1. Infraestrutura Padronizada
    2. Eleições Unificadas
    3. Capacitação Pedagógica Itinerante

### Seção 3: Plano de Trabalho - Metas por Eixo (Anexo VII)
Apresentação do orçamento e das ações estruturadas através de **Cards Interativos Coloridos**. Cada eixo terá uma cor característica, em sintonia com a identidade.
*   **Layout:** CSS Grid com 4 colunas em desktop, colapsando para 1 coluna em dispositivos móveis.
*   **Cards de Eixos:**
    *   **Eixo A: Articulação** (Card com borda/detalhes Laranja) - R$ 13.000,00
    *   **Eixo B: Comunicação** (Card com borda/detalhes Azul Claro) - R$ 28.000,00
    *   **Eixo C: Eleição** (Card com borda/detalhes Roxo) - R$ 17.000,00
    *   **Eixo D: Formação** (Card com borda/detalhes Verde) - R$ 42.000,00
*   **Comportamento (UX):** Cada card possui o título do eixo, um ícone representativo e o valor total alocado de forma visível. Ao interagir (*hover* ou clique), o card revela uma lista estilizada (com marcadores) das submetas e seus orçamentos correspondentes.

### Seção 4: Cronograma de Execução (Timeline)
Transformar as etapas de tempo (Meses 1 a 36) em uma **Timeline Vertical Elegante** e visual.
*   **Design da Timeline:** 
    *   Linha central cinza com marcadores (nós) preenchidos com a cor do eixo predominante daquele período.
    *   Alternância em zigue-zague (esquerda/direita) para blocos cronológicos em desktop.
    *   **Fases Principais:**
        *   *Meses 1 a 6:* Instituição do Programa, Diagnóstico Situacional e Kits Institucionais.
        *   *Meses 7 a 12:* Placas, Regulamento Eleitoral, e Grande Eleição Unificada.
        *   *Mês 13:* Cerimônia de Posse Solene.
        *   *Meses 14 a 36:* Trilha Pedagógica Contínua, Seminário e Oficina de RAG.
*   **Benefício UX:** Transforma dados secos de tabelas em uma experiência de visualização narrativa fluida.

### Seção 5: Gestão, Assinaturas e Transparência
*   **Layout:** Área inferior da página com fundo branco limpo.
*   **Conteúdo:** Disposição lado a lado dos nomes do Presidente do CMS e do Secretário Municipal de Saúde, acompanhados de linhas de assinatura simuladas (ou certificação digital).
*   **Rodapé (Footer):** Em Azul Marinho, englobando brasões do município, logos oficiais, contato, CNPJ e informações técnicas.

## 4. Requisitos Técnicos Sugeridos
*   **Framework CSS:** Tailwind CSS (ideal para personalização das cores institucionais e construção rápida dos cards/grids).
*   **Ícones:** Phosphor Icons ou FontAwesome (linhas limpas).
*   **Tipografia Externa:** Importada do Google Fonts.
*   **Interatividade:** Animações AOS (Animate on Scroll) para fade-in dos cards e carregamento suave da timeline vertical ao rolar a página.

let metasGlobais = [];
let configEdital = {};
let projetoAtual = { metas: [] };

const DOM = {
    catalogoList: document.getElementById('catalogo-list'),
    projetoList: document.getElementById('projeto-list'),
    dashGrid: document.getElementById('dashboard-grid'),
    countMetas: document.getElementById('count-metas'),
    totalProjeto: document.getElementById('total-projeto'),
    statusProjeto: document.getElementById('status-projeto'),
    
    // Filtros
    searchInput: document.getElementById('search-input'),
    filterEixo: document.getElementById('filter-eixo'),
    filterCategoria: document.getElementById('filter-categoria'),
    filterValor: document.getElementById('filter-valor'),
    
    btnExportar: document.getElementById('btn-exportar'),
    exportMenu: document.getElementById('export-menu'),
    btnNovo: document.getElementById('btn-novo'),
    btnAbrir: document.getElementById('btn-abrir'),
    btnAleatorio: document.getElementById('btn-aleatorio'),
    
    // Cronograma
    tabConstrucao: document.getElementById('tab-construcao'),
    tabCronograma: document.getElementById('tab-cronograma'),
    viewConstrucao: document.getElementById('view-construcao'),
    viewCronograma: document.getElementById('view-cronograma'),
    cronoBody: document.getElementById('crono-body'),
    cronoFoot: document.getElementById('crono-foot')
};

// Formatter de Moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Carregar Dados Iniciais
async function loadData() {
    try {
        const confRes = await fetch('src/data/config.json');
        if(confRes.ok) configEdital = await confRes.json();
        else throw new Error("Erro ao carregar config.json");

        const metasRes = await fetch('src/data/metas.json');
        if(metasRes.ok) metasGlobais = await metasRes.json();
        else throw new Error("Erro ao carregar metas.json");

        initApp();
    } catch (e) {
        console.error(e);
        DOM.catalogoList.innerHTML = `<div style="color:var(--cms-danger); padding:20px;">Falha ao carregar dados. Se estiver rodando via file:///, use um servidor local (Live Server).</div>`;
    }
}

function initApp() {
    renderDashboard();
    renderCatalogo();
    renderProjeto();
    setupEventListeners();
    loadFromLocalStorage();
    renderCronograma();
}

function renderCatalogo() {
    const term = DOM.searchInput.value.toLowerCase();
    const eixo = DOM.filterEixo.value;
    const cat = DOM.filterCategoria.value;
    const maxVal = parseFloat(DOM.filterValor.value) || Infinity;

    const filtradas = metasGlobais.filter(m => {
        const matchTerm = term === '' || 
            m.titulo.toLowerCase().includes(term) || 
            m.descricao.toLowerCase().includes(term) ||
            m.palavrasChave.some(p => p.toLowerCase().includes(term));
        const matchEixo = eixo === '' || m.eixo === eixo;
        const matchCat = cat === '' || m.categoria === cat;
        const matchValor = m.valor <= maxVal;

        return matchTerm && matchEixo && matchCat && matchValor;
    });

    DOM.countMetas.textContent = filtradas.length;
    
    if (filtradas.length === 0) {
        DOM.catalogoList.innerHTML = `<p style="color:var(--cms-muted);">Nenhuma meta encontrada.</p>`;
        return;
    }

    // Calcula subtotal atual por eixo
    const subtotais = {};
    const eixosKeys = Object.keys(configEdital.eixos);
    eixosKeys.forEach(e => {
        subtotais[e] = projetoAtual.metas.filter(m => m.eixo === e).reduce((a, b) => a + b.valor, 0);
    });

    DOM.catalogoList.innerHTML = filtradas.map(m => {
        const confEixo = configEdital.eixos[m.eixo];
        const limiteEixo = confEixo ? confEixo.max : Infinity;
        const subtotalEixo = subtotais[m.eixo] || 0;
        
        const estourou = (subtotalEixo + m.valor) > limiteEixo;
        const disabledClass = estourou ? 'disabled' : '';
        const disabledAttr = estourou ? 'disabled' : '';

        return `
        <div class="meta-card ${disabledClass}">
            <div class="meta-header">
                <span class="meta-id">${m.id}</span>
                <span class="meta-eixo">Eixo ${m.eixo} - ${confEixo?.nome || ''}</span>
            </div>
            <h3 class="meta-title">${m.titulo}</h3>
            <div class="meta-desc-wrapper" data-full="${m.descricao}">
                <p class="meta-desc">${m.descricao}</p>
            </div>
            <div class="meta-details">
                <div title="${m.acao}"><strong>Ação</strong> ${m.acao}</div>
                <div title="${m.objeto}"><strong>Objeto</strong> ${m.objeto}</div>
            </div>
            <div class="meta-tags">
                ${m.palavrasChave.slice(0, 3).map(p => `<span class="tag">${p}</span>`).join('')}
            </div>
            <div class="meta-footer">
                <span class="meta-valor">${formatCurrency(m.valor)}</span>
                <button class="btn btn-warning" onclick="adicionarMeta('${m.id}')" ${disabledAttr}>Adicionar</button>
            </div>
        </div>
        `;
    }).join('');
}

window.adicionarMeta = (id) => {
    const meta = metasGlobais.find(m => m.id === id);
    if(meta) {
        // Criar um identificador unico para a instancia adicionada
        const item = { ...meta, uid: Date.now().toString() + Math.random().toString(36).substr(2, 5), periodos: [] };
        projetoAtual.metas.push(item);
        saveToLocalStorage();
        renderProjeto();
        renderDashboard();
        renderCatalogo(); // Re-renderiza para atualizar bloqueios
        renderCronograma();
    }
};

window.removerMeta = (uid) => {
    projetoAtual.metas = projetoAtual.metas.filter(m => m.uid !== uid);
    saveToLocalStorage();
    renderProjeto();
    renderDashboard();
    renderCatalogo(); // Re-renderiza para atualizar bloqueios
    renderCronograma();
};

function renderProjeto() {
    DOM.projetoList.innerHTML = '';
    
    // Agrupar por eixo
    const eixos = Object.keys(configEdital.eixos).sort();
    
    eixos.forEach(e => {
        const metasNoEixo = projetoAtual.metas.filter(m => m.eixo === e);
        const subtotal = metasNoEixo.reduce((acc, curr) => acc + curr.valor, 0);
        
        let html = `
            <div class="project-eixo">
                <div class="project-eixo-title">
                    <span>Eixo ${e} - ${configEdital.eixos[e].nome}</span>
                    <span class="project-eixo-subtotal">${formatCurrency(subtotal)}</span>
                </div>
        `;
        
        if (metasNoEixo.length === 0) {
            html += `<p style="font-size:12px; color:var(--cms-muted); font-style:italic;">Nenhuma meta adicionada.</p>`;
        } else {
            html += metasNoEixo.map(m => `
                <div class="project-item" data-eixo="${e}">
                    <div class="project-item-info">
                        <h4>${m.titulo}</h4>
                        <p>${formatCurrency(m.valor)}</p>
                    </div>
                    <button class="btn-icon" onclick="removerMeta('${m.uid}')" title="Remover">✕</button>
                </div>
            `).join('');
        }
        
        html += `</div>`;
        DOM.projetoList.innerHTML += html;
    });
}

function renderDashboard() {
    let html = '';
    let totalProjeto = 0;

    const eixos = Object.keys(configEdital.eixos).sort();
    eixos.forEach(e => {
        const conf = configEdital.eixos[e];
        const subtotal = projetoAtual.metas.filter(m => m.eixo === e).reduce((a, b) => a + b.valor, 0);
        totalProjeto += subtotal;

        let pct = conf.max > 0 ? (subtotal / conf.max) * 100 : 0;
        let colorClass = '';
        if (pct > 100) colorClass = 'danger';
        else if (pct >= 85) colorClass = 'warning';
        
        html += `
            <div class="dash-item">
                <div class="dash-label">
                    <span>Eixo ${e}</span>
                    <span>${formatCurrency(subtotal)} / ${formatCurrency(conf.max)}</span>
                </div>
                <div class="dash-bar-bg">
                    <div class="dash-bar-fill ${colorClass}" style="width: ${Math.min(pct, 100)}%;"></div>
                </div>
            </div>
        `;
    });

    DOM.dashGrid.innerHTML = html + DOM.dashGrid.lastElementChild.outerHTML; // re-append the total block
    
    // Update Total
    const totalEl = document.getElementById('total-projeto');
    const statusEl = document.getElementById('status-projeto');
    if (totalEl) totalEl.textContent = formatCurrency(totalProjeto);
    
    if (statusEl) {
        if (totalProjeto > configEdital.valorMaximoProjeto) {
            statusEl.innerHTML = `<span class="badge badge-danger">Ultrapassou limite de ${formatCurrency(configEdital.valorMaximoProjeto)}</span>`;
        } else if (totalProjeto < configEdital.valorMinimoProjeto && totalProjeto > 0) {
            statusEl.innerHTML = `<span class="badge badge-warning">Abaixo do mínimo de ${formatCurrency(configEdital.valorMinimoProjeto)}</span>`;
        } else if (totalProjeto > 0) {
            statusEl.innerHTML = `<span class="badge badge-success">Dentro do Orçamento</span>`;
        } else {
            statusEl.innerHTML = '';
        }
    }
}

// ==========================
// CRONOGRAMA
// ==========================
function renderCronograma() {
    if(!DOM.cronoBody) return;
    
    let html = '';
    const totals = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 9 periodos
    
    // Sort by Eixo then Titulo
    const sortedMetas = [...projetoAtual.metas].sort((a, b) => {
        if(a.eixo !== b.eixo) return a.eixo.localeCompare(b.eixo);
        return a.titulo.localeCompare(b.titulo);
    });

    if(sortedMetas.length === 0) {
        DOM.cronoBody.innerHTML = `<tr><td colspan="11" style="color:var(--cms-muted); font-style:italic;">Nenhuma meta adicionada ao projeto.</td></tr>`;
        DOM.cronoFoot.innerHTML = '';
        return;
    }

    sortedMetas.forEach(m => {
        const p = m.periodos || [];
        const activeCount = p.length;
        const valPerPeriod = activeCount > 0 ? (m.valor / activeCount) : 0;
        
        html += `<tr>
            <td>
                <span class="meta-eixo" style="display:block; font-size:10px;">Eixo ${m.eixo}</span>
                <span style="font-weight:700; color:var(--cms-navy);">${m.titulo}</span>
            </td>
            <td style="font-weight:700; color:var(--cms-green);">${formatCurrency(m.valor)}</td>
        `;
        
        for(let i=0; i<9; i++) {
            const isActive = p.includes(i);
            if(isActive) totals[i] += valPerPeriod;
            
            html += `
            <td class="${isActive ? 'crono-active-cell' : ''}" onclick="togglePeriodo('${m.uid}', ${i})" style="cursor:pointer; transition:0.2s;">
                <input type="checkbox" class="crono-checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); togglePeriodo('${m.uid}', ${i})">
                ${isActive ? `<span class="crono-val">${formatCurrency(valPerPeriod)}</span>` : ''}
            </td>`;
        }
        html += `</tr>`;
    });

    DOM.cronoBody.innerHTML = html;
    
    let footHtml = `<tr><td colspan="2" style="text-align:right;">TOTAL DO PERÍODO:</td>`;
    for(let i=0; i<9; i++) {
        footHtml += `<td>${formatCurrency(totals[i])}</td>`;
    }
    footHtml += `</tr>`;
    DOM.cronoFoot.innerHTML = footHtml;
}

window.togglePeriodo = (uid, periodoIndex) => {
    const meta = projetoAtual.metas.find(m => m.uid === uid);
    if(meta) {
        meta.periodos = meta.periodos || [];
        const idx = meta.periodos.indexOf(periodoIndex);
        if(idx > -1) {
            meta.periodos.splice(idx, 1);
        } else {
            meta.periodos.push(periodoIndex);
        }
        saveToLocalStorage();
        renderCronograma();
    }
};

function saveToLocalStorage() {
    localStorage.setItem('cms_projeto_edital11', JSON.stringify(projetoAtual));
}

function loadFromLocalStorage() {
    const salvo = localStorage.getItem('cms_projeto_edital11');
    if (salvo) {
        try {
            projetoAtual = JSON.parse(salvo);
            renderProjeto();
            renderDashboard();
        } catch(e){}
    }
}

function setupEventListeners() {
    DOM.searchInput.addEventListener('input', renderCatalogo);
    DOM.filterEixo.addEventListener('change', renderCatalogo);
    DOM.filterCategoria.addEventListener('change', renderCatalogo);
    DOM.filterValor.addEventListener('input', renderCatalogo);

    DOM.btnNovo.addEventListener('click', () => {
        if(confirm('Apagar projeto atual e iniciar um novo?')) {
            projetoAtual = { metas: [] };
            saveToLocalStorage();
            renderProjeto();
            renderDashboard();
            renderCatalogo();
        }
    });

    if (DOM.btnAleatorio) {
        DOM.btnAleatorio.addEventListener('click', gerarPlanoAleatorio);
    }

    // Export Menu Toggle
    DOM.btnExportar.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.exportMenu.style.display = DOM.exportMenu.style.display === 'none' || DOM.exportMenu.style.display === '' ? 'flex' : 'none';
    });
    document.addEventListener('click', () => {
        DOM.exportMenu.style.display = 'none';
    });

    // Exports
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('export-csv').addEventListener('click', exportCSV);
    document.getElementById('export-md').addEventListener('click', exportMD);
    document.getElementById('export-docx').addEventListener('click', exportDOCX);
    
    DOM.btnAbrir.addEventListener('click', importJSON);

    // Tabs
    if(DOM.tabConstrucao && DOM.tabCronograma) {
        DOM.tabConstrucao.addEventListener('click', () => {
            DOM.tabConstrucao.classList.add('active-tab');
            DOM.tabCronograma.classList.remove('active-tab');
            DOM.tabConstrucao.style.color = 'var(--cms-white)';
            DOM.tabConstrucao.style.borderColor = 'var(--cms-white)';
            DOM.tabCronograma.style.color = 'var(--cms-off)';
            DOM.tabCronograma.style.borderColor = 'rgba(255,255,255,0.3)';
            
            DOM.viewConstrucao.style.display = 'flex';
            DOM.viewCronograma.style.display = 'none';
        });
        DOM.tabCronograma.addEventListener('click', () => {
            DOM.tabCronograma.classList.add('active-tab');
            DOM.tabConstrucao.classList.remove('active-tab');
            DOM.tabCronograma.style.color = 'var(--cms-white)';
            DOM.tabCronograma.style.borderColor = 'var(--cms-white)';
            DOM.tabConstrucao.style.color = 'var(--cms-off)';
            DOM.tabConstrucao.style.borderColor = 'rgba(255,255,255,0.3)';
            
            DOM.viewConstrucao.style.display = 'none';
            DOM.viewCronograma.style.display = 'flex';
            renderCronograma();
        });
    }
}

// ==========================
// AUTO-SUGESTAO
// ==========================
function gerarPlanoAleatorio() {
    if(!confirm('Isso apagará o projeto atual e gerará um novo plano aleatório até bater o teto de todos os eixos. Continuar?')) return;
    
    projetoAtual.metas = [];
    const eixos = Object.keys(configEdital.eixos);
    let totalProjeto = 0;
    const tetoProjeto = configEdital.valorMaximoProjeto;

    eixos.forEach(e => {
        const limiteEixo = configEdital.eixos[e].max;
        if (limiteEixo <= 0) return;

        // Metas possiveis desse eixo
        const metasNoEixo = metasGlobais.filter(m => m.eixo === e);
        // Embaralha array
        const shuffled = [...metasNoEixo].sort(() => 0.5 - Math.random());

        let subtotal = 0;
        for (const meta of shuffled) {
            if (subtotal + meta.valor <= limiteEixo && totalProjeto + meta.valor <= tetoProjeto) {
                subtotal += meta.valor;
                totalProjeto += meta.valor;
                
                // Gerar períodos aleatórios (1 a 3 períodos)
                const pCount = Math.floor(Math.random() * 3) + 1;
                const periodos = [];
                while(periodos.length < pCount) {
                    const randP = Math.floor(Math.random() * 9);
                    if(!periodos.includes(randP)) periodos.push(randP);
                }

                const item = { ...meta, uid: Date.now().toString() + Math.random().toString(36).substr(2, 5), periodos };
                projetoAtual.metas.push(item);
            }
        }
    });

    saveToLocalStorage();
    renderProjeto();
    renderDashboard();
    renderCatalogo();
    renderCronograma();
}

// ==========================
// EXPORTS
// ==========================

function exportJSON() {
    const data = JSON.stringify(projetoAtual, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "projeto_edital.json");
}

function exportCSV() {
    if (projetoAtual.metas.length === 0) return alert('Projeto vazio');
    const csv = Papa.unparse(projetoAtual.metas.map(m => ({
        "Eixo": m.eixo,
        "Meta": m.titulo,
        "Ação": m.acao,
        "Objeto": m.objeto,
        "Recurso Estimado": m.valor
    })));
    const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "projeto_metas.csv");
}

function generateMarkdown() {
    let md = `# Plano de Trabalho - Edital de Fortalecimento\n\n`;
    
    let total = 0;
    const eixos = Object.keys(configEdital.eixos).sort();
    
    eixos.forEach(e => {
        const metas = projetoAtual.metas.filter(m => m.eixo === e);
        if (metas.length > 0) {
            md += `## Eixo ${e} - ${configEdital.eixos[e].nome}\n\n`;
            let subtotal = 0;
            metas.forEach((m, i) => {
                md += `### Meta ${i+1}: ${m.titulo}\n`;
                md += `**Ação:** ${m.acao}\n\n`;
                md += `**Objeto:** ${m.objeto}\n\n`;
                md += `**Valor:** ${formatCurrency(m.valor)}\n\n`;
                subtotal += m.valor;
            });
            md += `**Subtotal do Eixo ${e}:** ${formatCurrency(subtotal)}\n\n---\n\n`;
            total += subtotal;
        }
    });
    
    md += `## Resumo Financeiro\n\n**Total Geral do Projeto:** ${formatCurrency(total)}\n\n---\n\n`;

    md += `## Cronograma de Desembolso (36 Meses)\n\n`;
    md += `| Eixo / Meta | 1-4 | 5-8 | 9-12 | 13-16 | 17-20 | 21-24 | 25-28 | 29-32 | 33-36 |\n`;
    md += `|---|---|---|---|---|---|---|---|---|---|\n`;

    let cronoTotals = [0,0,0,0,0,0,0,0,0];
    const sorted = [...projetoAtual.metas].sort((a,b) => {
        if(a.eixo !== b.eixo) return a.eixo.localeCompare(b.eixo);
        return a.titulo.localeCompare(b.titulo);
    });

    sorted.forEach(m => {
        const p = m.periodos || [];
        const activeCount = p.length;
        const valPerPeriod = activeCount > 0 ? (m.valor / activeCount) : 0;
        
        md += `| **Eixo ${m.eixo}** - ${m.titulo} |`;
        for(let i=0; i<9; i++) {
            if(p.includes(i)) {
                cronoTotals[i] += valPerPeriod;
                md += ` ${formatCurrency(valPerPeriod)} |`;
            } else {
                md += ` - |`;
            }
        }
        md += `\n`;
    });

    md += `| **TOTAL DO PERÍODO** |`;
    for(let i=0; i<9; i++) {
        md += ` **${formatCurrency(cronoTotals[i])}** |`;
    }
    md += `\n`;

    return md;
}

function exportMD() {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    saveAs(blob, "plano_trabalho.md");
}

function exportDOCX() {
    // Usando docx.js window.docx (se carregado via CDN unpkg build index.js)
    if (typeof docx === 'undefined') {
        alert("Biblioteca docx não carregada");
        return;
    }
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;
    
    const children = [];
    children.push(new Paragraph({
        text: "Plano de Trabalho - Edital de Fortalecimento",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
    }));
    
    const eixos = Object.keys(configEdital.eixos).sort();
    let total = 0;
    
    eixos.forEach(e => {
        const metas = projetoAtual.metas.filter(m => m.eixo === e);
        if (metas.length > 0) {
            children.push(new Paragraph({
                text: `Eixo ${e} - ${configEdital.eixos[e].nome}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
            }));
            
            let subtotal = 0;
            metas.forEach((m, i) => {
                children.push(new Paragraph({
                    text: `Meta ${i+1}: ${m.titulo}`,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 200, after: 100 }
                }));
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: "Ação: ", bold: true }),
                        new TextRun(m.acao)
                    ]
                }));
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: "Objeto: ", bold: true }),
                        new TextRun(m.objeto)
                    ]
                }));
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: "Valor: ", bold: true }),
                        new TextRun(formatCurrency(m.valor))
                    ],
                    spacing: { after: 200 }
                }));
                subtotal += m.valor;
            });
            total += subtotal;
        }
    });
    
    children.push(new Paragraph({
        text: `Total Geral: ${formatCurrency(total)}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 600 }
    }));

    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
    
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "plano_trabalho.docx");
    });
}

function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => { 
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const parsed = JSON.parse(event.target.result);
                if(parsed.metas && Array.isArray(parsed.metas)) {
                    projetoAtual = parsed;
                    saveToLocalStorage();
                    renderProjeto();
                    renderDashboard();
                    alert("Projeto importado com sucesso!");
                } else {
                    alert("Formato de arquivo inválido.");
                }
            } catch(err) {
                alert("Erro ao ler o arquivo JSON.");
            }
        };
        reader.readAsText(file);
    }
    input.click();
}

// Iniciar
loadData();

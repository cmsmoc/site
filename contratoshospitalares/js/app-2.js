document.addEventListener('DOMContentLoaded', () => {
    const viewHospitais = document.getElementById('view-hospitais');
    const viewArquivos = document.getElementById('view-arquivos');
    const btnVoltar = document.getElementById('btn-voltar');
    const hospitalTitle = document.getElementById('hospital-title');
    const filesContainer = document.getElementById('files-container');

    let dadosCache = [];

    // Fetch JSON data
    fetch('data/dados_contratos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dadosCache = data.hospitais;
            renderHospitais(dadosCache);
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            viewHospitais.innerHTML = '<p style="color: red;">Erro ao carregar os dados dos contratos.</p>';
        });

    function renderHospitais(hospitais) {
        viewHospitais.innerHTML = '';
        
        hospitais.forEach((hospital, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-index', index);
            
            const hospitalMap = {
                'Aroldo Tourinho': { sigla: 'HAT', nome: 'Hospital Aroldo Tourinho' },
                'Dilson Godinho': { sigla: 'HDG', nome: 'Hospital Dilson Godinho' },
                'HC': { sigla: 'HCMR', nome: 'Hospital das Clínicas Dr. Mário Ribeiro da Silveira' },
                'Santa Casa': { sigla: 'HSC', nome: 'Irmandade Nossa Senhora das Mercês' },
                'HU': { sigla: 'HUCF', nome: 'Hospital Universitário Clemente de Faria' }
            };
            const info = hospitalMap[hospital.nome] || { sigla: hospital.nome, nome: hospital.nome };

            tile.setAttribute('data-sigla', info.sigla);

            const title = document.createElement('h2');
            title.className = 'tile-title';
            title.textContent = info.sigla;

            const fullname = document.createElement('h4');
            fullname.className = 'tile-fullname';
            fullname.textContent = info.nome;
            
            let totalFiles = 0;
            if (hospital.categorias) {
                totalFiles += (hospital.categorias["Contratos e Aditivos"] || []).length;
                totalFiles += (hospital.categorias["Atas"] || []).length;
                totalFiles += (hospital.categorias["Memorandos"] || []).length;
            }
            const subtitle = document.createElement('p');
            subtitle.className = 'tile-subtitle';
            subtitle.textContent = `${totalFiles} documentos`;
            
            tile.appendChild(title);
            tile.appendChild(fullname);
            tile.appendChild(subtitle);
            
            tile.addEventListener('click', () => {
                showHospitalFiles(hospital);
            });
            
            viewHospitais.appendChild(tile);
        });
    }

    function parseMarkdown(text) {
        if (!text) return 'Resumo não disponível.';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    function showHospitalFiles(hospital) {
        // Update Title
        hospitalTitle.textContent = hospital.nome;
        
        // Render Files
        filesContainer.innerHTML = '';
        
        const categorias = [
            { id: "Contratos e Aditivos", label: "Contratos e Aditivos", class: "cat-contratos" },
            { id: "Atas", label: "Atas", class: "cat-atas" },
            { id: "Memorandos", label: "Memorandos", class: "cat-memorandos" }
        ];

        categorias.forEach(cat => {
            const arquivos = hospital.categorias[cat.id];
            if (arquivos && arquivos.length > 0) {
                // Category Header
                const catHeader = document.createElement('h3');
                catHeader.className = `category-title ${cat.class}`;
                catHeader.textContent = cat.label;
                filesContainer.appendChild(catHeader);

                // Grid for files in this category
                const catGrid = document.createElement('div');
                catGrid.className = 'files-grid';

                arquivos.forEach(arquivo => {
                    const card = document.createElement('div');
                    card.className = 'file-card';
                    
                    // Highlight Principal Contract
                    if (arquivo.nomeExibicao.includes('Contrato Principal')) {
                        card.classList.add('is-contrato');
                    }
                    
                    const title = document.createElement('h4');
                    title.className = 'file-title';
                    title.textContent = arquivo.nomeExibicao;
                    
                    const resumo = document.createElement('p');
                    resumo.className = 'file-resumo';
                    resumo.innerHTML = parseMarkdown(arquivo.resumo);
                    
                    const link = document.createElement('a');
                    link.className = 'btn-acessar';
                    link.target = '_blank';
                    
                    if (arquivo.driveUrl && arquivo.driveUrl.trim() !== "") {
                        link.href = arquivo.driveUrl;
                        link.textContent = 'Acessar Documento';
                    } else {
                        link.href = '#';
                        link.textContent = 'Link Indisponível';
                        link.classList.add('disabled');
                        link.title = 'A URL do Google Drive não foi configurada para este arquivo no JSON.';
                    }
                    
                    card.appendChild(title);
                    card.appendChild(resumo);
                    card.appendChild(link);
                    catGrid.appendChild(card);
                });

                filesContainer.appendChild(catGrid);
            }
        });
        
        // Switch Views
        viewHospitais.style.display = 'none';
        viewArquivos.style.display = 'block';
    }

    btnVoltar.addEventListener('click', () => {
        viewArquivos.style.display = 'none';
        viewHospitais.style.display = 'grid'; // .metro-grid is grid
    });
});

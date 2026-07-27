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
            
            const title = document.createElement('h3');
            title.className = 'tile-title';
            title.textContent = hospital.nome;
            
            const subtitle = document.createElement('p');
            subtitle.className = 'tile-subtitle';
            subtitle.textContent = `${hospital.arquivos.length} documentos`;
            
            tile.appendChild(title);
            tile.appendChild(subtitle);
            
            tile.addEventListener('click', () => {
                showHospitalFiles(hospital);
            });
            
            viewHospitais.appendChild(tile);
        });
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

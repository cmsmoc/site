document.addEventListener('DOMContentLoaded', () => {
    const viewHospitais = document.getElementById('view-hospitais');
    const viewArquivos = document.getElementById('view-arquivos');
    const btnVoltar = document.getElementById('btn-voltar');
    const hospitalTitle = document.getElementById('hospital-title');
    const filesContainer = document.getElementById('files-container');
    const preambulo = document.getElementById('preambulo');

    let dadosCache = [];

    // Mapeamento de Hospitais e Logos
    const hospitalMap = {
        'Aroldo Tourinho': { sigla: 'HAT', logo: 'logotipos/logohat.png', tema: 'theme-Aroldo Tourinho' },
        'Dilson Godinho': { sigla: 'HDG', logo: 'logotipos/logohdg.png', tema: 'theme-Dilson Godinho' },
        'Santa Casa': { sigla: 'HSC', logo: 'logotipos/logosc.png', tema: 'theme-Santa Casa' },
        'HCMR': { sigla: 'HCMR', logo: 'logotipos/logohcmr.png', tema: 'theme-HCMR' },
        'HU': { sigla: 'HU', logo: 'logotipos/logohucf.png', tema: 'theme-HU' }
    };

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
            viewHospitais.innerHTML = '<div class="glass-panel" style="text-align: center;"><p style="color: #ef4444; font-weight: 500;">Erro ao carregar os dados. Certifique-se de que o script de sync está rodando.</p></div>';
        });

    function renderHospitais(hospitais) {
        viewHospitais.innerHTML = '';
        
        hospitais.forEach((hospital, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-index', index);
            
            const info = hospitalMap[hospital.nome] || { sigla: hospital.nome, logo: '', tema: '' };

            if (info.logo) {
                const img = document.createElement('img');
                img.src = info.logo;
                img.alt = `Logo ${hospital.nome}`;
                img.className = 'hospital-logo';
                tile.appendChild(img);
            }

            const title = document.createElement('h2');
            title.className = 'tile-title';
            title.textContent = info.sigla || hospital.nome;
            tile.appendChild(title);
            
            let totalFiles = 0;
            if (hospital.categorias) {
                Object.values(hospital.categorias).forEach(catFiles => {
                    totalFiles += catFiles.length;
                });
            }
            
            const subtitle = document.createElement('p');
            subtitle.className = 'tile-subtitle';
            subtitle.textContent = `${totalFiles} documentos`;
            tile.appendChild(subtitle);
            
            tile.addEventListener('click', () => {
                showHospital(index);
            });
            
            viewHospitais.appendChild(tile);
        });
    }

    function showHospital(index) {
        const hospital = dadosCache[index];
        const info = hospitalMap[hospital.nome] || { tema: '' };
        
        // Aplica o tema
        document.body.className = info.tema;
        
        hospitalTitle.textContent = hospital.nome;
        filesContainer.innerHTML = '';
        
        if (!hospital.categorias || Object.keys(hospital.categorias).length === 0) {
            filesContainer.innerHTML = '<p class="tile-subtitle">Nenhum documento encontrado.</p>';
        } else {
            Object.entries(hospital.categorias).forEach(([catName, files]) => {
                if (files.length === 0) return;
                
                const section = document.createElement('div');
                section.className = 'categoria-section';
                
                const h3 = document.createElement('h3');
                h3.className = 'categoria-title';
                h3.textContent = catName;
                section.appendChild(h3);
                
                const grid = document.createElement('div');
                grid.className = 'files-grid';
                
                files.forEach(file => {
                    const card = document.createElement('a');
                    card.className = 'file-card';
                    card.href = file.arquivoLocal;
                    card.target = '_blank';
                    
                    const icon = document.createElement('div');
                    icon.className = 'file-icon';
                    icon.innerHTML = '📄'; // Podemos trocar por SVG depois
                    
                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'file-info';
                    
                    const name = document.createElement('h4');
                    name.className = 'file-name';
                    name.textContent = file.nomeExibicao;
                    name.title = file.nomeExibicao; // tooltip
                    
                    const meta = document.createElement('p');
                    meta.className = 'file-meta';
                    meta.textContent = 'PDF Document';
                    
                    infoDiv.appendChild(name);
                    infoDiv.appendChild(meta);
                    
                    card.appendChild(icon);
                    card.appendChild(infoDiv);
                    
                    grid.appendChild(card);
                });
                
                section.appendChild(grid);
                filesContainer.appendChild(section);
            });
        }
        
        viewHospitais.style.display = 'none';
        preambulo.style.display = 'none';
        viewArquivos.style.display = 'block';
    }

    btnVoltar.addEventListener('click', () => {
        viewArquivos.style.display = 'none';
        viewHospitais.style.display = 'grid';
        preambulo.style.display = 'block';
        document.body.className = ''; // Remove temas
    });
});

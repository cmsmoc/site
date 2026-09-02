document.addEventListener('DOMContentLoaded', () => {
    const viewHospitais = document.getElementById('view-hospitais');
    const viewArquivos = document.getElementById('view-arquivos');
    const btnVoltar = document.getElementById('btn-voltar');
    const hospitalTitle = document.getElementById('hospital-title');
    const filesContainer = document.getElementById('files-container');
    const preambulo = document.getElementById('preambulo');

    let dadosCache = [];

    // Mapeamento fidedigno de hospitais
    const hospitalMap = {
        'Aroldo Tourinho': { sigla: 'HAT', logo: 'logotipos/logohat.png', tema: 'theme-Aroldo Tourinho' },
        'Dilson Godinho': { sigla: 'HDG', logo: 'logotipos/logohdg.png', tema: 'theme-Dilson Godinho' },
        'Santa Casa': { sigla: 'Santa Casa', logo: 'logotipos/logosc.png', tema: 'theme-Santa Casa' },
        'HC': { sigla: 'HCMR', logo: 'logotipos/logohcmr.png', tema: 'theme-HCMR' },
        'HU': { sigla: 'HU', logo: 'logotipos/logohucf.png', tema: 'theme-HU' }
    };

    fetch('data/dados_contratos.json')
        .then(response => {
            if (!response.ok) throw new Error('Falha ao carregar JSON');
            return response.json();
        })
        .then(data => {
            dadosCache = data.hospitais;
            renderHospitais(dadosCache);
        })
        .catch(error => {
            viewHospitais.innerHTML = '<p style="text-align: center; font-size: 1.2rem; color: red;">Nenhum dado encontrado. Rodou o script de sync do Drive?</p>';
        });

    function renderHospitais(hospitais) {
        viewHospitais.innerHTML = '';
        
        hospitais.forEach((hospital, index) => {
            // Check mapping by exact name or generic matching
            let info = { sigla: hospital.nome, logo: '', tema: '' };
            for (const key in hospitalMap) {
                if (hospital.nome.includes(key)) {
                    info = hospitalMap[key];
                    break;
                }
            }

            const tile = document.createElement('div');
            tile.className = 'tile';
            
            if (info.logo) {
                const img = document.createElement('img');
                img.src = info.logo;
                img.className = 'hospital-logo';
                tile.appendChild(img);
            } else {
                const title = document.createElement('h2');
                title.className = 'tile-title';
                title.textContent = info.sigla;
                tile.appendChild(title);
            }
            
            tile.addEventListener('click', () => {
                showHospital(hospital, info.tema);
            });
            
            viewHospitais.appendChild(tile);
        });
    }

    function showHospital(hospital, tema) {
        document.body.className = tema;
        hospitalTitle.textContent = hospital.nome;
        filesContainer.innerHTML = '';
        
        if (!hospital.categorias || Object.keys(hospital.categorias).length === 0) {
            filesContainer.innerHTML = '<p>Nenhum documento listado.</p>';
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
                    card.href = file.driveUrl || file.arquivoLocal || '#';
                    card.target = '_blank';
                    
                    const icon = document.createElement('div');
                    icon.style.fontSize = '2rem';
                    icon.textContent = '📄';
                    
                    const name = document.createElement('h4');
                    name.className = 'file-name';
                    name.textContent = file.nomeExibicao;
                    
                    card.appendChild(icon);
                    card.appendChild(name);
                    
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
        document.body.className = '';
    });
});

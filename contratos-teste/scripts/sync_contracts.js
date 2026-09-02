const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const CONTRATOS_DIR = path.join(__dirname, '../contratos');
const DATA_JSON = path.join(__dirname, '../data/dados_contratos.json');

function buildJson() {
    if (!fs.existsSync(CONTRATOS_DIR)) {
        fs.mkdirSync(CONTRATOS_DIR);
    }

    const hospitais = [];
    const hospitalDirs = fs.readdirSync(CONTRATOS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const hosp of hospitalDirs) {
        const hospPath = path.join(CONTRATOS_DIR, hosp);
        const categoriasData = {};

        const hospItems = fs.readdirSync(hospPath, { withFileTypes: true });

        for (const item of hospItems) {
            if (item.isDirectory()) {
                const catName = item.name;
                const catPath = path.join(hospPath, catName);
                const files = fs.readdirSync(catPath).filter(f => f.endsWith('.pdf') || f.endsWith('.pdf'));
                
                if (files.length > 0) {
                    categoriasData[catName] = files.map(f => ({
                        nomeExibicao: f.replace(/\.pdf$/i, ''),
                        arquivoLocal: `contratos/${hosp}/${catName}/${f}`,
                        resumo: ""
                    }));
                }
            } else if (item.isFile() && item.name.toLowerCase().endsWith('.pdf')) {
                if (!categoriasData['Documentos Gerais']) {
                    categoriasData['Documentos Gerais'] = [];
                }
                categoriasData['Documentos Gerais'].push({
                    nomeExibicao: item.name.replace(/\.pdf$/i, ''),
                    arquivoLocal: `contratos/${hosp}/${item.name}`,
                    resumo: ""
                });
            }
        }

        hospitais.push({
            nome: hosp,
            pasta: hosp,
            categorias: categoriasData
        });
    }

    const output = { hospitais };
    
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_JSON);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(DATA_JSON, JSON.stringify(output, null, 4));
    console.log(`[${new Date().toLocaleTimeString()}] dados_contratos.json atualizado com sucesso!`);
}

// Initial build
buildJson();

// Watch for changes if --watch flag is provided
if (process.argv.includes('--watch')) {
    console.log('Iniciando watcher na pasta de contratos...');
    chokidar.watch(CONTRATOS_DIR, { ignoreInitial: true })
        .on('all', (event, filePath) => {
            if (filePath.toLowerCase().endsWith('.pdf') || event === 'unlinkDir' || event === 'addDir') {
                console.log(`Alteração detectada: ${event} em ${filePath}`);
                buildJson();
            }
        });
}

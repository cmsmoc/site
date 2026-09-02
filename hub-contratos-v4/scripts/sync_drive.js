const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/token.json';
const CREDENTIALS_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/admincms-client.json';
const ROOT_FOLDER_ID = '1U1t38D_WwLs5dATaLu9r9TonqU-n3pFj';
const OUT_JSON = path.join(__dirname, '../data/dados_contratos.json');

const hospitalMatchMap = {
    'Aroldo Tourinho': 'Aroldo Tourinho',
    'Dilson Godinho': 'Dilson Godinho',
    'Santa Casa': 'Santa Casa',
    'Mário Ribeiro': 'HC',
    'Mario Ribeiro': 'HC',
    'HC': 'HC', 
    'Clemente de Faria': 'HU',
    'Universitário': 'HU',
    'HU': 'HU'
};

async function authenticate() {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);
    const creds = credentials.installed || credentials.web;
    const { client_secret, client_id, redirect_uris } = creds;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const token = fs.readFileSync(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

async function listFiles(drive, folderId) {
    const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
        pageSize: 1000
    });
    return res.data.files;
}

async function main() {
    try {
        const auth = await authenticate();
        const drive = google.drive({ version: 'v3', auth });
        
        console.log('Buscando hospitais (pastas raízes)...');
        const hospitaisFiles = await listFiles(drive, ROOT_FOLDER_ID);
        
        const hospitaisResult = [];
        
        for (const hosp of hospitaisFiles) {
            if (hosp.mimeType === 'application/vnd.google-apps.folder') {
                console.log(`Explorando pasta: ${hosp.name}`);
                
                let shortName = hosp.name;
                for (const key in hospitalMatchMap) {
                    if (hosp.name.toLowerCase().includes(key.toLowerCase())) {
                        shortName = hospitalMatchMap[key];
                        break;
                    }
                }
                
                const categoriasData = {
                    'Contratos e Aditivos': []
                };
                
                const subItems = await listFiles(drive, hosp.id);
                
                for (const item of subItems) {
                    if (item.mimeType !== 'application/vnd.google-apps.folder') {
                        categoriasData['Contratos e Aditivos'].push({
                            nomeExibicao: item.name.replace(/\.[^/.]+$/, ""),
                            arquivoLocal: "",
                            driveUrl: item.webViewLink || item.webContentLink,
                            resumo: ""
                        });
                    }
                }
                
                // Se a pasta não tiver arquivos, não cria
                if (categoriasData['Contratos e Aditivos'].length === 0) {
                     delete categoriasData['Contratos e Aditivos'];
                }

                hospitaisResult.push({
                    nome: shortName,
                    pasta: hosp.name,
                    categorias: categoriasData
                });
            }
        }
        
        const output = { hospitais: hospitaisResult };
        fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 4));
        console.log(`JSON atualizado com sucesso! Foram mapeados ${hospitaisResult.length} hospitais.`);
        
    } catch (err) {
        console.error('Erro ao mapear o Drive:', err);
    }
}

main();

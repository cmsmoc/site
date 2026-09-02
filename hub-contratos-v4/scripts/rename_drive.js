const { google } = require('googleapis');
const fs = require('fs');

const TOKEN_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/token.json';
const CREDENTIALS_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/admincms-client.json';
const ROOT_FOLDER_ID = '1U1t38D_WwLs5dATaLu9r9TonqU-n3pFj';

// Ative esta variável para alterar de verdade no Drive. (Falso para Dry-Run)
const VALENDO = true;

function generateNewName(oldName) {
    let name = oldName.replace(/\.pdf$/i, ''); 
    
    // Identifica processo permitindo ponto ou hífen
    let contractMatch = name.match(/(P0?\d{3}[\.-]\d{2}-\d{2})/i); 
    let contract = contractMatch ? contractMatch[1].replace(/\./g, '-') : ''; // padroniza para traço
    
    let isApostila = name.match(/APOSTILAMENTO/i) || name.match(/APOSTILA/i);
    let isTA = name.match(/TA|T\.A|ADITIVO/i);
    let isContrato = name.match(/CONTRATO/i) && !isApostila && !isTA;
    
    let newName = '';
    
    if (isApostila) {
        // Pega o número logo após apostilamento
        let numMatch = name.match(/APOSTILAMENTO[^\d]*(\d+)/i) || name.match(/(\d+)[__º°]*\s*APOSTILAMENTO/i);
        let num = numMatch ? numMatch[1].padStart(2, '0') : '';
        if (num) {
            newName = `${num}_Termo-de-Apostilamento${contract ? '-Contrato-'+contract : ''}`;
        }
    } else if (isTA) {
        let numMatch = name.match(/(\d+)[º°_]*\s*(?:TA|T\.A\.?|TERMO ADITIVO)/i) || name.match(/(?:TERMO ADITIVO)[^\d]*(\d+)/i);
        let num = numMatch ? numMatch[1].padStart(2, '0') : '';
        if (num) {
            newName = `${num}_Termo-de-Aditamento${contract ? '-Contrato-'+contract : ''}`;
        }
    }
    
    if (!newName) {
        // Fallback genérico para arquivos atípicos e contratos principais
        let cleanName = name.replace(/_assinado.*/i, '').replace(/__/g, '').trim();
        newName = cleanName.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    
    return `${newName}.pdf`;
}

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
        fields: 'files(id, name, mimeType)',
        pageSize: 1000
    });
    return res.data.files;
}

async function main() {
    try {
        const auth = await authenticate();
        const drive = google.drive({ version: 'v3', auth });
        
        console.log(`--- MODO ${VALENDO ? 'VALENDO' : 'DRY-RUN (SIMULAÇÃO)'} ---`);
        console.log('Buscando hospitais (pastas raízes)...');
        
        const hospitaisFiles = await listFiles(drive, ROOT_FOLDER_ID);
        
        for (const hosp of hospitaisFiles) {
            if (hosp.mimeType === 'application/vnd.google-apps.folder') {
                console.log(`\n📂 [PASTA] ${hosp.name}`);
                
                const subItems = await listFiles(drive, hosp.id);
                for (const file of subItems) {
                    if (file.mimeType !== 'application/vnd.google-apps.folder') {
                        const newName = generateNewName(file.name);
                        
                        if (newName !== file.name) {
                            console.log(`   DE:   ${file.name}`);
                            console.log(`   PARA: ${newName}`);
                            
                            if (VALENDO) {
                                await drive.files.update({
                                    fileId: file.id,
                                    requestBody: { name: newName }
                                });
                                console.log(`   (Renomeado com sucesso)`);
                            }
                        } else {
                            console.log(`   OK (sem mudanças): ${file.name}`);
                        }
                    }
                }
            }
        }
        
        console.log('\nProcesso concluído!');
    } catch (err) {
        console.error('Erro:', err);
    }
}

main();

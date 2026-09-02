const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/token.json';
const CREDENTIALS_PATH = 'C:/Users/55389/Documents/CMS 2026/_NovoCMS2026/00_SECRETARIAEXEC/CENTRAL/_arquivo_morto/credenciais_legadas/admincms-client.json';

const filesToDownload = [
    { name: '38__ TA - P0313.23-01.pdf', id: '1e7Ml2UVC5o2vRVsB_e_LyZr_Xlm4jaiR' },
    { name: '37__ T.A - P313.23-01.pdf', id: '197VOUrp7iqUaDLRgWFIjCbO1JMYqdsVW' },
    { name: 'TERMO DE APOSTILAMENTO N__ 08 AO CONTRATO P0313.23-01.pdf', id: '1o5OragmqSvF-sDsP-8IMqODh60N30Ezh' },
    { name: 'TERMO DE APOSTILAMENTO N__ 02 AO 30__ TA AO CONTRATO P0313.23-01.pdf', id: '1stIbs94_kXZtF9CB0KYo5BHqe6xK5nm0' },
    { name: '33__ T.A - P313.23-01.pdf', id: '1fxbqK8aJnbLJqg6dyZt5dg9-8XD88xBV' }
];

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

async function main() {
    const auth = await authenticate();
    const drive = google.drive({ version: 'v3', auth });
    
    for (const fileInfo of filesToDownload) {
        console.log(`Downloading ${fileInfo.name}...`);
        const destPath = path.join(__dirname, '..', fileInfo.name);
        
        try {
            const res = await drive.files.get(
                { fileId: fileInfo.id, alt: 'media' },
                { responseType: 'stream' }
            );
            
            await new Promise((resolve, reject) => {
                const dest = fs.createWriteStream(destPath);
                res.data
                    .on('end', () => {
                        console.log(`Done downloading ${fileInfo.name}`);
                        resolve();
                    })
                    .on('error', err => {
                        console.error('Error downloading', err);
                        reject(err);
                    })
                    .pipe(dest);
            });
        } catch (err) {
            console.error(`Error with ${fileInfo.name}:`, err.message);
        }
    }
}

main();

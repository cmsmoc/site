const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfs = [
    '38__ TA - P0313.23-01.pdf',
    '37__ T.A - P313.23-01.pdf',
    '33__ T.A - P313.23-01.pdf',
    'TERMO DE APOSTILAMENTO N__ 02 AO 30__ TA AO CONTRATO P0313.23-01.pdf',
    'TERMO DE APOSTILAMENTO N__ 08 AO CONTRATO P0313.23-01.pdf'
];

async function analyzePdf(fileName) {
    const filePath = path.join(__dirname, '..', fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        return;
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        console.log(`\n========================================`);
        console.log(`📄 ANALYSIS FOR: ${fileName}`);
        console.log(`========================================`);
        console.log(`Metadata Pages: ${data.numpages}`);
        
        const text = data.text;
        console.log(`Text Length: ${text.length} chars`);
        
        // Print first 800 characters
        console.log(`--- First 800 Chars ---`);
        console.log(text.substring(0, 800).replace(/\s+/g, ' '));
        console.log(`-----------------------`);
        
        // Search patterns
        const searchPatterns = [
            /termo\s+aditivo/i,
            /aditivo\s+n[º°\._\s]*\d+/i,
            /apostilamento/i,
            /contrato\s+n[º°\._\s]*/i,
            /cláusula/i,
            /partes/i
        ];
        
        console.log(`--- Keyword Matches ---`);
        searchPatterns.forEach(pattern => {
            const match = text.match(pattern);
            if (match) {
                const idx = match.index;
                const snippet = text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 100));
                console.log(`Pattern ${pattern}: FOUND -> "...${snippet.replace(/\s+/g, ' ')}..."`);
            } else {
                console.log(`Pattern ${pattern}: NOT FOUND`);
            }
        });
        
    } catch (err) {
        console.error(`❌ Error parsing ${fileName}:`, err.message);
    }
}

async function run() {
    for (const file of pdfs) {
        await analyzePdf(file);
    }
}

run();

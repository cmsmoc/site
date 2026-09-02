const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function saveFirstPage() {
    const fileName = '38__ TA - P0313.23-01.pdf';
    const filePath = path.join(__dirname, '..', fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        return;
    }
    
    console.log(`Loading PDF: ${fileName}`);
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        const parser = new PDFParse({ data: dataBuffer });
        // Generate screenshot of the first page
        const screenshots = await parser.getScreenshot({
            scale: 1.5,
            imageBuffer: true,
            first: 1, // only first page
            last: 1
        });
        
        if (screenshots.pages && screenshots.pages.length > 0) {
            const pageData = screenshots.pages[0];
            const outputPath = path.join(__dirname, '..', 'page1.png');
            fs.writeFileSync(outputPath, pageData.data);
            console.log(`✅ Saved first page screenshot to: ${outputPath}`);
            console.log(`Width: ${pageData.width}, Height: ${pageData.height}`);
        } else {
            console.log(`❌ No pages returned in screenshot`);
        }
    } catch (err) {
        console.error(`❌ Error rendering screenshot:`, err);
    }
}

saveFirstPage();

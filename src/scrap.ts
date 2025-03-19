import puppeteer from 'puppeteer';

export async function scrap() {
    // Responsavel por pegar as categorias de produtos mais vendidos no site da Amazon
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.br/bestsellers', { waitUntil: 'networkidle2' });
    await page.waitForSelector('div[role="treeitem"] a');

    const categories = await page.evaluate(() => {
        const sections: { category: string, link: string }[] = [];
        
        document.querySelectorAll('div[role="treeitem"] a').forEach((category) => {
            sections.push({ 
                category: category.textContent?.trim() || "Sem título",
                link: category.getAttribute('href') || "#"
            });
        });

        return sections;
    });

    await browser.close();
    return categories;
}
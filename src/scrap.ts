import puppeteer from 'puppeteer';

export async function scrap_ThreeItens(category: string, link: string) {
    //Responsavel por retornar os 3 produtos mais vendidos dessa categoria
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const site = 'https://www.amazon.com.br' + link;
    await page.goto(site, { waitUntil: 'networkidle2' });
    await page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');

    const result = await page.evaluate(() => {
        const items: { name: string, link: string }[] = [];
        document.querySelectorAll('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1').forEach((item, index) => {
            if (index < 3) {
                const itemName = item.textContent?.trim() || "Sem título";
                const itemLink = item.closest('a')?.getAttribute('href') || "#";
                items.push({ 
                    name: itemName,
                    link: itemLink
                });
            }
        });

        return items;
    });

    console.log(result)

    await browser.close();
    return result;
}

export async function scrap_categories() {
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
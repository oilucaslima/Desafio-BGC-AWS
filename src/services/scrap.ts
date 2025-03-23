import puppeteer from 'puppeteer';
import { inserirProduto } from '../services/dynamo.js';

export async function scrap_ThreeItens(category: string, link: string) {
    //Responsavel por retornar os 3 produtos mais vendidos dessa categoria
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const site = 'https://www.amazon.com.br' + link;
    await page.goto(site, { waitUntil: 'networkidle2' });
    await page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');

    const result = await page.evaluate(() => {
        const products: { name: string, price: string, rating: string, rank: number, link: string }[] = [];
        
        document.querySelectorAll('div.p13n-sc-uncoverable-faceout').forEach((onlyItem, index) => {
            if(index < 3) {
                const titleElement = onlyItem.querySelector(
                    'div._cDEzb_p13n-sc-css-line-clamp-1_1Fn1y, ' + 'div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1'
                );
                const itemName = titleElement?.textContent?.trim() || "Sem título";
                const itemLink = onlyItem.querySelector('a')?.getAttribute('href') || "#";
                const itemPrice = onlyItem.querySelector('span[class*="price"], span.a-price-whole')?.textContent?.trim() || "Preço não encontrado";
                const itemRating = onlyItem.querySelector('span.a-icon-alt')?.textContent?.trim() || "Sem avaliação";
                const itemRank = index + 1;

                // Adiciona o produto à lista de products
                products.push({
                    name: itemName,
                    price: itemPrice,
                    rating: itemRating,
                    rank: itemRank,
                    link: itemLink
                });
            }
        });

        return products;
    });


    //inserir os produtos no banco de dados
    for(let product_aux of result) 
    {
        await inserirProduto('ProdutosMaisVendidosPorCategoria', category, product_aux);
    }

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
                category: category.textContent?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "Sem título",
                link: category.getAttribute('href') || "#"
            });
        });

        return sections;
    });

    await browser.close();
    return categories;
}
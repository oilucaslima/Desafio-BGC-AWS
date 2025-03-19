var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from 'puppeteer';
import { inserirProduto } from './dynamo.js';
export function scrap_ThreeItens(category, link) {
    return __awaiter(this, void 0, void 0, function* () {
        //Responsavel por retornar os 3 produtos mais vendidos dessa categoria
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        const site = 'https://www.amazon.com.br' + link;
        yield page.goto(site, { waitUntil: 'networkidle2' });
        yield page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
        const result = yield page.evaluate(() => {
            const products = [];
            document.querySelectorAll('div.p13n-sc-uncoverable-faceout').forEach((onlyItem, index) => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (index < 3) {
                    const itemName = ((_b = (_a = onlyItem.querySelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "Sem título";
                    const itemLink = ((_c = onlyItem.querySelector('a')) === null || _c === void 0 ? void 0 : _c.getAttribute('href')) || "#";
                    const itemPrice = ((_e = (_d = onlyItem.querySelector('span[class*="price"], span.a-price-whole')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || "Preço não encontrado";
                    const itemRating = ((_g = (_f = onlyItem.querySelector('span.a-icon-alt')) === null || _f === void 0 ? void 0 : _f.textContent) === null || _g === void 0 ? void 0 : _g.trim()) || "Sem avaliação";
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
        for (let product_aux of result) {
            yield inserirProduto('ProdutosMaisVendidosPorCategoria', category, product_aux);
        }
        //console.log(result);
        yield browser.close();
        return result;
    });
}
export function scrap_categories() {
    return __awaiter(this, void 0, void 0, function* () {
        // Responsavel por pegar as categorias de produtos mais vendidos no site da Amazon
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        yield page.goto('https://www.amazon.com.br/bestsellers', { waitUntil: 'networkidle2' });
        yield page.waitForSelector('div[role="treeitem"] a');
        const categories = yield page.evaluate(() => {
            const sections = [];
            document.querySelectorAll('div[role="treeitem"] a').forEach((category) => {
                var _a;
                sections.push({
                    category: ((_a = category.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "Sem título",
                    link: category.getAttribute('href') || "#"
                });
            });
            return sections;
        });
        yield browser.close();
        return categories;
    });
}

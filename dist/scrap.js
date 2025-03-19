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
export function scrap_ThreeItens(category, link) {
    return __awaiter(this, void 0, void 0, function* () {
        //Responsavel por retornas os 3 produtos mais vendidos dessa categoria
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        const site = 'https://www.amazon.com.br' + link;
        yield page.goto(site, { waitUntil: 'networkidle2' });
        yield page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
        const result = yield page.evaluate(() => {
            const items = [];
            document.querySelectorAll('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1').forEach((item, index) => {
                var _a, _b;
                if (index < 3) {
                    const itemName = ((_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "Sem título";
                    const itemLink = ((_b = item.closest('a')) === null || _b === void 0 ? void 0 : _b.getAttribute('href')) || "#";
                    items.push({
                        name: itemName,
                        link: itemLink
                    });
                }
            });
            return items;
        });
        //console.log(result)
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

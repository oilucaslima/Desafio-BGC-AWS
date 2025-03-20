"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const scrap_js_1 = require("./scrap.js");
const functions_js_1 = require("./functions.js");
const dynamo_js_1 = require("./dynamo.js");
async function main() {
    try {
        console.log("Carregando categorias...");
        const categories = await (0, scrap_js_1.scrap_categories)();
        const maxCategories = categories.length;
        const userInput = await (0, functions_js_1.getNumberInput)(maxCategories);
        const index = userInput - 1;
        console.log(`Categoria escolhida: ${categories[index].category}`);
        const result = await (0, scrap_js_1.scrap_ThreeItens)(categories[index].category, categories[index].link);
        await (0, dynamo_js_1.criarTabela)('ProdutosMaisVendidosPorCategoria');
    }
    catch (error) {
        console.error('Erro ao executar o scraping:', error);
    }
}
main();

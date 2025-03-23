"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const scrap_js_1 = require("./scrap.js");
const functions_js_1 = require("./functions.js");
const dynamo_js_1 = require("./dynamo.js");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(path_1.default.resolve(__dirname, '../../docs/swagger.yaml'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.get('/', (req, res) => {
    res.send('API está funcionando. Acesse /api-docs para a documentação.');
});
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
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
main();

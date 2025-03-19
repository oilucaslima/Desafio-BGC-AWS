var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { scrap_categories, scrap_ThreeItens } from './scrap.js';
import { getNumberInput } from './functions.js';
import { criarTabela } from './dynamo.js';
export function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Carregando categorias...");
            const categories = yield scrap_categories();
            const maxCategories = categories.length;
            const userInput = yield getNumberInput(maxCategories);
            const index = userInput - 1;
            console.log(`Categoria escolhida: ${categories[index].category}`);
            const result = yield scrap_ThreeItens(categories[index].category, categories[index].link);
            yield criarTabela('ProdutosMaisVendidosPorCategoria');
        }
        catch (error) {
            console.error('Erro ao executar o scraping:', error);
        }
    });
}
main();

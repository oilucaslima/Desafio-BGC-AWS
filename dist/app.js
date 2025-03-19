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
import { criarTabelaSeNaoExistir } from './dynamo.js';
export function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Carregando categorias...");
            const categories = yield scrap_categories();
            const maxCategories = categories.length;
            const userInput = yield getNumberInput(maxCategories);
            // console.log("Você digitou:", userInput);
            console.log(`Categoria escolhida: ${categories[userInput - 1].category}`);
            scrap_ThreeItens(categories[userInput - 1].category, categories[userInput - 1].link);
            // Chama a função para criar a tabela, passando o nome da tabela
            const nomeDaTabela = 'ProdutosMaisVendidosPorCategoria'; // Pode ser o nome fixo ou dinâmico
            yield criarTabelaSeNaoExistir(nomeDaTabela);
        }
        catch (error) {
            console.error('Erro ao executar o scraping:', error);
        }
    });
}
main();

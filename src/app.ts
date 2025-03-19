import { scrap_categories, scrap_ThreeItens } from './scrap.js';
import { getNumberInput } from './functions.js';
import { criarTabela } from './dynamo.js';

export async function main() {
    try {
        console.log("Carregando categorias...");
        const categories = await scrap_categories(); 
        const maxCategories = categories.length;
        const userInput = await getNumberInput(maxCategories);

        console.log(`Categoria escolhida: ${categories[userInput - 1].category}`);
        scrap_ThreeItens(categories[userInput - 1].category, categories[userInput - 1].link);

        await criarTabela('ProdutosMaisVendidosPorCategoria');

    } catch (error) {
        console.error('Erro ao executar o scraping:', error);
    }
}

main();

import { scrap_categories, scrap_ThreeItens } from './scrap.js';
import { getNumberInput } from './functions.js';
import { criarTabela} from './dynamo.js';

export async function main() {
    try 
    {
        console.log("Carregando categorias...");
        const categories = await scrap_categories(); 
        const maxCategories = categories.length;
        const userInput = await getNumberInput(maxCategories);
        const index = userInput-1;
        console.log(`Categoria escolhida: ${categories[index].category}`);
        const result = await scrap_ThreeItens(categories[index].category, categories[index].link);
        await criarTabela('ProdutosMaisVendidosPorCategoria');
    } 
    catch (error) 
    {
        console.error('Erro ao executar o scraping:', error);
    }
}

main();

import { scrap_categories, scrap_ThreeItens } from './scrap.js';
import { getNumberInput } from './functions.js';
import { criarTabela} from './dynamo.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();
const swaggerDocument = YAML.load(path.resolve(__dirname, '../../docs/swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('API está funcionando. Acesse /api-docs para a documentação.');
});
  
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
    catch(error) 
    {
        console.error('Erro ao executar o scraping:', error);
    }
}

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

main();

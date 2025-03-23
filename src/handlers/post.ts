import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { scrap_categories, scrap_ThreeItens } from '../services/scrap.js';

// Instanciando o DynamoDB Client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export const set = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const categories = await scrap_categories();
    const categoryId = event.queryStringParameters?.categoryId;

    if (!categoryId) {
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'O parâmetro "categoryId" é obrigatório.',
            }),
        });
    }

    try {
        // Verifica se o categoryId está na lista de categorias
        const category = categories.find(cat => cat.category === categoryId);

        if (!category) {
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify({
                    message: `O parâmetro "categoryId" não é válido. Valores válidos são: ${categories.map(cat => cat.category).join(', ')}.`,
                }),
            });
        }

        // Agora que encontramos a categoria, podemos fazer o scraping dos três itens
        const result = await scrap_ThreeItens(category.category, category.link);

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Produtos da categoria "${category.category}" inseridos com sucesso.`,
                data: result,
            }),
        });

    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro interno no servidor ao buscar dados.',
            }),
        });
    }
};

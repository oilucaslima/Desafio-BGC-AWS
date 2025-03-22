import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { scrap_categories, scrap_ThreeItens } from '../services/scrap.js';

// Instanciando o DynamoDB Client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Altere para sua região

export const set = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    const categories = await scrap_categories();
    const categoryId = event.queryStringParameters?.categoryId;
    const maxCategories = categories.length;

    if (!categoryId) {
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'O parâmetro "categoryId" é obrigatório.',
            }),
        });
    }

    try 
    {
        const index = parseInt(categoryId) - 1;
        if (index < 0 || index >= maxCategories) {
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify({
                    message: `O parâmetro "categoryId" deve ser um número entre 1 e ${maxCategories}.`,
                }),
            });
        }

        const category = categories[index];
        const result = await scrap_ThreeItens(category.category, category.link);

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Produtos da categoria "${category.category}" inseridos com sucesso.`,
                data: result,
            }),
        });    
    } 
    catch(error) 
    {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro interno no servidor ao buscar dados.',
            }),
        });
    }
};

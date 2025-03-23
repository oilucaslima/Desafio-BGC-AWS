"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const scrap_js_1 = require("../services/scrap.js");
// Instanciando o DynamoDB Client
const dynamoDbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' });
const set = async (event, context, callback) => {
    const categories = await (0, scrap_js_1.scrap_categories)();
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
        const result = await (0, scrap_js_1.scrap_ThreeItens)(category.category, category.link);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Produtos da categoria "${category.category}" inseridos com sucesso.`,
                data: result,
            }),
        });
    }
    catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro interno no servidor ao buscar dados.',
            }),
        });
    }
};
exports.set = set;

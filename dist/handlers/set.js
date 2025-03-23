"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const scrap_js_1 = require("../services/scrap.js");
// Instanciando o DynamoDB Client
const dynamoDbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-1' }); // Altere para sua região
const set = async (event, context, callback) => {
    const categories = await (0, scrap_js_1.scrap_categories)();
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
    try {
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
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro interno no servidor ao buscar dados.',
            }),
        });
    }
};
exports.set = set;

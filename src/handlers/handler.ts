import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

// Instanciando o DynamoDB Client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Altere para sua região

export const find = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const categoryId = event.queryStringParameters?.categoryId;

  if (!categoryId) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'O parâmetro "categoryId" é obrigatório.',
      }),
    });
  }

  console.log(`Buscando todos os produtos para categoryId: [${categoryId}]...`);

  const params = {
    TableName: 'ProdutosMaisVendidosPorCategoria',
    KeyConditionExpression: 'categoryId = :categoryId',
    ExpressionAttributeValues: {
      ':categoryId': { S: categoryId },
    },
  };

  const command = new QueryCommand(params);

  try {
    const result = await dynamoDbClient.send(command);

    // Verifica se retornou algum item
    if (!result.Items || result.Items.length === 0) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          message: `Nenhum produto encontrado para categoryId "${categoryId}".`,
        }),
      });
    }

    // Processa os itens do DynamoDB para um formato mais simples
    const products = result.Items.map(item => ({
      name: item.name?.S || 'Sem título',
      link: 'https://www.amazon.com.br'+item.link?.S || 'Sem link',
      price: item.price?.S || 'Sem preço',
      rating: item.rating?.S || 'Sem avaliação',
      rank: item.rank?.N || 'Sem rank',
    }));

    // Resposta organizada
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        category: categoryId,
        products: products,
      }),
    };

    callback(null, response);
  } catch (error) {
    console.error('Erro ao buscar no DynamoDB:', error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro interno no servidor ao buscar dados.',
      }),
    });
  }
};

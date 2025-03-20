import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

export const welcome = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  // Receber o parâmetro 'name' da query string
  const name = event.queryStringParameters?.name || 'Visitante';
  console.log(`Ate aqui, ${name}!`);

  // Criar a resposta
  const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Bem-vindo, ${name}!`,
      }),
  };

  
  // Retornar a resposta
  callback(null, response);
};

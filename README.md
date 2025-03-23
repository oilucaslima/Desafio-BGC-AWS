# DESAFIO BGC - BRASIL

<p align="justify">
O desafio consiste em criar um sistema que retorne os três primeiros produtos de cada categoria da página de mais vendidos da Amazon (https://www.amazon.com.br/bestsellers) e disponibilize essas informações por meio de uma API. Para isso, será necessário implementar um web scraper (utilizando Puppeteer) que extraia os dados e preencha um banco de dados utilizado pela API.
</p>

# Sumário

- [Documentação](#documentação)
- [Ferramentas Utilizadas](#ferramentas-utilizadas)
- [Implementação](#implementação)
- [Compilação e Execução](#compilação-e-execução)
- [Contatos](#contatos)


# Documentação

<p align="justify">
Segue abaixo alguns links que podem ser úteis para compreensão da tarefa:

- [Diário de Bordo](https://docs.google.com/document/d/1eEM56RRZlDFTrcXQE7txQXtcWO5pzMAcksMEC3rvrUc/edit?usp=sharing)
- [Comandos Úteis](https://docs.google.com/document/d/1CZrg0useXKoIFeijGeDK3NSPSFtjZqvzzm9dakc9J_U/edit?usp=sharing)

# Ferramentas Utilizadas

<p align="center">
  <img src="imgs/lambda.png" width="70" height="70">
  <img src="imgs/dynamo.png" width="70" height="70">
  <img src="imgs/apigateway.png" width="70" height="70">
  <img src="imgs/serverless.png" width="70" height="70">
</p>

A pedido da BGC, foi utilizado o `Node.js/TypeScript` para o desenvolvimento do back-end, junto com as ferramentas disponibilizadas pela AWS, como o `DynamoDB` para a persistência dos dados, `Lambda` para a execução da função de busca de categorias e o `API Gateway` para a comunicação das APIs. O `Serverless Framework` também foi utilizado para a automação do processo de deploy.

# Implementação


# Compilação e Execução

Esse pequeno exemplo possui um arquivo Makefile que realiza todo o procedimento de compilação e execução. <br/>Para tanto, temos as seguintes diretrizes de execução:


| Comando                |  Função                                                                                           |                    
| -----------------------| ------------------------------------------------------------------------------------------------- |
|  `make clean`          | Apaga a última compilação realizada contida na pasta build                                        |
|  `make`                | Executa a compilação do programa utilizando o gcc, e o resultado vai para a pasta build           |
|  `make run`            | Executa o programa da pasta build após a realização da compilação           

# Referências


# Contatos
<a>
✉️ <i>lucaslimadeoliveira80@gmail.com</i><br>
</a>
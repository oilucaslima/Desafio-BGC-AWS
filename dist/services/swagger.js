"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BGC Web Scraper API",
            version: "1.0.0",
            description: "API que retorna os três primeiros produtos mais vendidos de uma categoria.",
        },
        servers: [
            {
                url: "https://t04ef4ijbb.execute-api.us-east-1.amazonaws.com/dev",
                description: "Servidor AWS",
            },
        ],
    },
    apis: ["./src/index.ts"], // Ou onde suas rotas estão definidas
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
function setupSwagger(app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    console.log("📄 Swagger disponível em https://t04ef4ijbb.execute-api.us-east-1.amazonaws.com/dev/api-docs");
}

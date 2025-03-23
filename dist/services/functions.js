"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberInput = getNumberInput;
exports.getItemName = getItemName;
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function getNumberInput(maxValue) {
    return new Promise((resolve, reject) => {
        rl.question(`[Categoria] - Digite um número entre 1 e ${maxValue}: `, (input) => {
            const number = parseInt(input);
            if (isNaN(number) || number < 1 || number > maxValue) {
                console.log(`Valor inválido. Por favor, insira um número entre 1 e ${maxValue}.`);
                return resolve(getNumberInput(maxValue));
            }
            rl.close();
            resolve(number);
        });
    });
}
async function getItemName(page) {
    try {
        // Espera pelo primeiro seletor que aparecer
        const itemElement = await Promise.race([
            page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-1_1Fn1y', { timeout: 60000 }),
            page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-2_EWgCb', { timeout: 60000 }),
            page.waitForSelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1', { timeout: 60000 })
        ]);
        // Se não encontrar nada, retorna um valor padrão
        if (!itemElement)
            return "Título não encontrado";
        // Pega o texto do elemento encontrado
        const itemText = await itemElement.evaluate(el => el.textContent?.trim() || "Sem título");
        return itemText;
    }
    catch (error) {
        console.error("Erro ao buscar o título:", error);
        return "Erro ao buscar título";
    }
}

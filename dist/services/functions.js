"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberInput = getNumberInput;
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

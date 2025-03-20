import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function getNumberInput(maxValue: number): Promise<number> {
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
import {scrap} from './scrap.js'; 

export async function index() {
    try {
        // Busca as categorias e os links dos produtos mais vendidos no site da Amazon
        const categories = await scrap(); 
        console.log('Categorias encontradas:', categories); 
    } catch (error) {
        console.error('Erro ao executar o scraping:', error);
    }
}

index();
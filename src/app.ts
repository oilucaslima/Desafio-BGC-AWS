import puppeteer from 'puppeteer';

export async function scrap() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://books.toscrape.com/');
  //  await page.waitForNetworkIdle();

    const result = await page.evaluate(() => {
        return document;
        // const pageTitle = document.title;
        // return pageTitle;  // Retornando o título da página
    });
    console.log(result);

    //console.log('Page Title:', result);

    await browser.close();
};

scrap();

console.log('Hello World');

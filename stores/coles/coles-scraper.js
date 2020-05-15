const puppeteer = require('puppeteer');

function readFile() {
}

async function getProducts() {
  try {
    var fs = require('fs')
      , filename = 'cookie.txt';
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) throw err;
      cookie = data
    });
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'cache-control': 'no-cache',
      'cookie': cookie,
    });
    await page.setViewport({ width: 1000, height: 926 });
    await page.goto('https://shop.coles.com.au/a/richmond-south/specials/search/half-price-specials', {waitUntil: 'networkidle2'});
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    // const productNames = await page.evaluate(() => {
    //       var div = document.querySelectorAll('#tile_colrsCatalogEntryListWidget_Data_2_3074457345618260154_3074457345618264559_3 > div > div > header > div.product-main-info > h3 > a > span > span.product-brand');
    //       console.log(div)
    //       var productnames = []
    //       // leave it blank for now
    //       return productnames
    //     })
    await browser.close();
    fs.writeFile('coles.html', bodyHtml, function (err) {
      if (err) return console.log(err);
      console.log('Coles website has been saved.');
    });
  } catch (err) {
    console.log(err);
  }
}

getProducts();

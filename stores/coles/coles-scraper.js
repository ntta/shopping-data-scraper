CATEGORIES = ['Bread & Bakery', 'Dairy, Eggs & Meals', 'Meat, Seafood & Deli', 'Pantry', 'Frozen', 'Drinks', 'International Foods', 'Healthy Living', 'Household', 'Health & Beauty'];
WEB = 'https://shop.coles.com.au'
API = 'https://shop.coles.com.au/search/resources/store/20501/productview/bySeoUrlKeyword/'

async function getHtmlBody(url) {
  const puppeteer = require('puppeteer');
  let fs = require('fs');
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'cache-control': 'no-cache',
    'cookie': fs.readFileSync('cookie.txt', 'utf8')
  });
  await page.setViewport({ width: 1000, height: 926 });
  await page.goto(url, {waitUntil: 'load', timeout: 0});
  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return bodyHtml;
}

async function getDataFromHtml(html, categoryId) {
  let cheerio = require('cheerio');
  let $ = cheerio.load(html);
  let products = $('.product-title').find($('a'));
  let productList = []
  for (let i = 0; i < products.length; i++) {
    let n = products[i].attribs.href.split('/');
    let url = API + n[n.length - 1] + '?catalogId=27101';
    console.log(`Getting ${url}`);
    const data = await getJsonData(url);
    if (data === null) {
      continue;
    }
    data.categoryId = categoryId;
    console.log(data);
    productList.push(data);
  }
  return productList;
}

async function getJsonData(url) {
  const axios = require('axios');
  const fs = require('fs')
  const params = {
    cookie: fs.readFileSync('cookie.txt', 'utf8')
  };
  const response = await axios.get(url, { params });
  const data = response.data.catalogEntryView[0];
  if (data === undefined) {
    return null;
  }
  let id = (data.p !== undefined && data.p !== null) ? `c${data.p}` : 'c';
  if (data.a.B !== undefined && data.a.B !== null && data.a.B[0] !== undefined && data.a.B[0] !== null) {
    id = `${id}-${data.a.B[0]}`;
  }
  if (id === 'c') {
    id = `c${String(Math.floor(Math.random() * 99999))}`;
  }
  const product = {
    id: id.toLowerCase(),
    store: 'coles',
    name: data.n,
    price: Number(data.p1['o']),
    oldPrice: Number(data.p1['l4']),
    categoryId: '',
    imagePath: (data.fi !== undefined && data.fi !== null) ? `${WEB}${data.fi}` : '',
    cupPrice: data.u2.toLowerCase(),
    unit: data.a.U[0].toLowerCase(),
    packageSize: data.a.O3[0].toLowerCase(),
    barcode: data.a.B,
    brand: data.m
  };
  return product;
}

function getCategoryId(category) {
  switch(category) {
    case 'Bread & Bakery':
      return 'bakery';
    case 'Meat, Seafood & Deli':
      return 'meat-seafood-deli';
    case 'Dairy, Eggs & Meals':
      return 'dairy-eggs-fridge';
    case 'Pantry':
      return 'pantry';
    case 'Frozen':
      return 'freezer';
    case 'Drinks':
      return 'drink';
    case 'Pet':
      return 'pet';
    case 'Household':
      return 'household';
    case 'International Foods':
      return 'international-foods';
    case 'Baby':
      return 'baby';
    case 'Healthy Living':
    case 'Health & Beauty':
      return 'health-beauty';
    default:
      return 'uncategorised';
  }
}


function generatePaginationUrls(url, page_number) {
  let urls = [];
  let urlWithoutPage = url.substring(0, url.length - 1);
  for (let i = 1; i <= page_number; i++) {
    urls.push(`${urlWithoutPage}${String(i)}`);
  }
  return urls;
}

async function getProducts() {
  let bodyHtml = null;
  let category_urls = {};
  try {
    bodyHtml = await getHtmlBody('https://shop.coles.com.au/a/richmond-south/specials/search/half-price-specials');
  } catch (erron) {
    console.log(`Erron in puppeteer part: ${erron}`);
    return;
  }

  // Cheerio

  if (bodyHtml) {
    try {
      let cheerio = require('cheerio');
      let $ = cheerio.load(bodyHtml);
      let categories = $("li[class='cat-nav-item']").not('.is-disabled').find($('.item-title'))
      for (let i = 0; i < categories.length; i++) {
        let category_name = categories[i].children[0].data;
        if (CATEGORIES.includes(category_name)) {
          let category_href = categories[i].parent.parent.attribs.href;
          category_urls[category_name] = `${WEB}${category_href}`;
        }
      }
    } catch (erron) {
      console.log(`Erron in cheerio part: ${erron}`);
    }
  } else {
    console.log(`Cannot file body HTML`);
  }

  // Puppeteer each category url
  for (category in category_urls) {
    bodyHtml = null;
    console.log(`Getting data from ${category}`);
    console.log(category_urls[category]);
    let categoryId = getCategoryId(category);
    bodyHtml = await getHtmlBody(category_urls[category]);
    if (bodyHtml) {
      let cheerio = require('cheerio');
      let $ = cheerio.load(bodyHtml);
      let page_number = 0;
      try {
        page_number = Number($("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data)
      } catch (erron) {
        page_number = 0;
      }
      console.log(`${category} has ${String(page_number)} page(s)`);
      if (page_number === 0) {
        let products = await getDataFromHtml(bodyHtml, categoryId);
        let fs = require('fs');
        console.log(products);
        // write to file
        let dataToWrite = JSON.stringify(products);
        fs.writeFileSync(`./data/coles-${categoryId}.json`, dataToWrite);
      } else {
        let urls = generatePaginationUrls(category_urls[category], page_number);
        let products = [];
        for (let i = 0; i < page_number; i++) {
          bodyHtml = await getHtmlBody(urls[i]);
          let productPage = await getDataFromHtml(bodyHtml, categoryId);
          products.concat(productPage);
        }
        let dataToWrite = await JSON.stringify(products);
        let fs = require('fs');
        fs.writeFileSync(`./data/coles-${categoryId}.json`, dataToWrite);
      }
    }
  }
}

getProducts();

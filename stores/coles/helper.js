const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');

const fetchBodyHtml = async (url, cookiePath = undefined) => {
  console.log(`Fetching body HTML of ${url}...`);
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  // await page.setUserAgent(
  //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
  // );
  await page.setExtraHTTPHeaders({
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    'Accept-Language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'cache-control': 'no-cache',
    cookie: cookiePath ? fs.readFileSync(cookiePath, 'utf8') : '',
  });
  await page.goto(url, { waitUntil: 'load', timeout: 0 });
  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return bodyHtml;
};

const getCategoryId = (categoryName) => {
  switch (categoryName) {
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
      return 'drinks';
    case 'Pet':
      return 'pet';
    case 'Household':
      return 'household';
    case 'International Foods':
      return 'international-foods';
    case 'Baby':
      return 'baby';
    case 'Healthy Living':
      return 'health-beauty';
    case 'Health & Beauty':
      return 'health-beauty2';
    default:
      return 'uncategorised';
  }
};

const getPaginationUrls = (url, pageNumber) => {
  let urls = [];
  let urlWithoutPage = url.substring(0, url.length - 1);
  for (let i = 1; i <= pageNumber; i++) {
    urls.push(`${urlWithoutPage}${String(i)}`);
  }
  return urls;
};

const getJsonData = async (url, categoryId, cookiePath, web) => {
  let params = {
    cookie: fs.readFileSync(cookiePath, 'utf8'),
  };
  let response = await axios.get(url, { params });
  let data = response.data.catalogEntryView[0];
  if (data === undefined) return null;
  let id = data.p !== undefined && data.p !== null ? `c${data.p}` : 'c';
  if (
    data.a.B !== undefined &&
    data.a.B !== null &&
    data.a.B[0] !== undefined &&
    data.a.B[0] !== null
  ) {
    id = `${id}-${data.a.B[0]}`;
  }
  if (id === 'c') {
    id = `c${String(Math.floor(Math.random() * 99999))}`;
  }
  const product = {
    id: id.toLowerCase(),
    store: 'coles',
    name: data.n,
    brand: data.m,
    price: Number(data.p1['o']),
    orgPrice: Number(data.p1['l4']),
    categoryId: categoryId,
    imagePath:
      data.fi !== undefined && data.fi !== null ? `${web}${data.fi}` : '',
    cupPrice: data.u2 === undefined ? null : data.u2.toLowerCase(),
    unit: data.a.U[0] === undefined ? null : data.a.U[0].toLowerCase(),
    packageSize: data.a.O3[0] === undefined ? null : data.a.O3[0].toLowerCase(),
    barcode: data.a.B === undefined ? null : data.a.B,
    isAvailable: true,
  };
  return product;
};

module.exports.fetchBodyHtml = fetchBodyHtml;
module.exports.getCategoryId = getCategoryId;
module.exports.getPaginationUrls = getPaginationUrls;
module.exports.getJsonData = getJsonData;

const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

const fetchBodyHtml = async (url) => {
  console.log(`Fetching body HTML of ${url}...`);
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({
    headless: false,
    args: ['--igcognito'],
  });
  let page = await browser.newPage();
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
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
    categoryIds: [categoryId],
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

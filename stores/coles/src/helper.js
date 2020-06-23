const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const constants = require('./constants');

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

const fetchUrls = async (locationUp) => {
  console.log(`Fetching category URLs from ${locationUp}...`);
  const location = locationUp.toLowerCase();
  const url = constants.FIRST_PAGES[location].url;
  const postcode = constants.FIRST_PAGES[location].postcode;
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({
    headless: true,
  });
  try {
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.click('#changeLocationBar');
    await page.waitFor(1000);
    await page.type('#search-form > p', postcode);
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.waitFor(1000);
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(bodyHtml);
    let categories = $("li[class='cat-nav-item']")
      .not('.is-disabled')
      .find($('.item-title'));
    let categoryUrlList = {};
    for (let i = 0; i < categories.length; i++) {
      let categoryName = categories[i].children[0].data;
      if (constants.CATEGORIES.includes(categoryName)) {
        categoryUrlList[
          getCategoryId(categoryName)
        ] = `${constants.WEB}${categories[i].parent.parent.attribs.href}`;
      }
    }

    let urlsOfEachCategory = {};
    for (categoryId in categoryUrlList) {
      urlsOfEachCategory[categoryId] = [];
      await page.goto(categoryUrlList[categoryId], {
        timeout: 0,
        waitUntil: 'networkidle2',
      });
      let bodyHtml = await page.evaluate(() => document.body.innerHTML);
      let $ = cheerio.load(bodyHtml);
      let pageNumber = 0;
      try {
        pageNumber = Number(
          $("ul[class='pagination']").find(
            $('.page-number').last().children().find($('.number'))
          )[0].children[0].data
        );
      } catch (err) {
        pageNumber = 1;
      }
      urlsOfEachCategory[categoryId] =
        pageNumber === 1
          ? [categoryUrlList[categoryId]]
          : getPaginationUrls(categoryUrlList[categoryId], pageNumber);
    }

    urlsOfEachCategory['health-beauty'] = urlsOfEachCategory[
      'health-beauty'
    ].concat(urlsOfEachCategory['health-beauty2']);
    delete urlsOfEachCategory['health-beauty2'];
    await browser.close();
    return urlsOfEachCategory;
  } catch (err) {
    console.log('Fetching failed. Trying again...');
    await browser.close();
    await fetchProducts(locationUp);
  }
};

const getJsonData = async (apiUrl, categoryId, location) => {
  let params = {
    cookie: fs.readFileSync(constants.COOKIE_PATH, 'utf8'),
  };
  let response = await axios.get(apiUrl, { params });
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
      data.fi !== undefined && data.fi !== null
        ? `${constants.WEB}${data.fi}`
        : '',
    cupPrice: data.u2 === undefined ? null : data.u2.toLowerCase(),
    unit: data.a.U[0] === undefined ? null : data.a.U[0].toLowerCase(),
    packageSize: data.a.O3[0] === undefined ? null : data.a.O3[0].toLowerCase(),
    barcode: data.a.B === undefined ? null : data.a.B,
    isAvailable: true,
    location: [location],
  };
  return product;
};

const fetchProducts = async (locationUp, filePath) => {
  console.log(`Fetching products from ${locationUp}...`);
  const location = locationUp.toLowerCase();
  const rawdata = fs.readFileSync(filePath);
  const urlsOfEachCategory = JSON.parse(rawdata);
  let products = [];
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({
    headless: false,
  });
  const postcode = constants.FIRST_PAGES[location].postcode;
  try {
    let page = await browser.newPage();
    await page.goto(constants.FIRST_PAGES[location].url, {
      waitUntil: 'networkidle2',
    });
    await page.click('#changeLocationBar');
    await page.waitFor(1000);
    await page.type('#search-form > p', postcode);
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.waitFor(1000);
    for (categoryId in urlsOfEachCategory) {
      console.log(`Fetching ${categoryId}...`);
      for (let i = 0; i < urlsOfEachCategory[categoryId].length; i++) {
        console.log(`Page ${i + 1}`);
        await page.goto(urlsOfEachCategory[categoryId][i], {
          timeout: 0,
          waitUntil: 'networkidle2',
        });
        let bodyHtml = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHtml);
        let productTags = $('.product-title').find($('a'));
        let productsOfUrl = [];
        for (let j = 0; j < productTags.length; j++) {
          let n = productTags[j].attribs.href.split('/');
          let apiUrl = constants.API + n[n.length - 1] + '?catalogId=27101';
          let data = await getJsonData(apiUrl, categoryId, location);
          if (data === null) continue;
          productsOfUrl.push(data);
        }
        // should remove url of category that has fetched
        products = products.concat(productsOfUrl);
      }
    }
    await browser.close();
    return products;
  } catch (err) {
    // console.log('Fetching failed. Trying again...');
    // await fetchProducts(locationUp, filePath);
    //await browser.close();
    console.log(err);
  }
};

module.exports.fetchUrls = fetchUrls;
module.exports.fetchProducts = fetchProducts;

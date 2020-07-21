import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import fs from 'fs';
import {
  categoryBlacklist,
  colesLocations,
  colesUrl,
  colesProductsPath,
  colesCategoriesPath,
} from '../variables/colesVariables';

let PRODUCTS = [];
let CATEGORIES = [];
let currentLocation = '';

const fetchColesSpecial = async () => {
  for (let location of colesLocations) {
    currentLocation = location.id;
    await fetchEachLocation(location);
  }
  fs.writeFileSync(colesProductsPath, JSON.stringify(PRODUCTS));
  fs.writeFileSync(colesCategoriesPath, JSON.stringify(CATEGORIES));
};

const ensureCorrectUrl = async (page, url, location) => {
  const strLocation = `, ${location.id}`;
  let isLocalised = false;
  while (!isLocalised) {
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.click('#changeLocationBar');
    await page.waitFor(1000);
    await page.type('#search-form > p', location.postcode);
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.waitForSelector('.localised-suburb');
    let suburb = await page.$eval('.localised-suburb', (el) => el.innerText);
    console.log(suburb);
    isLocalised = suburb.includes(strLocation);
  }
};

const fetchEachLocation = async (location) => {
  let url = location.url;
  console.log(`Getting special products from ${location.id}`);
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  let error = true;

  while (error) {
    try {
      await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
      await ensureCorrectUrl(page, url, location);
      await fetchProducts(page, url, location);
      error = false;
    } catch (err) {
      console.log('Failed in fetchEachLocation. Trying again...');
      error = true;
    }
  }
  await browser.close();
};

const fetchProducts = async (page, url, location) => {
  let error = true;
  while (error) {
    try {
      while (!page.url().includes(location.area)) {
        await ensureCorrectUrl(page, url, location);
      }
      await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
      error = false;
    } catch (_) {
      console.log('Failed in fetchProducts. Trying again...');
      error = true;
    }
  }
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  let categoryList = $("li[class='cat-nav-item']")
    .not('.is-disabled')
    .find($('.item-title'));

  if (categoryList.length > 0) {
    for (let i = 0; i < categoryList.length; i++) {
      if (!categoryBlacklist.includes(categoryList[i].children[0].data)) {
        let href = categoryList[i].parent.parent.attribs.href;
        let categoryName = categoryList[i].children[0].data;
        let categoryId = getCategoryId(categoryName);
        let foundCatIndex = CATEGORIES.findIndex((c) => c.id === categoryId);
        if (foundCatIndex < 0) {
          CATEGORIES.push({
            id: categoryId,
            name: categoryName,
          });
        }
        await fetchProductsOfCategory(page, colesUrl + href, categoryId);
        //await fetchProducts(page, colesUrl + href);
      }
    }
  }
};

const fetchProductsOfCategory = async (page, url, categoryId) => {
  let error = true;
  while (error) {
    try {
      await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
      await page.waitForSelector('.product-name', { visible: true });
      error = false;
    } catch (_) {
      console.log(`Failed to get: ${url}. Trying again...`);
      error = true;
    }
  }
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  let pageNumber = 0;
  try {
    pageNumber = Number(
      $("ul[class='pagination']").find(
        $('.page-number').last().children().find($('.number'))
      )[0].children[0].data
    );
  } catch (_) {
    pageNumber = 1;
  }

  let urls = getPaginationUrls(url, pageNumber);

  console.log(url);
  getProductsEachPage(bodyHtml, categoryId);
  if (urls.length > 1) {
    for (let i = 1; i < urls.length; i++) {
      error = true;
      while (error) {
        try {
          await page.goto(urls[i], { timeout: 0, waitUntil: 'networkidle2' });
          await page.waitForSelector('.product-name', { visible: true });
          error = false;
        } catch (_) {
          console.log(`Failed to get: ${urls[i]}. Trying again...`);
          error = true;
        }
      }
      let html = await page.evaluate(() => document.body.innerHTML);
      console.log(urls[i]);
      getProductsEachPage(html, categoryId);
    }
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

const getProductsEachPage = (bodyHtml, categoryId) => {
  let $ = cheerio.load(bodyHtml);
  let count = 0;
  $('.product-header').each((_, elm) => {
    count++;
    let id = getLastPart(
      $(elm).find('.product-image-link').attr('href').toString()
    );
    let name = $(elm).find('.product-name').text().trim();
    let brand = $(elm).find('.product-brand').text().trim();
    let imageUrls = [
      getImageUrl(
        colesUrl + $(elm).find('.product-image img').attr('src').toString()
      ),
    ];
    let storeId = 'coles';
    let packageSize = $(elm).find('.product-info .package-size').text().trim();
    let cupPrice = $(elm).find('.product-info .package-price').text().trim();
    let price = Number(
      $(elm).find('.dollar-value').text().trim() +
        $(elm).find('.cent-value').text().trim()
    );
    let promo = getPromoText($(elm).find('.discount-text').text().trim());
    let orgPrice =
      price + getSaveValue($(elm).find('.product-save-value').text().trim());
    let localPrice = {
      price,
      discountRate: getDiscountRate(price, orgPrice, promo),
      promo,
      orgPrice,
    };
    let locations = {};
    locations[currentLocation] = localPrice;
    let categoryIds = [categoryId];

    let foundIndex = PRODUCTS.findIndex((p) => p.id === id);
    if (foundIndex > -1) {
      if (
        !Object.keys(PRODUCTS[foundIndex].locations).includes(currentLocation)
      ) {
        PRODUCTS[foundIndex].locations[currentLocation] = localPrice;
      }
      if (!PRODUCTS[foundIndex].categoryIds.includes(categoryId)) {
        PRODUCTS[foundIndex].categoryIds.push(categoryId);
        PRODUCTS[foundIndex].categoryIds = [
          ...new Set(PRODUCTS[foundIndex].categoryIds),
        ];
      }
    } else {
      let newProduct = {
        id,
        name,
        brand,
        imageUrls,
        storeId,
        packageSize,
        cupPrice,
        locations,
        categoryIds,
        similarProducts: [],
      };
      PRODUCTS.push(newProduct);
    }
  });
  console.log(`Count: ${count}`);
};

const getDiscountRate = (price, orgPrice, promo) => {
  let rate;
  if (orgPrice) {
    rate = Math.round(100 - (price / orgPrice) * 100);
  }
  if (promo.trim() !== '') {
    const parts = promo.trim().split(' ');
    let quantity = null;
    let amount = null;
    for (let part of parts) {
      if (!isNaN(part)) {
        quantity = Number(part);
      }
      if (part[0] === '$') {
        amount = Number(part.replace('$', ''));
      }
    }
    if (quantity && amount) {
      let one = amount / quantity;
      rate = Math.round(100 - (one / price) * 100);
    }
  }
  return rate;
};

const getLastPart = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

const getCategoryId = (str) => {
  return (
    'c-' +
    str
      .toLowerCase()
      .trim()
      .replace('&', '')
      .replace(',', '')
      .split(' ')
      .filter((c) => c !== '')
      .join('-')
  );
};

const getPromoText = (str) => {
  const polishedStr = str.replace(/\n/g, '').replace(/\t/g, '');
  const parts = polishedStr.split('$');
  return polishedStr.replace(parts[0], parts[0] + ' ').trim();
};

const getImageUrl = (str) => {
  return str.replace('-th.', '.');
};

const getSaveValue = (str) => {
  return Number(str.replace('$', ''));
};

export default fetchColesSpecial;

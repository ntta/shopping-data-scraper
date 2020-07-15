import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import fs from 'fs';
import {
  categoryBlacklist,
  colesLocations,
  colesUrl,
} from '../variables/colesVariables';

let PRODUCTS = [];
let CATEGORIES = [];
let currentLocation = '';

const fetchColesSpecial = async () => {
  for (let location of colesLocations) {
    currentLocation = location.id;
    await fetchEachLocation(location);
  }
  fs.writeFileSync(
    `./data/products/coles-special-products.json`,
    JSON.stringify(PRODUCTS)
  );
  fs.writeFileSync(
    `./data/products/coles-special-categories.json`,
    JSON.stringify(CATEGORIES)
  );
};

const fetchEachLocation = async (location) => {
  let postcode = location.postcode;
  let url = location.url;
  console.log(`Getting special products from ${location.id}`);

  try {
    puppeteer.use(StealthPlugin());
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    while (!page.url().includes(url)) {
      await page.click('#changeLocationBar');
      await page.waitFor(1000);
      await page.type('#search-form > p', postcode);
      await page.waitFor(1000);
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle2' });
    }
    await fetchProducts(page, url);
    await browser.close();
  } catch (err) {
    console.log(err);
    return;
  }
};

const fetchProducts = async (page, url) => {
  console.log(url);
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
  await page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle2' });
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  let categoryList = $("li[class='cat-nav-item']")
    .not('.is-disabled')
    .find($('.item-title'));

  if (categoryList.length > 0) {
    for (let i = 0; i < categoryList.length; i++) {
      if (!categoryBlacklist.includes(categoryList[i].children[0].data)) {
        let href = categoryList[i].parent.parent.attribs.href;
        let categoryId = getLastPart(href);
        let categoryName = categoryList[i].children[0].data;
        let foundCatIndex = CATEGORIES.findIndex((c) => c.id === categoryId);
        if (foundCatIndex < 0) {
          CATEGORIES.push({
            id: categoryId,
            name: categoryName,
          });
        }
        await fetchProducts(page, colesUrl + href);
      }
    }
  } else {
    await fetchProductsOfDeepestCategory(page, url);
  }
};

const fetchProductsOfDeepestCategory = async (page, url) => {
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
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

  let urls = getPaginationUrls(url, pageNumber);

  for (let i = 0; i < urls.length; i++) {
    await page.goto(urls[i], { timeout: 0, waitUntil: 'networkidle2' });
    let bodyHtml = await page.evaluate(() => document.body.innerHTML);
    getProductsEachPage(bodyHtml, urls[i]);
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

const getProductsEachPage = (bodyHtml, url) => {
  let $ = cheerio.load(bodyHtml);
  $('.product-header').each((_, elm) => {
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
    ).toFixed(2);
    let promo = getPromoText($(elm).find('.discount-text').text().trim());
    let orgPrice = (
      price + getSaveValue($(elm).find('.product-save-value').text().trim())
    ).toFixed(2);
    let localPrice = {
      price,
      promo,
      orgPrice,
    };
    let locations = {};
    locations[currentLocation] = localPrice;
    let categoryIdPath = getCategoryIdPath(url);
    let categoryIdPaths = [categoryIdPathe];

    let foundIndex = PRODUCTS.findIndex((p) => p.id === id);
    if (foundIndex > -1) {
      if (
        !Object.keys(PRODUCTS[foundIndex].locations).includes(currentLocation)
      ) {
        PRODUCTS[foundIndex].locations[currentLocation] = localPrice;
      }
      if (!categoryIdPaths.includes(categoryIdPath)) {
        PRODUCTS[foundIndex].categoryIdPaths.push(categoryIdPath);
        PRODUCTS[foundIndex].categoryIdPaths = [
          ...new Set(PRODUCTS[foundIndex].categoryIdPaths),
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
        categoryIdPaths,
        similarProductIds: [],
      };

      console.log(newProduct);
      PRODUCTS.push(newProduct);
    }
  });
};

const getLastPart = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

const getCategoryIdPath = (str) => {
  const parts = str.split('/');
  let savedIndex = 0;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse') {
      savedIndex = i + 1;
      break;
    }
  }
  let result = parts.slice(savedIndex, parts.length);
  result[result.length] = result[result.length].split('?')[0];
  return result.join('/');
};

const getPromoText = (str) => {
  const polishedStr = str.replace(/\n/g, '').replace(/\t/g, '');
  const parts = polishedStr.split('$');
  return polishedStr.replace(parts[0], parts[0] + ' ');
};

const getImageUrl = (str) => {
  return str.replace('-th.', '.');
};

const getSaveValue = (str) => {
  return Number(str.replace('$', ''));
};

export default fetchColesSpecial;

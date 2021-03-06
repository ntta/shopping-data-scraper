import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import fs from 'fs';
import { colesEverything, colesUrl, ignoredCategoryList } from '../variables';

/* Get all products from Coles
 * 1. Navigate to colesEverything.url and enter its postcode to ensure location is correct
 * 2. Get all category URLs (not in ignoredCategoryList) from the left column
 * 3. Navigate to each URL, get products in each page
 * Product object format:
 * {
 *  id: string,
 *  brand: string,
 *  name: string,
 *  imageUrl: string,
 *  categories: Array of string,
 *  locations: {
 *    vic: {
 *      price: double,
 *      promoText: string,
 *      package-size: string,
 *      package-price: string,
 *    }
 *  }
 * }
 */

const postcode = colesEverything.postcode;
let allProducts = [];

const getCategorisedColesProducts = async (url) => {
  try {
    puppeteer.use(StealthPlugin());
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let category = getProductCategory(url);
    console.log(`Getting products from ${category}`);

    // Navigate to url and enter postcode
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.click('#changeLocationBar');
    await page.waitFor(1000);
    await page.type('#search-form > p', postcode.toString());
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle2' });
    await getDeepestSubCategoryList(page, url);
    await browser.close();
    fs.writeFileSync(
      `./data/products/${category}.json`,
      JSON.stringify(allProducts)
    );
  } catch (err) {
    console.log(err);
    return;
  }
};

const getDeepestSubCategoryList = async (page, url) => {
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  let categoryList = $("li[class='cat-nav-item']")
    .not('.is-disabled')
    .find($('.item-title'));

  if (categoryList.length > 0) {
    for (let i = 0; i < categoryList.length; i++) {
      if (ignoredCategoryList.includes(categoryList[i].children[0].data)) {
        continue;
      }
      await getDeepestSubCategoryList(
        page,
        colesUrl + categoryList[i].parent.parent.attribs.href
      );
    }
  } else {
    await getProductsOfCategory(page, url);
  }
};

const getProductsOfCategory = async (page, url) => {
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
    console.log(`Getting: ${urls[i]}`);
    await getProductsEachPage(page, urls[i]);
  }
};

const getProductsEachPage = async (page, url) => {
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  let category = getProductCategory(url);
  let tags = getProductTags(url);
  console.log(tags);
  $('.product-header').each((i, elm) => {
    let id = getProductId(
      $(elm).find('.product-image-link').attr('href').toString()
    );
    let name = $(elm).find('.product-name').text().trim();
    let imageUrl =
      colesUrl + $(elm).find('.product-image img').attr('src').toString();
    let brand = $(elm).find('.product-brand').text().trim();
    let packageSize = $(elm).find('.product-info .package-size').text().trim();
    let packagePrice = $(elm)
      .find('.product-info .package-price')
      .text()
      .trim();
    let price = Number(
      $(elm).find('.dollar-value').text().trim() +
        $(elm).find('.cent-value').text().trim()
    );
    let promoText =
      $(elm).find('.product-save-value').text().trim() +
      getDiscountText($(elm).find('.discount-text').text().trim());
    if (allProducts.some((p) => p.id === id)) {
      allProducts.map((p) => {
        if (p.id === id) {
          p.categories.push(category);
          p.categories = [...new Set(p.categories)];
          p.tags.concat(tags);
          p.tags = [...new Set(p.tags)];
        }
      });
    } else {
      let categories = [category];
      let newProduct = {
        id,
        brand,
        name,
        imageUrl,
        categories,
        tags,
        locations: {
          vic: {
            price,
            promoText,
            packageSize,
            packagePrice,
          },
        },
      };
      console.log(newProduct);
      allProducts.push(newProduct);
    }
  });
};

const getPaginationUrls = (url, pageNumber) => {
  let urls = [];
  let urlWithoutPage = url.substring(0, url.length - 1);
  for (let i = 1; i <= pageNumber; i++) {
    urls.push(`${urlWithoutPage}${String(i)}`);
  }
  return urls;
};

const getProductId = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

const getProductCategory = (str) => {
  const parts = str.split('/');
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse') {
      result = parts[i + 1];
      break;
    }
  }
  return result.split('?')[0];
};

const getDiscountText = (str) => {
  const polishedStr = str.replace(/\n/g, '').replace(/\t/g, '');
  const parts = polishedStr.split('$');
  return polishedStr.replace(parts[0], parts[0] + ' ');
};

const getProductTags = (str) => {
  const parts = str.split('/');
  let result = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'browse' && i + 1 < parts.length) {
      result = parts.slice(parts.indexOf(parts[i + 1]), parts.length);
      break;
    }
  }
  const category = getProductCategory(str);
  result = result.filter((tag) => tag !== category);
  return result.map((tag) => tag.split('?')[0]);
};

export default getCategorisedColesProducts;

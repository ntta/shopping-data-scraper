import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import fs from 'fs';
import { colesLocations, colesUrl } from '../../variables';

/*
"id": "c2815617p-9334169000092",
"store": "coles",
"name": "Wholegrain Large Wraps 8 pack",
"brand": "Simson's Pantry",
"price": 2.1,
"orgPrice": 4.2,
"categoryIds": ["bakery"],
"imagePath": "https://shop.coles.com.au/wcsstore/Coles-CAS/images/2/8/1/2815617.jpg",
"cupPrice": "$0.38 per 100g",
"packageSize": "560g",
"isAvailable": true,
"locations": ["vic", "sa", "qld", "nsw", "wa", "tas", "act", "nt"]
*/

const categoryNames = [
  'Bread & Bakery',
  'Dairy, Eggs & Meals',
  'Meat, Seafood & Deli',
  'Pantry',
  'Frozen',
  'Drinks',
  'International Foods',
  'Healthy Living',
  'Household',
  'Health & Beauty',
  'Baby',
];
let products = [];
let currentLocation = '';

const fetchHalfPriceColes = async () => {
  for (let location of colesLocations) {
    currentLocation = location.id;
    await fetchEachLocation(location);
  }
  fs.writeFileSync(
    `./data/products/half-price-coles.json`,
    JSON.stringify(products)
  );
};

const fetchEachLocation = async (location) => {
  let postcode = location.postcode;
  let url = location.url;
  console.log(`Getting hal-price products from ${location.id.toUpperCase()}`);

  try {
    puppeteer.use(StealthPlugin());
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    await page.waitFor(1000);
    await page.click('#changeLocationBar');
    await page.waitFor(1000);
    await page.type('#search-form > p', postcode);
    await page.waitFor(1000);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle2' });
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    let bodyHtml = await page.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHtml);
    let categories = $("li[class='cat-nav-item']")
      .not('.is-disabled')
      .find($('.item-title'));
    for (let i = 0; i < categories.length; i++) {
      let categoryName = categories[i].children[0].data;
      if (categoryNames.includes(categoryName)) {
        let categoryUrl = colesUrl + categories[i].parent.parent.attribs.href;
        let categoryId = getCategoryId(categoryName);
        await fetchCategoryProducts(categoryUrl, categoryId, page);
      }
    }
    await browser.close();
    fs.writeFileSync(
      `./data/products/half-price-coles-${location.id}.json`,
      JSON.stringify(products)
    );
  } catch (err) {
    console.log(err);
    return;
  }
};

const fetchCategoryProducts = async (categoryUrl, categoryId, page) => {
  await page.goto(categoryUrl, { timeout: 0, waitUntil: 'networkidle2' });
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let totalPages = getTotalPages(bodyHtml);
  if (totalPages >= 1) {
    let urls = getPaginationUrls(categoryUrl, totalPages);
    for (let url of urls) {
      await fetchProductsEachPage(page, url, categoryId);
    }
  } else {
    await fetchProductsEachPage(page, categoryUrl, categoryId);
  }
};

const getTotalPages = (bodyHtml) => {
  let $ = cheerio.load(bodyHtml);
  let totalPages = 0;
  try {
    totalPages = Number(
      $("ul[class='pagination']").find(
        $('.page-number').last().children().find($('.number'))
      )[0].children[0].data
    );
  } catch (err) {
    totalPages = 1;
  }
  return totalPages;
};

const getPaginationUrls = (url, pageNumber) => {
  let urls = [];
  let urlWithoutPage = url.substring(0, url.length - 1);
  for (let i = 1; i <= pageNumber; i++) {
    urls.push(`${urlWithoutPage}${String(i)}`);
  }
  return urls;
};

const fetchProductsEachPage = async (page, url, categoryId) => {
  await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
  let bodyHtml = await page.evaluate(() => document.body.innerHTML);
  let $ = cheerio.load(bodyHtml);
  $('.product-header').each((i, elm) => {
    let id = getProductId(
      $(elm).find('.product-image-link').attr('href').toString()
    );
    let name = $(elm).find('.product-name').text().trim();
    let imageUrl = getImageUrl(
      colesUrl + $(elm).find('.product-image img').attr('src').toString()
    );
    let brand = $(elm).find('.product-brand').text().trim();
    let packageSize = $(elm).find('.product-info .package-size').text().trim();
    let cupPrice = $(elm).find('.product-info .package-price').text().trim();
    let price = Number(
      $(elm).find('.dollar-value').text().trim() +
        $(elm).find('.cent-value').text().trim()
    );
    let orgPrice =
      price + getSaveValue($(elm).find('.product-save-value').text().trim());
    if (products.some((p) => p.id === id)) {
      products.map((p) => {
        if (p.id === id && !p.locations.includes(currentLocation)) {
          p.locations.push(currentLocation);
          p.locations = [...new Set(p.locations)];
        }

        if (p.id === id && !p.categoryIds.includes(categoryId)) {
          p.categoryIds.push(categoryId);
          p.categoryIds = [...new Set(p.categoryIds)];
        }
      });
    } else {
      let newProduct = {
        id,
        store: 'coles',
        brand,
        name,
        price,
        orgPrice,
        imagePath: imageUrl,
        categoryIds: [categoryId],
        packageSize,
        cupPrice,
        isAvailable: true,
        locations: [currentLocation],
      };
      console.log(newProduct);
      products.push(newProduct);
    }
  });
};

const getProductId = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 1].split('?')[0];
};

const getSaveValue = (str) => {
  return Number(str.replace('$', ''));
};

const getImageUrl = (str) => {
  return str.replace('-th.', '.');
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
    case 'Health & Beauty':
      return 'health-beauty';
    default:
      return 'uncategorised';
  }
};

export default fetchHalfPriceColes;

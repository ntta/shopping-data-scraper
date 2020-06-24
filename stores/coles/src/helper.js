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

const fetchUrls = async () => {
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({
    headless: false,
  });
  try {
    let page = await browser.newPage();
    let categoryUrlLists = {};
    for (let location of Object.keys(constants.FIRST_PAGES)) {
      console.log(`Fetching category URLs from ${location.toUpperCase()}...`);
      let url = constants.FIRST_PAGES[location].url;
      let postcode = constants.FIRST_PAGES[location].postcode;
      await page.goto(url, { waitUntil: 'networkidle0' });
      await page.waitFor(5000);
      await page.click('#changeLocationBar');
      await page.waitFor(1000);
      await page.type('#search-form > p', postcode);
      await page.waitFor(1000);
      await page.keyboard.press('Enter');
      await page.waitFor(1000);
      await page.goto(url, { waitUntil: 'networkidle0' });
      let bodyHtml = await page.evaluate(() => document.body.innerHTML);
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
      categoryUrlLists[location] = urlsOfEachCategory;
    }
    await browser.close();
    return categoryUrlLists;
  } catch (err) {
    console.log(err);
  }
};
let PRODUCTS = [];

const getJsonData2 = (apiUrl, categoryId, location) => {
  console.log(apiUrl);
  let product;
  axios
    .get(apiUrl)
    .then((response) => {
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
      product = {
        apiUrl: apiUrl,
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
        packageSize:
          data.a.O3[0] === undefined ? null : data.a.O3[0].toLowerCase(),
        barcode: data.a.B === undefined ? null : data.a.B,
        isAvailable: true,
        locations: [location],
      };
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      return product;
    });
};

const getJsonData = async (apiUrl, categoryId, location) => {
  console.log(apiUrl);
  const headers = {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.0 Safari/537.36',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    cookie: `_ga=GA1.3.1179951207.1586935869; firstVisit=1586935871.801; analytics_integration=analytics%3D18014444; aam_uuid=80876709561758026992580714384617944042; gs_v_GSN-452615-M=; _hjid=a4cb5798-fc23-4ccc-a536-8d692350d788; __utma=179916539.1179951207.1586935869.1588218032.1588939092.4; __utmz=179916539.1588939092.4.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _gcl_au=1.1.945244074.1589429051; UID=-1002|20529|null|G; mbox=PC#5a50de6012f14d709c6b6505f93bfb76.29_0#1652757576|session#3f98a4582b1e4f3c894f50d0072e8c09#1592349814; AK_bns=f2ff0a61-83bc-6295-8af9-0773d963f820; _gid=GA1.3.1182544878.1592825697; rslc=20529|27101|7043; cache-generation=20200623T153514; JSESSIONID=0000Z5A_hJNb2VHwOWoDzvg9M7Z:17rppadto; WC_SESSION_ESTABLISHED=true; WC_PERSISTENT=q3CfS%2BL8FTwdZfK%2FaR7r7hwbVrQ%3D%0A%3B2020-06-24+21%3A25%3A18.045_1586935867538-94333_20529; WC_AUTHENTICATION_-1002=-1002%2CYy8hdLjV19AaqmMZpjdrBU0r2pM%3D; WC_ACTIVEPOINTER=-1%2C20529; WC_USERACTIVITY_-1002=-1002%2C20529%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2CBPU2wtdHzbnWUKVcwG8pZOtlHtW5bOFFifrFpzWsgZ0LN9FEiIE13V%2BZNcVKxChXK9gtT1m%2BceS%2FhS3nbFjwTWhFEpgJFF0lq8a6avh0Lzf74kTf9GZKpdCYryYuw6kdfQy48zbuuAHULZts032RBdq33uRrsxe0AGKbxaVXNQIvllmcm3qufOg69QAxl7ttxHJ0s%2BpXOHfWvFQylDQPjQ%3D%3D; WC_GENERIC_ACTIVITYDATA=[12794931185%3Atrue%3Afalse%3A0%3AZikSg3%2FzPUsBx9zRT3FRCFbB8QE%3D][com.ibm.commerce.store.facade.server.context.StoreGeoCodeContext|null%26null%26null%26null%26null%26null][CTXSETNAME|Store][com.ibm.commerce.context.globalization.GlobalizationContext|-1%26AUD%26-1%26AUD][au.com.coles.framework.session.SessionContext|7b2c46eb-7e4f-4e9e-9b43-f06be5835c8c][com.ibm.commerce.context.base.BaseContext|20529%26-1002%26-1002%26-1][com.ibm.commerce.context.experiment.ExperimentContext|null][com.ibm.commerce.context.entitlement.EntitlementContext|10502%26null%2610502%26-2000%26null%26null%26null][com.ibm.commerce.giftcenter.context.GiftCenterContext|null%26null%26null][com.ibm.commerce.context.audit.AuditContext|1586935867538-94333][com.ibm.commerce.catalog.businesscontext.CatalogContext|27101%26null%26false%26false%26false][au.com.coles.commerce.businesscontext.MemberAttributeContext|null][com.ibm.commerce.context.ExternalCartContext|null]; sqaccessId.772312=5IhX4FXW3U4NyZn7:1593001517:bb7f37637907bc82f93d044898d21b84dc394f00a4f15cf7f71c1e96cf219f2f; canBrowseRestrictedProductsFlag=0; AMCVS_0B3D037254C7DE490A4C98A6%40AdobeOrg=1; AMCV_0B3D037254C7DE490A4C98A6%40AdobeOrg=1585540135%7CMCIDTS%7C18438%7CMCMID%7C87357843086168658693086683621196880620%7CMCAAMLH-1593602726%7C8%7CMCAAMB-1593602726%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1593005126s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; s_sq=%5B%5BB%5D%5D; s_cc=true; gs_u_GSN-452615-M=9671fbb7a926f56d281d6090e080bde4:62299:75494:1592997927737; MK_iplz=ujS91dUwAHXim%2Fb5dNqiWg%3D%3D%3A%3AKk6pnFQbQtZ9817iybsbj4D4bByZYnzYeR8lkIcbEks%2BuWfl%2FOTcEG7vBLQ41dCsuuBpcE9OB6VGUz52gpbPuW1QMsESltT5NWpVoKeovk1RDaln87qPkxiFEOezpUCTxyCUxgWTKTwUQH3mXDPHf3mFgBdyUWml64HQKrqrV50%2FZlhytlIjeyyiZyZcBhwKQBFNN3OZKmn6Hqa9Psh6tq2csXEvDVbN6IYllv7rNP5I3fYiLsbEEx9TswULWY13mJ%2FmKqzLl7LJwMsoOKZtKnizikM8zEwQQ4JwFwT3BIv%2B3XyIYEfHfu5raBFbHbilNmyV09uJ63cLHGOjQBZOBtpqNyuJUqj2IpvZIcKHiJqEieF81vtX3AWcNiChuj3Fr%2FfAiNGj75AeTYcSKinLQQh5UFtHhIHcLtKydXYjKF8WFg8NXGT1E8QixTZnXTMs%2FY1gL%2Bf4xCreqgss8KFlW3t4PhjxJQalsQBf82i1wB4ZOSDOg1K1%2BS8nBOaD9yeMZtAWxJ9xFMSxIvCsQ2B0l%2BuA0mbSldd7aOnfI5eusc4pPdD1pWgZPsZ5gMA9V%2Blu`,
  };
  let response = await axios.get(apiUrl, { headers });
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
    apiUrl: apiUrl,
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
    locations: [location],
  };
  return product;
};

const fetchProducts = async (filePath) => {
  puppeteer.use(StealthPlugin());
  let browser = await puppeteer.launch({
    headless: true,
  });
  const rawdata = fs.readFileSync(filePath);
  const categoryUrlLists = JSON.parse(rawdata);
  let page = await browser.newPage();
  try {
    for (let location of Object.keys(categoryUrlLists)) {
      console.log(`Fetching products from ${location.toUpperCase()}...`);
      const postcode = constants.FIRST_PAGES[location].postcode;
      await Promise.all([
        page.goto(constants.FIRST_PAGES[location].url, {
          timeout: 0,
          waitUntil: 'networkidle0',
        }),
        page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle2' }),
        page.waitForSelector('#changeLocationBar', { visible: true }),
      ]);
      page.waitFor(5000);
      await page.click('#changeLocationBar');
      await page.waitFor(1000);
      await page.type('#search-form > p', postcode);
      await page.waitFor(1000);
      await page.keyboard.press('Enter');
      await page.waitFor(1000);
      let urlsOfEachCategory = categoryUrlLists[location];
      for (categoryId in urlsOfEachCategory) {
        console.log(`Fetching ${categoryId}...`);
        for (let i = 0; i < urlsOfEachCategory[categoryId].length; i++) {
          console.log(`Page ${i + 1}`);
          await page.goto(urlsOfEachCategory[categoryId][i], {
            timeout: 0,
            waitUntil: 'networkidle0',
          });
          let bodyHtml = await page.evaluate(() => document.body.innerHTML);
          let $ = cheerio.load(bodyHtml);
          let productTags = $('.product-title').find($('a'));
          for (let j = 0; j < productTags.length; j++) {
            let n = productTags[j].attribs.href.split('/');
            let apiUrl = constants.API + n[n.length - 1] + '?catalogId=27101';
            let filteredProducts = PRODUCTS.filter((p) => p.apiUrl === apiUrl);
            if (filteredProducts.length > 0) {
              if (filteredProducts.length > 1) {
                console.log(apiUrl);
              }
              PRODUCTS.map((p) => {
                if (p.apiUrl === apiUrl) {
                  if (!p.categoryIds.includes(categoryId)) {
                    p.categoryIds = p.categoryIds.concat([categoryId]);
                  }
                  if (!p.locations.includes(location)) {
                    p.locations = p.locations.concat([location]);
                  }
                }
                p.categoryIds = [...new Set(p.categoryIds)];
                p.locations = [...new Set(p.locations)];
                return p;
              });
              continue;
            }
            let data = getJsonData2(apiUrl, categoryId, location);
            if (data === null) continue;
            PRODUCTS.push(data);
          }
        }
      }
    }
    await browser.close();
    return PRODUCTS;
  } catch (err) {
    console.log(err);
  }
};

module.exports.fetchUrls = fetchUrls;
module.exports.fetchProducts = fetchProducts;

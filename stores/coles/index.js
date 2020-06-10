CATEGORIES = [
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
WEB = 'https://shop.coles.com.au';
API =
  'https://shop.coles.com.au/search/resources/store/20529/productview/bySeoUrlKeyword/';
FIRST_PAGE =
  'https://shop.coles.com.au/a/richmond-south/specials/search/half-price-specials';
COOKIE_PATH = './cookie.txt';

const cheerio = require('cheerio');
const fs = require('fs');
const helper = require('./helper');

// Use firstPageHtml to get available categories and get category URL list
const getCategoryUrlList = async () => {
  try {
    let firstPageHtml = await helper.fetchBodyHtml(FIRST_PAGE, COOKIE_PATH);
    let $ = cheerio.load(firstPageHtml);
    let categories = $("li[class='cat-nav-item']")
      .not('.is-disabled')
      .find($('.item-title'));
    let categoryUrlList = {};
    for (let i = 0; i < categories.length; i++) {
      let categoryName = categories[i].children[0].data;
      if (CATEGORIES.includes(categoryName)) {
        categoryUrlList[
          helper.getCategoryId(categoryName)
        ] = `${WEB}${categories[i].parent.parent.attribs.href}`;
      }
    }
    return categoryUrlList;
  } catch (err) {
    console.log(`${err}`);
  }
};

// For each category URL, get number of pages and urls
const getUrlsOfEachCategory = async () => {
  let urlsOfEachCategory = {};
  let categoryUrlList = await getCategoryUrlList();
  for (categoryId in categoryUrlList) {
    urlsOfEachCategory[categoryId] = [];
    let bodyHtml = await helper.fetchBodyHtml(
      categoryUrlList[categoryId],
      COOKIE_PATH
    );
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
        : helper.getPaginationUrls(categoryUrlList[categoryId], pageNumber);
  }

  // merge health-beauty2 and health-beauty
  urlsOfEachCategory['health-beauty'] = urlsOfEachCategory[
    'health-beauty'
  ].concat(urlsOfEachCategory['health-beauty2']);
  // delete health-beauty2 in urlsOfEachCategory
  delete urlsOfEachCategory['health-beauty2'];
  return urlsOfEachCategory;
};

// For each page, get products
const getProducts = async () => {
  let urlsOfEachCategory = await getUrlsOfEachCategory();
  console.log(urlsOfEachCategory);
  let products = [];
  for (categoryId in urlsOfEachCategory) {
    console.log(`Fetching ${categoryId}`);
    for (let i = 0; i < urlsOfEachCategory[categoryId].length; i++) {
      let bodyHtml = await helper.fetchBodyHtml(
        urlsOfEachCategory[categoryId][i],
        COOKIE_PATH
      );
      let $ = cheerio.load(bodyHtml);
      let productTags = $('.product-title').find($('a'));
      for (let j = 0; j < productTags.length; j++) {
        let n = productTags[j].attribs.href.split('/');
        let url = API + n[n.length - 1] + '?catalogId=27101';
        let data = await helper.getJsonData(url, categoryId, COOKIE_PATH, WEB);
        if (data === null) continue;
        products.push(data);
      }
    }
  }
  console.log(`Has total ${products.length} products`);
  return products;
};

// Write products to file
const writeProductsToFile = async () => {
  let products = await getProducts();
  fs.writeFileSync('products.json', JSON.stringify(products));
};
writeProductsToFile();

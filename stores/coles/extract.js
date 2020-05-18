CATEGORIES = ['Bread & Bakery', 'Dairy, Eggs & Meals', 'Meat, Seafood & Deli', 'Pantry', 'Frozen', 'Drinks', 'International Foods', 'Healthy Living', 'Household', 'Health & Beauty'];
WEB = 'https://shop.coles.com.au'
API = 'https://shop.coles.com.au/search/resources/store/20501/productview/bySeoUrlKeyword/'

async function getJsonData(url) {
  const axios = require('axios');
  const fs = require('fs')
  const params = {
    cookie: fs.readFileSync('cookie.txt', 'utf8')
  };
  const response = await axios.get(url, { params });
  const data = response.data.catalogEntryView[0];
  const product = {
    store: 'coles',
    name: data.n,
    price: Number(data.p1['o']),
    oldPrice: Number(data.p1['l4']),
    category: '',
    imagePath: data.fi,
    hasCupImage: true,
    cupPrice: data.u2,
    unit: data.a.U,
    packageSize: data.a.S5[0],
    barcode: data.a.B[0],
    brand: data.m
  };
  return product;
}

async function ExtractHtml() {
  let category_urls = [];
  try {
    const cheerio = require('cheerio');
    const fs = require('fs');
    const $ = cheerio.load(fs.readFileSync('coles.html'));
    let page_number = $("ul[class='pagination']").find($('.page-number').last().children().find($('.number')))[0].children[0].data
    console.log(page_number);
    return;
    let products = $('.product-title').find($('a'));
    for (let i = 0; i < products.length; i++) {
      let n = products[i].attribs.href.split('/');
      let url = API + n[n.length - 1];
      console.log(url);
      const data = await getJsonData(url);
      console.log(data);
      break;
    }
  } catch (erron) {
    console.log(`Erron in cheerio part: ${erron}`);
  }
}
ExtractHtml();

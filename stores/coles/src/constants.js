module.exports.CATEGORIES = [
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
module.exports.WEB = 'https://shop.coles.com.au';
module.exports.API =
  'https://shop.coles.com.au/search/resources/store/20529/productview/bySeoUrlKeyword/';
module.exports.COOKIE_PATH = './cookie.txt';

module.exports.FIRST_PAGES = {
  vic: {
    url:
      'https://shop.coles.com.au/a/hoppers-crossing/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_vic.txt',
    city: 'Melbourne',
    postcode: '3038',
  },
  sa: {
    url:
      'https://shop.coles.com.au/a/churchill-centre/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_sa.txt',
    city: 'Adelaide',
    postcode: '5000',
  },
  qld: {
    url:
      'https://shop.coles.com.au/a/fairfield/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_qld.txt',
    city: 'Brisbane',
    postcode: '4000',
  },
  nsw: {
    url:
      'https://shop.coles.com.au/a/alexandria/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_nsw.txt',
    city: 'Sydney',
    postcode: '2000',
  },
  wa: {
    url:
      'https://shop.coles.com.au/a/dianella/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_wa.txt',
    city: 'Perth',
    postcode: '6000',
  },
  tas: {
    url:
      'https://shop.coles.com.au/a/glenorchy/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_tas.txt',
    city: 'Hobart',
    postcode: '7000',
  },
  act: {
    url:
      'https://shop.coles.com.au/a/queabeyan/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_act.txt',
    city: 'Canberra',
    postcode: '2601',
  },
  nt: {
    url:
      'https://shop.coles.com.au/a/casuarina/specials/search/half-price-specials',
    cookiePath: './cookie/cookie_nt.txt',
    city: 'Darwin',
    postcode: '0800',
  },
};

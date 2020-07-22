import fs from 'fs';

const colesProductsPath =
  './data/products/half-price/coles-half-price-products.json';
const colesCategoriesPath =
  './data/products/half-price/coles-half-price-categories.json';
const woolworthsProductsPath =
  './data/products/half-price/woolworths-half-price-products.json';
const woolworthsCategoriesPath =
  './data/products/half-price/woolworths-half-price-categories.json';
const chemistWarehouseProductsPath =
  './data/products/half-price/chemist-warehouse-half-price-products.json';
const chemistWarehouseCategoriesPath =
  './data/products/half-price/chemist-warehouse-half-price-categories.json';

const createStoreDataFile = (storeId) => {
  let storeData = {};
  let filename = '';
  switch (storeId) {
    case 'coles':
      storeData = {
        products: JSON.parse(fs.readFileSync(colesProductsPath)),
        categories: JSON.parse(fs.readFileSync(colesCategoriesPath)),
      };
      filename = 'coles.json';
      break;
    case 'woolworths':
      storeData = {
        products: JSON.parse(fs.readFileSync(woolworthsProductsPath)),
        categories: JSON.parse(fs.readFileSync(woolworthsCategoriesPath)),
      };
      filename = 'woolworths.json';
      break;
    case 'chemist-warehouse':
      storeData = {
        products: JSON.parse(fs.readFileSync(chemistWarehouseProductsPath)),
        categories: JSON.parse(fs.readFileSync(chemistWarehouseCategoriesPath)),
      };
      filename = 'chemist-warehouse.json';
      break;
  }
  fs.writeFileSync(`./data/${filename}`, JSON.stringify(storeData));
};

export default createStoreDataFile;

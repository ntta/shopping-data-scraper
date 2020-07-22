// import { colesProductsPath } from '../variables/colesVariables';
// import { woolworthsProductsPath } from '../variables/woolworthsVariables';
// import { chemistWarehouseProductsPath } from '../variables/chemistVariables';
import fs from 'fs';

const colesProductsPath =
  './data/products/half-price/coles-half-price-products.json';
const woolworthsProductsPath =
  './data/products/half-price/woolworths-half-price-products.json';
const chemistWarehouseProductsPath =
  './data/products/half-price/chemist-warehouse-half-price-products.json';

let allProducts = {};

const collectProductsFromStores = () => {
  if (fs.existsSync(colesProductsPath)) {
    let data = fs.readFileSync(colesProductsPath);
    allProducts['coles'] = JSON.parse(data);
  }
  if (fs.existsSync(woolworthsProductsPath)) {
    let data = fs.readFileSync(woolworthsProductsPath);
    allProducts['woolworths'] = JSON.parse(data);
  }
  if (fs.existsSync(chemistWarehouseProductsPath)) {
    let data = fs.readFileSync(chemistWarehouseProductsPath);
    allProducts['chemist-warehouse'] = JSON.parse(data);
  }
};

const findSimilarProducts = () => {
  collectProductsFromStores();
  let comparedStores = [];
  for (let store of Object.keys(allProducts)) {
    for (let product of allProducts[store]) {
      for (let comparingStore of Object.keys(allProducts).filter(
        (s) => s !== store && !comparedStores.includes(s)
      )) {
        for (let comparingProduct of allProducts[comparingStore]) {
          if (areSimilar(product, comparingProduct)) {
            console.log(`Product: ${product.name}`);
            console.log(`Store: ${store}`);
            console.log(`Comparing Product: ${comparingProduct.name}`);
            console.log(`Comparing Store: ${comparingStore}`);
            console.log('----------------------------------');
            if (!alreadyHasThis(product, comparingProduct)) {
              product.similarProducts.push({
                productId: comparingProduct.id,
                storeId: comparingProduct.storeId,
              });
            }
            if (!alreadyHasThis(comparingProduct, product)) {
              comparingProduct.similarProducts.push({
                productId: product.id,
                storeId: product.storeId,
              });
            }
          }
        }
      }
    }
    comparedStores.push(store);
  }
  rewriteToFile();
};

const rewriteToFile = () => {
  for (let store of Object.keys(allProducts)) {
    fs.writeFileSync(
      `./data/products/half-price/${store}-half-price-products.json`,
      JSON.stringify(allProducts[store])
    );
    // fs.writeFileSync(
    //   `./data/products/${store}-special-products.json`,
    //   JSON.stringify(allProducts[store])
    // );
  }
};

const areSimilar = (product, comparingProduct) => {
  const isSimilarName = similarity(product.name, comparingProduct.name) >= 0.8;
  let isSimilarBrand = false;
  if (product.brand.trim() === '' || comparingProduct.brand.trim() === '') {
    isSimilarBrand = true;
  } else {
    isSimilarBrand = similarity(product.brand, comparingProduct.brand) >= 0.8;
  }
  return isSimilarName && isSimilarBrand;
};

// Use Levenshtein distance
// https://en.wikipedia.org/wiki/Levenshtein_distance

const similarity = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength == 0) {
    return 0.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
};

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const alreadyHasThis = (product, similarProduct) => {
  for (let simProd of product.similarProducts) {
    if (
      simProd.id === similarProduct.id &&
      simProd.storeId === similarProduct.storeId
    ) {
      return true;
    }
  }
  return false;
};

export default findSimilarProducts;

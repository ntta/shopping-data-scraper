import { colesProductsPath } from '../variables/colesVariables';
import { woolworthsProductsPath } from '../variables/woolworthsVariables';
import fs from 'fs';

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
};

const findSimilarProducts = () => {
  collectProductsFromStores();
  for (let store of Object.keys(allProducts)) {
    for (let product of allProducts[store]) {
      for (let comparingStore of Object.keys(allProducts).filter(
        (s) => s !== store
      )) {
        for (let comparingProduct of allProducts[comparingStore]) {
          if (areSimilar(product, comparingProduct)) {
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
  }
};

const areSimilar = (product, comparingProduct) => {
  // need to implement
};

const alreadyHasThis = (product, similarProduct) => {
  // check if product already has similarProduct in similarProducts
};

export default findSimilarProducts;

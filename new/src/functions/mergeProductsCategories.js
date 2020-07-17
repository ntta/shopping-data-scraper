import fs from 'fs';

const path = './data/products/';

const mergeProductsCategories = () => {
  const allFiles = fs.readdirSync(path);
  let coles = { products: [], categories: [] };
  let woolworths = { products: [], categories: [] };
  for (let file of allFiles) {
    const filePath = path + file;
    if (file.includes('products')) {
      if (file.includes('coles')) {
        coles.products.push(filePath);
        continue;
      }

      if (file.includes('woolworths')) {
        woolworths.products.push(filePath);
        continue;
      }
    } else {
      if (file.includes('coles')) {
        coles.categories.push(filePath);
        continue;
      }

      if (file.includes('woolworths')) {
        woolworths.categories.push(filePath);
        continue;
      }
    }
    continue;
  }
  mergeColes(coles);
  mergeWoolworths(woolworths);
};

const mergeColes = (coles) => {};
const mergeWoolworths = (woolworths) => {};

export default mergeProductsCategories;

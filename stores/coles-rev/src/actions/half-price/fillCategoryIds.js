import fs from 'fs';

const blacklist = [
  'back-to-school',
  'convenience-meals',
  'entertaining-at-home',
  'fruit-vegetables',
  'winter',
];

const fillCategoryIds = (products) => {
  let resultProducts = [...products];
  const allProducts = getAllProducts();
  resultProducts.map((product) => {
    for (let id of Object.keys(allProducts)) {
      if (!blacklist.includes(id)) {
        let categoryId = getCategoryId(id);
        for (let catProd of allProducts[id]) {
          if (product.id === catProd.id) {
            product.categoryIds.push(categoryId);
            product.categoryIds = [...new Set(product.categoryIds)];
          }
        }
      }
    }
  });
  fs.writeFileSync(
    './data/products/half-price-coles-id.json',
    JSON.stringify(resultProducts)
  );
};

const getAllProducts = () => {
  let products = {};
  const path = './data/products/coles/';
  const folder = fs.readdirSync(path);
  for (let file of folder) {
    let categoryId = file.replace('.json', '');
    let data = fs.readFileSync(path + file);
    products[categoryId] = JSON.parse(data);
  }
  return products;
};

const getCategoryId = (id) => {
  if (id === 'dairy-eggs-meals') return 'dairy-eggs-fridge';
  if (id === 'frozen') return 'freezer';
  if (id === 'healthy-living') return 'health-beauty';
  if (id === 'international-fods') return 'international-foods';
  return id;
};

export default fillCategoryIds;

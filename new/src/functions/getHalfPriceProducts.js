import fs from 'fs';

const aLocations = ['VIC', 'NSW', 'WA', 'SA', 'ACT', 'NT', 'TAS', 'QLD'].sort();

const getHalfPriceProducts = () => {
  const storeIds = ['coles', 'woolworths', 'chemist-warehouse'];
  for (let storeId of storeIds) {
    getFromStore(storeId);
  }
};

const getFromStore = (storeId) => {
  const products = JSON.parse(
    fs.readFileSync(`./data/products/${storeId}-special-products.json`)
  );

  let newProducts = [];
  for (let product of products) {
    if (
      product.locations[Object.keys(product.locations)[0]].discountRate >= 50
    ) {
      newProducts.push(polishProduct(product));
    }
  }
  fs.writeFileSync(
    `./data/products/half-price/${storeId}-half-price-products.json`,
    JSON.stringify(newProducts)
  );
};

const polishProduct = (product) => {
  let polishedProduct = { ...product };
  const productLocations = Object.keys(polishedProduct.locations).sort();
  for (let location of productLocations) {
    polishedProduct.locations[location].price = Number(
      polishedProduct.locations[location].price
    );
    polishedProduct.locations[location].orgPrice = Number(
      polishedProduct.locations[location].orgPrice
    );
  }
  if (
    JSON.stringify(aLocations) === JSON.stringify(productLocations) &&
    allAreEqual(product)
  ) {
    delete polishedProduct.locations;
    polishedProduct['locations'] = {
      ALL: {
        price: product.locations['VIC'].price,
        discountRate: product.locations['VIC'].discountRate,
        promo: product.locations['VIC'].promo,
        orgPrice: product.locations['VIC'].orgPrice,
      },
    };
  }
  if (typeof product.imageUrls === 'string') {
    polishedProduct.imageUrls = [polishedProduct.imageUrls];
  }
  polishedProduct.similarProducts = [];
  return polishedProduct;
};

const allAreEqual = (product) => {
  const productLocations = Object.keys(product.locations);
  if (productLocations.length === 8) {
    const price = product.locations['VIC'].price;
    const discountRate = product.locations['VIC'].discountRate;
    const promo = product.locations['VIC'].promo;
    const orgPrice = product.locations['VIC'].orgPrice;
    for (let location of productLocations) {
      if (
        product.locations[location].price !== price ||
        product.locations[location].discountRate !== discountRate ||
        product.locations[location].promo !== promo ||
        product.locations[location].orgPrice !== orgPrice
      ) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

export default getHalfPriceProducts;

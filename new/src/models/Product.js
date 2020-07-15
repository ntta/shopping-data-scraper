export default class Product {
  constructor(
    id,
    name,
    brand,
    imageUrls,
    storeId,
    packageSize,
    cupPrice,
    locations,
    productCategories,
    similarProductIds
  ) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.imageUrls = imageUrls;
    this.storeId = storeId;
    this.packageSize = packageSize;
    this.cupPrice = cupPrice;
    this.locations = locations;
    this.productCategories = productCategories;
    this.similarProductIds = similarProductIds;
  }
}

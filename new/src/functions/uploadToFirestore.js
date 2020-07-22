import admin from 'firebase-admin';
import fs from 'fs';
import serviceAccount from '../../half-price-deals-dev-firebase-adminsdk-fz38j-a5ceba6c4e.json';

const uploadToFirestore = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://half-price-deals-dev.firebaseio.com',
  });
  const db = admin.firestore();
  const data = fs.readFileSync('./data/products/coles-special-products.json');
  const products = JSON.parse(data);
  const storeId = 'coles';
  console.log(products.length);

  for (let product of products) {
    await db
      .collection('stores')
      .doc(storeId)
      .collection('products')
      .doc(product.id)
      .set(polishProduct(product));
  }
};

const polishProduct = (product) => {
  let polishedProduct = { ...product };
  delete polishedProduct.id;
  delete polishedProduct.storeId;
  return polishedProduct;
};

export default uploadToFirestore;

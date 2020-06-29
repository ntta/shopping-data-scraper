const inquirer = require('inquirer');
const fs = require('fs');
const constants = require('./src/constants');
const helper = require('./src/helper');

const choices = [
  { title: 'Fetch URL of each category', action: 'fetch_urls' },
  { title: 'Fetch products of each category', action: 'fetch_products' },
];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Actions: ',
      choices: Object.values(choices).map((c) => {
        return c.title;
      }),
      filter: function (val) {
        return choices.filter((c) => {
          if (c.title === val) {
            return c.action;
          }
        })[0].action;
      },
    },
  ])
  .then(async (answers) => {
    const urlPath = './data/urls.json';
    const productPath = './data/products.json';
    switch (answers.action) {
      case 'fetch_urls':
        const urls = await helper.fetchUrls();
        try {
          if (fs.existsSync(urlPath)) {
            fs.unlinkSync(urlPath);
          }
          fs.writeFileSync(urlPath, JSON.stringify(urls));
        } catch (err) {
          console.log('Cannot check file path');
        }
        return;
      case 'fetch_products':
        try {
          if (fs.existsSync(urlPath)) {
            const products = await helper.fetchProducts(urlPath);
            fs.writeFileSync(productPath, JSON.stringify(products), {
              encoding: 'utf8',
            });
          } else {
            console.log('Cannot find URL file');
          }
        } catch (err) {
          console.log(err);
        }
        return;
    }
  });

// Options:
// 1. Choose location: vic, tas, sa, qld, wa, nsw, nt, act
// const choices = [
//   { title: 'Fetch URL of each category', action: 'fetch_urls' },
//   { title: 'Fetch products of each category', action: 'fetch_products' },
// ];
//
// inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'location',
//       message: 'Choose location: ',
//       choices: ['VIC', 'TAS', 'NSW', 'QLD', 'WA', 'SA', 'NT', 'ACT'],
//     },
//     {
//       type: 'list',
//       name: 'action',
//       message: 'Actions: ',
//       choices: Object.values(choices).map((c) => {
//         return c.title;
//       }),
//       filter: function (val) {
//         return choices.filter((c) => {
//           if (c.title === val) {
//             return c.action;
//           }
//         })[0].action;
//       },
//     },
//   ])
//   .then(async (answers) => {
//     console.log(answers);
//     const location = answers.location;
//     const filePath = `./urls/${location.toLowerCase()}/urls.json`;
//     let urls;
//     switch (answers.action) {
//       case 'fetch_urls':
//         urls = await helper.fetchUrls(location);
//         try {
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//           fs.writeFileSync(filePath, JSON.stringify(urls));
//         } catch (err) {
//           console.log('Cannot check file path');
//         }
//         return;
//       case 'fetch_products':
//         try {
//           if (fs.existsSync(filePath)) {
//             const products = await helper.fetchProducts(location, filePath);
//             const productsFilePath = `./products/${location.toLowerCase()}/products.json`;
//             if (fs.existsSync(productsFilePath)) {
//               fs.unlinkSync(productsFilePath);
//             }
//             fs.writeFileSync(productsFilePath, JSON.stringify(products));
//           } else {
//             console.log(`File '${filePath}' doesn't exist`);
//           }
//         } catch (err) {
//           console.log('Cannot check file path');
//         }
//         return;
//     }
//   });
// 2. Fetch URL of each category, save to file
// 3. For each URL, write products to file

const inquirer = require('inquirer');
const fs = require('fs');
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

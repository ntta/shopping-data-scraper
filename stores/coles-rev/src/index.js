import inquirer from 'inquirer';
import getCategorisedColesProducts from './actions/getCategorisedColesProducts';
import { readLineFromFile } from './playground';

// Actions
const GET_PRODUCTS_FROM_COLES_CATEGORY = 'get_products_from_coles_category';
const PLAYGROUND = 'playground';
const EXIT = 'exit';

const choices = [
  {
    title: 'Get all products of one category of Coles',
    action: GET_PRODUCTS_FROM_COLES_CATEGORY,
  },
  { title: 'Playground', action: PLAYGROUND },
  { title: 'Exit', action: EXIT },
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
      filter: (val) => {
        return choices.filter((c) => {
          if (c.title === val) {
            return c.action;
          }
        })[0].action;
      },
    },
  ])
  .then(async (answers) => {
    switch (answers.action) {
      case GET_PRODUCTS_FROM_COLES_CATEGORY:
        const urls = readLineFromFile('./data/urls.txt');
        for (let url of urls) {
          await getCategorisedColesProducts(url);
        }
        return;
      case PLAYGROUND:
        const data = readLineFromFile('./data/urls.txt');
        console.log(data);
        return;
      case EXIT:
        return;
    }
  });

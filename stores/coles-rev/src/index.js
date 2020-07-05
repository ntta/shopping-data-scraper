import inquirer from 'inquirer';
import getAllColesProducts from './actions/getAllColesProducts';

// Actions
const GET_ALL_COLES_PRODUCTS = 'get_coles_products';

const choices = [
  { title: 'Get all products from Coles', action: GET_ALL_COLES_PRODUCTS },
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
  .then((answers) => {
    switch (answers.action) {
      case GET_ALL_COLES_PRODUCTS:
        getAllColesProducts();
        return;
    }
  });

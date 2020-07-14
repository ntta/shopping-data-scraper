import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
import fs from 'fs';
import { chemistCategoriesUrl, chemistUrl } from '../variables';

const BLACKLIST = ['prescriptions', 'travel-medicine-tma-b2b-products-only'];

const getChemistCategories = async () => {
  try {
    puppeteer.use(StealthPlugin());
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    // Navigate to chemistCategoriesUrl and enter postcode
    await page.goto(chemistCategoriesUrl, { waitUntil: 'domcontentloaded' });
    let bodyHtml = await page.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHtml);
    let allUrls = [];
    $('#p_lt_ctl09_pageplaceholder_p_lt_ctl00_wCM_AMS_tg_tvn0Nodes')
      .children('table')
      .each((i, elm) => {
        let categoryUrl =
          chemistUrl +
          $(elm).find('.CategoryTreeItem').find('a').attr('href').toString();
        let categoryId = getCategoryId(categoryUrl);
        let categoryNumber = getCategoryNumber(categoryUrl);
        let categoryName = $(elm)
          .find('.CategoryTreeItem')
          .find('.Name')
          .text()
          .toString()
          .trim();
        let subCategories = [];
        if (!BLACKLIST.includes(categoryId) && $(elm).next().has('div')) {
          $(elm)
            .next()
            .children('table')
            .each((subI, subElm) => {
              let subCategoryUrl =
                chemistUrl +
                $(subElm)
                  .find('.CategoryTreeItem')
                  .find('a')
                  .attr('href')
                  .toString();
              let subCategoryId = getCategoryId(subCategoryUrl);
              let subCategoryNumber = getCategoryNumber(subCategoryUrl);
              let subCategoryName = $(subElm)
                .find('.CategoryTreeItem')
                .find('.Name')
                .text()
                .toString()
                .trim();
              subCategories.push({
                categoryNumber: subCategoryNumber,
                subCategoryId,
                subCategoryName,
                subCategoryUrl,
              });
            });
        }
        allUrls.push({ categoryId, categoryName, categoryUrl, subCategories });
      });
    fs.writeFileSync(
      './data/chemist-category-urls.json',
      JSON.stringify(allUrls)
    );
    await browser.close();
  } catch (err) {
    console.log(err);
    return;
  }
};

const getCategoryId = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 1];
};

const getCategoryNumber = (str) => {
  const parts = str.split('/');
  return parts[parts.length - 2];
};

export default getChemistCategories;

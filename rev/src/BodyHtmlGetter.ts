import puppeteer from 'puppeteer';

export class BodyHtmlGetter {
  constructor(
    public url: string,
    public cookie: string,
    public headless: boolean = false
  ) {}

  async get(): Promise<string> {
    const browser = await puppeteer.launch({ headless: this.headless });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
      'Accept-Language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'cache-control': 'no-cache',
      cookie: this.cookie,
    });
    await page.goto(this.url, { waitUntil: 'load', timeout: 0 });
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    await browser.close();
    return bodyHtml;
  }
}

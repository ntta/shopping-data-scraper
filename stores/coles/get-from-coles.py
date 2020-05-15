import bs4, json, requests

#'https://api.coles.com.au/customer/v1/coles/products/search?limit=20&q=Drinks&start=40&storeId=7716&type=SKU'
def api():
    url = 'https://api.coles.com.au/customer/v1/coles/products/search?limit=21&q=Frozen&start=1&storeId=7994&type=SKU'
    h = {
    'Accept-Encoding': 'gzip'
    ,'Connection': 'keep-alive'
    ,'Accept': '*/*'
    ,'User-Agent': 'Shopmate/3.4.1 (iPhone; iOS 11.4.1; Scale/3.00)'
    ,'X-Coles-API-Key': '046bc0d4-3854-481f-80dc-85f9e846503d'
    ,'X-Coles-API-Secret': 'e6ab96ff-453b-45ba-a2be-ae8d7c12cadf'
    ,'Accept-Language': 'en-AU;q=1'
    }
    res = requests.get(url, headers=h)
    print(res)
    res.raise_for_status()
    soup = bs4.BeautifulSoup(res.text, 'html.parser')

    print(soup)


if __name__ == '__main__':
    f = open("coles.html", "r")
    html = f.read()
    soup = bs4.BeautifulSoup(html, 'html.parser')
    for product in soup.select('li[class=cat-nav-item]'):
        if 'is-disabled' in product['class']:
            continue
        print(product.find_next('span', class_='item-title').text)

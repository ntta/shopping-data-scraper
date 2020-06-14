import os, json

WOOLWORTHS_PATH = './stores/woolworths/products.json'
COLES_PATH = './stores/coles/products.json'
DATA_PATH = './data/all-products.json'

if __name__ == '__main__':
    coles = []
    woolworths = []
    if os.path.exists(COLES_PATH):
        with open(COLES_PATH, 'r', encoding='utf-8') as colesFile:
            coles = coles + list(json.load(colesFile))

    if os.path.exists(WOOLWORTHS_PATH):
        with open(WOOLWORTHS_PATH, 'r', encoding='utf-8') as woolworthsFile:
            woolworths = woolworths + list(json.load(woolworthsFile))

    allProducts = coles + woolworths
    fileFormat = {
        'products': allProducts,
        'data-date': ''
    }
    with open(DATA_PATH, 'w', encoding='utf-8') as dataFile:
        json.dump(fileFormat, dataFile)
    print(f'Total {len(allProducts)} products')
